import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import { Construct } from 'constructs';
import { LoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancing';
import { ApplicationListener, ApplicationListenerRule, ApplicationProtocol, ApplicationProtocolVersion, ApplicationTargetGroup, IApplicationLoadBalancerTarget, IApplicationTargetGroup, IpAddressType, ListenerAction, ListenerCondition, Protocol, TargetType } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { IpTarget } from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import { config } from '../config/config';
import { Duration } from 'aws-cdk-lib';
import { ApplicationMultipleTargetGroupsFargateService, ApplicationMultipleTargetGroupsFargateServiceProps, ScheduledEc2TaskDefinitionOptions } from 'aws-cdk-lib/aws-ecs-patterns';
import { SelectedSubnets, SubnetSelection } from 'aws-cdk-lib/aws-ec2';

export class EcsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const githubUserName = new cdk.CfnParameter(this, "githubUserName", {
      type: "String",
      description: "Github username for source code repository"
    })

    const githubRepository = new cdk.CfnParameter(this, "githubRespository", {
      type: "String",
      description: "Propapay Authentication Service API - Github source code repository",
      default: "propapay-authentication-service"
    })

    const githubPersonalTokenSecretName = new cdk.CfnParameter(this, "githubPersonalTokenSecretName", {
      type: "String",
      description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
      default: "/aws-samples/amazon-ecs-fargate-cdk-v2-cicd/github/personal_access_token"
    })
    //default: `${this.stackName}`

    const ecrRepo = new ecr.Repository(this, 'ecrRepo');

    /**
     * create a new vpc with single nat gateway
     */
    const vpc = ec2.Vpc.fromLookup(this, 'ecs-cdk-vpc', {
      vpcId: "vpc-019e94ba861d92f85"
    });

    const clusteradmin = new iam.Role(this, 'adminrole', {
      assumedBy: new iam.AccountRootPrincipal()
    });

    const cluster = new ecs.Cluster(this, "ecs-cluster", {
      vpc: vpc,
    });

    const logging = new ecs.AwsLogDriver({
      streamPrefix: "ecs-logs"
    });

    const taskrole = new iam.Role(this, `ecs-taskrole-${this.stackName}`, {
      roleName: `ecs-taskrole-${this.stackName}`,
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    // ***ecs contructs***

    const executionRolePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: [
        "ecr:getauthorizationtoken",
        "ecr:batchchecklayeravailability",
        "ecr:getdownloadurlforlayer",
        "ecr:batchgetimage",
        "logs:createlogstream",
        "logs:putlogevents"
      ]
    });


    const taskDef = new ecs.FargateTaskDefinition(this, "ecs-taskdef", {
      taskRole: taskrole,
      memoryLimitMiB: 2048,
    });

    taskDef.addToExecutionRolePolicy(executionRolePolicy);


    const baseImage = '539763292489.dkr.ecr.us-east-1.amazonaws.com/propapay-authentication-service'
    const container = taskDef.addContainer(config.serviceName, {
      image: ecs.ContainerImage.fromRegistry(baseImage),
      memoryLimitMiB: 2048,
      healthCheck: {
        command: [
          "CMD-SHELL",
          "curl -f http://localhost:5555/auth/health || exit 1"
        ],
        interval: Duration.seconds(240),
        timeout: Duration.seconds(60),
        retries: 5,
        startPeriod: Duration.seconds(30)
      },
    });

    container.addPortMappings({
      containerPort: config.port,
      protocol: ecs.Protocol.TCP
    });




    /*  cdk cannot manage loadbalancers it did not create
    const applicationLoadBalancerArn = 'arn:aws:elasticlobalancing:us-east-1:539763292489:loadbalancer/app/propapay-alb/26d19fc20555ffdf'
    const loadBalancer = cdk.aws_elasticloadbalancingv2.ApplicationLoadBalancer.fromLookup(this, 'ALB', {
      loadBalancerArn: applicationLoadBalancerArn
    })
    */
    const targetGroup: IApplicationTargetGroup = new ApplicationTargetGroup(this, `${config.serviceName}TargetGroup`, {
      targetGroupName: `${config.serviceName}TG`,
      vpc: vpc,
      targetType: TargetType.IP,
      port: config.port,
      protocol: ApplicationProtocol.HTTP,
      protocolVersion: ApplicationProtocolVersion.HTTP1,
      healthCheck: {
        enabled: true,
        path: "/auth/health",
        port: '5555',
        protocol: Protocol.HTTP,
        interval: Duration.seconds(240),
        timeout: Duration.seconds(60),
        unhealthyThresholdCount: 5,
        healthyHttpCodes: "200",
      },
    });

    const albListener = ApplicationListener.fromLookup(this, `${config.serviceName}AlbListener`, {
      listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/propapay-alb/26d19fc20555ffdf/ff03934b92e8d554',
    })

    const albListenerRule = new ApplicationListenerRule(this, `${config.serviceName}AlbListenerRule`, {
      listener: albListener,
      priority: 123,
      //action: new ListenerAction(targetGroup)
      conditions: [
        ListenerCondition.hostHeaders(['api.propapay.propagately.com']),
        ListenerCondition.pathPatterns(['/auth*', '/doc*']),
      ],
      targetGroups: [targetGroup],
    })

    targetGroup.registerListener(albListener);

    const subnet1 = cdk.aws_ec2.Subnet.fromSubnetId(this, `${config.serviceName}Subnet1`, 'subnet-054667646fd339cb4');
    const subnet2 = cdk.aws_ec2.Subnet.fromSubnetId(this, `${config.serviceName}Subnet2`, 'subnet-0e5c3fb4ddd065fc7');

    const fargateService = new cdk.aws_ecs.FargateService(this, `${config.serviceName}`, {
      serviceName: `${config.serviceName}`,
      cluster: cluster,
      //targetGroups: [targetGroup.],
      taskDefinition: taskDef,
      desiredCount: 1,
      enableExecuteCommand: true,
      healthCheckGracePeriod: Duration.seconds(60),
      vpcSubnets: {
        subnets: [subnet1, subnet2]
      },
      assignPublicIp: true,
    })

    fargateService.attachToApplicationTargetGroup(targetGroup)
    //albListenerRule.(targetGroup)

    const scaling = fargateService.autoScaleTaskCount({ maxCapacity: 6 });
    scaling.scaleOnCpuUtilization('cpuscaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60)
    });

    const gitHubSource = codebuild.Source.gitHub({
      owner: githubUserName.valueAsString,
      repo: githubRepository.valueAsString,
      webhook: true, // optional, default: true if `webhookfilteres` were provided, false otherwise
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs('main'),
      ], // optional, by default all pushes and pull requests will trigger a build
    });

    // codebuild - project
    const project = new codebuild.Project(this, 'myProject', {
      projectName: `${this.stackName}`,
      source: gitHubSource,
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2,
        privileged: true
      },
      environmentVariables: {
        'cluster_name': {
          value: `${cluster.clusterName}`
        },
        'ecr_repo_uri': {
          value: `${ecrRepo.repositoryUri}`
        }
      },
      badge: true,
      // TODO - I had to hardcode tag here
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          pre_build: {
            /*
            commands: [
              'env',
              'export tag=${CODEBUILD_RESOLVED_SOURCE_VERSION}'
            ]
            */
            commands: [
              'env',
              'export tag=latest'
            ]
          },
          build: {
            commands: [
              'cd src',
              'npm install',
              'npx prisma generate',
              'npm run build',

              `docker build -t $ecr_repo_uri:$tag .`,
              '$(aws ecr get-login --no-include-email)',
              'docker push $ecr_repo_uri:$tag'
            ]
          },
          post_build: {
            commands: [
              'echo "in post-build stage"',
              'cd ..',
              "printf '[{\"name\":\"flask-app\",\"imageUri\":\"%s\"}]' $ecr_repo_uri:$tag > imagedefinitions.json",
              "pwd; ls -al; cat imagedefinitions.json"
            ]
          }
        },
        artifacts: {
          files: [
            'imagedefinitions.json'
          ]
        }
      })
    });



    // ***pipeline actions***

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
    const nameOfGithubPersonTokenParameterAsString = githubPersonalTokenSecretName.valueAsString
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'github_source',
      owner: githubUserName.valueAsString,
      repo: githubRepository.valueAsString,
      branch: 'main',
      oauthToken: cdk.SecretValue.secretsManager(nameOfGithubPersonTokenParameterAsString),
      output: sourceOutput
    });

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'codebuild',
      project: project,
      input: sourceOutput,
      outputs: [buildOutput], // optional
    });

    const manualApprovalAction = new codepipeline_actions.ManualApprovalAction({
      actionName: 'approve',
    });

    const deployAction = new codepipeline_actions.EcsDeployAction({
      actionName: 'deployAction',
      service: fargateService,
      imageFile: new codepipeline.ArtifactPath(buildOutput, `imagedefinitions.json`)
    });



    // pipeline stages


    // NOTE - Approve action is commented out!
    new codepipeline.Pipeline(this, 'myecspipeline', {
      stages: [
        {
          stageName: 'source',
          actions: [sourceAction],
        },
        {
          stageName: 'build',
          actions: [buildAction],
        },
        {
          stageName: 'approve',
          actions: [manualApprovalAction],
        },
        {
          stageName: 'deploy-to-ecs',
          actions: [deployAction],
        }
      ]
    });


    ecrRepo.grantPullPush(project.role!)
    project.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        "ecs:describecluster",
        "ecr:getauthorizationtoken",
        "ecr:batchchecklayeravailability",
        "ecr:batchgetimage",
        "ecr:getdownloadurlforlayer"
      ],
      resources: [`${cluster.clusterArn}`],
    }));


    new cdk.CfnOutput(this, "image", { value: ecrRepo.repositoryUri + ":latest" })
    new cdk.CfnOutput(this, 'loadbalancerdns', { value: "propapay-alb-578813700.us-east-1.elb.amazonaws.com" });
  }




}
