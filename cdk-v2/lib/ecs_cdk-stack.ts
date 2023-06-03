import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import { S3Client, ListBucketsCommand, DeleteBucketCommand, ListObjectsCommand, DeleteObjectCommand, _Object } from "@aws-sdk/client-s3";
// ES Modules import

import { Construct } from 'constructs';
import {
  ApplicationListener,
  ApplicationListenerRule,
  ApplicationProtocol,
  ApplicationProtocolVersion,
  ApplicationTargetGroup,
  IApplicationTargetGroup,
  ListenerCondition,
  Protocol,
  TargetType
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { configuration } from '../config/config';
import { Duration } from 'aws-cdk-lib';
import * as sd from 'aws-cdk-lib/aws-servicediscovery';
import { PrivateDnsNamespace, DnsRecordType } from 'aws-cdk-lib/aws-servicediscovery';
//ns-xxxxxxxxxxxxxxxx

export class EcsCdkStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const config = configuration.find(cfg => { return cfg.serviceName === this.node.tryGetContext('serviceName') }) || undefined

    if (config === undefined) return;

    console.log(`config: ${JSON.stringify(config, null, 2)}`)


    // deleteCdkBuckets();

    const githubUserName = new cdk.CfnParameter(this, "githubUserName", config.githubUserName)
    const githubRepository = new cdk.CfnParameter(this, "githubRespository", config.githubRepository)
    const githubPersonalTokenSecretName = new cdk.CfnParameter(this, "githubPersonalTokenSecretName", config.githubPersonalTokenSecretName)
    //default: `${this.stackName}`
    const oauth = secretsmanager.Secret.fromSecretNameV2(this, 'githubToken', githubPersonalTokenSecretName.valueAsString)
    const nodeRepo = ecr.Repository.fromRepositoryName(this, 'nodeRepoArn', 'node');
    const ecrRepo = new ecr.Repository(this, 'ecrRepo');

    console.log(`

      githubUserName: ${githubUserName}
      githubRepository: ${githubRepository}
      githubPersonalTokenSecretName: ${githubPersonalTokenSecretName}
      oauth: ${oauth}
    `)


    /**
     * create a new vpc with single nat gateway
     */


    // const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3"); // CommonJS import
    /*
        async function deleteObject(bucket: any, obj: any) {
          console.log(`deleting ${obj.Key}....`)
          const region = "us-east-1"
          const awsconfig = {
            region,
          };
          const client = new S3Client(awsconfig);
          const input = {
            "Bucket": bucket.Name,
            "Key": obj.Key
          };
          const command = new DeleteObjectCommand(input);
          await client.send(command);
          return obj;
        }
    
        async function deleteCdkBuckets() {
          try {
            console.log("deleting s3 Buckets ....")
            const region = "us-east-1"
            const awsconfig = { region };
            const client = new S3Client(awsconfig);
            const command = new ListBucketsCommand({});
            const response = await client.send(command);
            console.log(`response: ${JSON.stringify(response)}`)
            for (let bucket of response.Buckets!) {
              console.log(`deleting ${bucket.Name} bucket....`)
              if (bucket.Name!.startsWith(config?.serviceName || "EcsCdkStack")) {
                const bucketName = { // DeleteBucketRequest
                  Bucket: bucket.Name, // required
                };
                const listObjectsCommand = new ListObjectsCommand(bucketName);
                const listObjectResponse = await client.send(listObjectsCommand);
                listObjectResponse.Contents?.map(obj => deleteObject(bucket, obj))
                // const { S3Client, DeleteBucketCommand } = require("@aws-sdk/client-s3"); // CommonJS impor
                const command = new DeleteBucketCommand(bucketName);
                const response = client.send(command);
                console.log(`response: ${JSON.stringify(response)}`)
              }
            }
          } catch (err) {
            console.log(err)
          }
        }
    */
    const vpc = ec2.Vpc.fromLookup(this, 'ecs-cdk-vpc', {
      vpcId: config.vpcId
    });

    const dnsNamespace = PrivateDnsNamespace.fromPrivateDnsNamespaceAttributes(
      this,
      `DnsNamespace:,${config.namespace}`,
      {
        namespaceId: config.namespaceId,
        namespaceArn: config.namespaceArn,
        namespaceName: config.namespace
      }
    );

    const clusteradmin = new iam.Role(this, 'adminrole', {
      assumedBy: new iam.AccountRootPrincipal()
    });

    const cluster = new ecs.Cluster(this, "ecs-cluster", {
      vpc: vpc,
    });

    const logging = new ecs.AwsLogDriver({
      streamPrefix: `${config.application}/${config.serviceName}`,
      logRetention: 30
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
        "logs:putlogevents",
        "servicediscovery:DiscoverInstances"
      ]
    });


    const taskDef = new ecs.FargateTaskDefinition(this, "ecs-taskdef", {
      taskRole: taskrole,
      memoryLimitMiB: 2048,
      cpu: 512
    });

    taskDef.addToExecutionRolePolicy(executionRolePolicy);


    const baseImage = 'xxxxxxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/sampleApi-authentication-service:latest'
    //const baseImage = 'xxxxxxxxxxxxxx.dkr.ecr.us-east-1.amazonaws.com/sampleApiauthorizationapi-ecrrepo714fb1b2-pkzipnrugt0z:latest'
    const container = taskDef.addContainer(`${config.application}${config.serviceName}Container`, {
      image: ecs.ContainerImage.fromRegistry(baseImage),
      memoryLimitMiB: 2048,
      healthCheck: {
        command: [
          "CMD-SHELL",
          `curl -f http://localhost:5555/auth/health || exit 1`
        ],
        interval: Duration.seconds(240),
        timeout: Duration.seconds(60),
        retries: 5,
        startPeriod: Duration.seconds(30),
      },
      logging: logging
    });

    container.addPortMappings({
      containerPort: config.port,
      protocol: ecs.Protocol.TCP
    });




    /*  cdk cannot manage loadbalancers it did not create
    const applicationLoadBalancerArn = 'arn:aws:elasticlobalancing:us-east-1:xxxxxxxxxxxxxx:loadbalancer/app/sampleApi-alb/26d19fc20555ffdf'
    const loadBalancer = cdk.aws_elasticloadbalancingv2.ApplicationLoadBalancer.fromLookup(this, 'ALB', {
      loadBalancerArn: applicationLoadBalancerArn
    })
    */
    const targetGroup: IApplicationTargetGroup = new ApplicationTargetGroup(this, `${config.application}${config.serviceName}TargetGroup`, {
      targetGroupName: `${config.application}${config.serviceName}TG`,
      vpc: vpc,
      targetType: TargetType.IP,
      port: config.port,
      protocol: ApplicationProtocol.HTTP,
      protocolVersion: ApplicationProtocolVersion.HTTP1,
      healthCheck: {
        enabled: true,
        path: "/auth/health",
        port: `${config.port}`,
        protocol: Protocol.HTTP,
        interval: Duration.seconds(240),
        timeout: Duration.seconds(60),
        unhealthyThresholdCount: 5,
        healthyHttpCodes: "200",
      },
    });

    const albListener = ApplicationListener.fromLookup(this, `${config.application}${config.serviceName}AlbListener`, config.albListener)

    const albListenerRule = new ApplicationListenerRule(this, `${config.application}${config.serviceName}AlbListenerRule`, {
      listener: albListener,
      priority: config.albListenerRule.priority,
      //action: new ListenerAction(targetGroup)
      conditions: [
        ListenerCondition.hostHeaders(config.albListenerRule.conditions.hostHeaders),
        ListenerCondition.pathPatterns(config.albListenerRule.conditions.pathPatterns),
      ],
      targetGroups: [targetGroup],
    })

    targetGroup.registerListener(albListener);
    const subnets = []


    for (let subnetId of config.serviceSubnets) {
      const subnet = cdk.aws_ec2.Subnet.fromSubnetId(this, `${config.application}${config.serviceName}Subnet${subnetId}`, subnetId);
      subnets.push(subnet)
    }


    const fargateService = new cdk.aws_ecs.FargateService(this, `${config.application}${config.serviceName}Service`, {
      serviceName: `${config.application}${config.serviceName}Service`,
      cluster: cluster,
      //targetGroups: [targetGroup.],
      taskDefinition: taskDef,
      desiredCount: config.fargateService.desiredCount,
      enableExecuteCommand: config.fargateService.enableExecuteCommand,
      healthCheckGracePeriod: Duration.seconds(config.fargateService.healthCheckGracePeriod),
      vpcSubnets: {
        subnets: subnets
      },
      assignPublicIp: config.fargateService.assignPublicIp,
      cloudMapOptions: {
        // This will be your service_name.namespace
        name: config.serviceName,
        cloudMapNamespace: dnsNamespace,
        dnsRecordType: DnsRecordType.A,
      },
      securityGroups: [cdk.aws_ec2.SecurityGroup.fromLookupByName(
        this,
        `${config.application}ApiSG`,
        `${config.application}-api-sg`,
        vpc),
      ],
    })

    fargateService.attachToApplicationTargetGroup(targetGroup)
    //albListenerRule.(targetGroup)

    const scaling = fargateService.autoScaleTaskCount({ maxCapacity: config.fargateService.autoScaleTaskCount.maxCapacity });
    scaling.scaleOnCpuUtilization('cpuscaling', {
      targetUtilizationPercent: config.fargateService.scalingOnCpuUtilization.targetUtilizationPercent,
      scaleInCooldown: cdk.Duration.seconds(config.fargateService.scalingOnCpuUtilization.scaleInCooldown),
      scaleOutCooldown: cdk.Duration.seconds(config.fargateService.scalingOnCpuUtilization.scaleOutCooldown)
    });

    const gitHubSource = codebuild.Source.gitHub({
      owner: githubUserName.valueAsString,
      repo: githubRepository.valueAsString,
      webhook: true, // optional, default: true if `webhookfilteres` were provided, false otherwise
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs(`${config.githubRepositoryBranch}`),
      ], // optional, by default all pushes and pull requests will trigger a buildgithubRepositoryBranch
    });

    // codebuild - project
    const project = new codebuild.Project(this, `${config.application}${config.serviceName}Project`, {
      projectName: `${this.stackName}`,
      timeout: Duration.minutes(300),
      source: gitHubSource,
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2,
        privileged: true,

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
              'export tag=latest',
            ]
          },
          build: {
            commands: [
              '$(aws ecr get-login --no-include-email)',
              `docker build -t $ecr_repo_uri:$tag .`,
              'docker push $ecr_repo_uri:$tag'
            ]
          },
          post_build: {
            commands: [
              'echo "in post-build stage"',
              //'cd ..',
              `printf '[{\"name\":\"${config.application}${config.serviceName}Container\",\"imageUri\":\"%s\"}]' $ecr_repo_uri:$tag > imagedefinitions.json`,
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

    const integrationTestProject = new codebuild.Project(this, 'integrationTestProject', {
      projectName: `${this.stackName}IntegrationTest`,
      //source: gitHubSource,
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2,
        privileged: true
      },
      /*environmentVariables: {
        'cluster_name': {
          value: `${cluster.clusterName}`
        },
        'ecr_repo_uri': {
          value: `${ecrRepo.repositoryUri}`
        }
      },
      badge: true, */
      // TODO - I had to hardcode tag here
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        env: {
          variables: {
            key: `${config.S3_BUCKET}`
          }
        },
        phases: {
          install: {
            'runtime-versions': {
              nodejs: "12"
            },
            commands: [
              //"npm install - g newman-run",
              "npm install -g newman",
              "npm install -g newman-reporter-html",
            ],
          },
          pre_build: {
            commands: [
              //"newman-run -h",
              'echo $CODEBUILD_SRC_DIR',
              'ls $CODEBUILD_SRC_DIR',
              "newman -h",
              `aws s3 cp "s3://${config.S3_BUCKET}/${config.application}${config.serviceName}/${config.postman.environment}" ./postman/`,
              `aws s3 cp "s3://${config.S3_BUCKET}/${config.application}${config.serviceName}/${config.postman.collection}" ./postman/`,
              `cd ./postman`,
              `ls .`
              //`./update-postman-env-file.sh`
            ]
          },
          build: {
            commands: [
              "echo Build started on `date` from dir `pwd`",
              `newman run ${config.postman.collection} --environment ${config.postman.environment} -r html,cli --reporter-html-export report.html`
            ]
          }
        },
        reports: {
          JUnitReports: { //# CodeBuild will create a report group called "SurefireReports".
            files: [ //#Store all of the files
              '**/*'
            ],
            'base-directory': './postman' //# Location of the reports
          }
        }
      })
    });

    const securityDependencyCheckProject = new codebuild.Project(this, 'securityDependencyCheckProject', {
      projectName: `${this.stackName}securityDependencyCheck`,
      buildSpec: codebuild.BuildSpec.fromObject({

        version: "0.2",
        phases: {
          install: {
            commands: [
              'echo "install phase....."'
            ]
          },
          pre_build: {
            commands: [
              'composer install',
              'wget https://github.com/jeremylong/DependencyCheck/releases/download/v7.4.0/dependency-check-7.4.0-release.zip',
              'unzip dependency-check-7.4.0-release.zip',
              'rm dependency-check-7.4.0-release.zip',
              `chmod - R 775 ${process.env.CODEBUILD_SRC_DIR}/dependency-check/bin/dependency-check.sh`,
              'echo "stage pre_build completed"',
            ]
          },
          build: {
            commands: [
              'cd dependency-check/bin',
              `${process.env.CODEBUILD_SRC_DIR}/dependency-check/bin/dependency-check.sh --project "wordpress" --format JSON --prettyPrint --enableExperimental --scan ${process.env.CODEBUILD_SRC_DIR} --exclude '${process.env.CODEBUILD_SRC_DIR}/depedency-check/'`,
              'echo "OWASP dependency check analysis status is completed..."',
              'high_risk_dependency=$(cat dependency - check - report.json | grep - c "HIGHEST")',
            ]
          },
          post_build: {
            commands: [
              `| jq "{ \"messageType\": \"CodeScanReport\", \"reportType\": \"OWASP-Dependency-Check\", \"createdAt\": $(date +\"%Y-%m-%dT%H:%M:%S.%3NZ\"), \"source_repository\": ${process.env.CODEBUILD_SOURCE_REPO_URL}, \"source_branch\": ${process.env.CODEBUILD_SOURCE_VERSION}, \"build_id\": ${process.env.CODEBUILD_BUILD_ID}, \"source_commitid\": ${process.env.CODEBUILD_RESOLVED_SOURCE_VERSION}, \"report": . }" dependency-check-report.json > payload.json`,
              '| if [$high_risk_dependency - gt 0]; then echo "there are high or medium alerts.. failing the build" aws lambda invoke --function-name ImportVulToSecurityHub --payload file://payload.json dependency-check-report.json && echo "LAMBDA_SUCCEDED" || echo "LAMBDA_FAILED"; exit 1; fi'
            ]
          },
        }, artifacts: {
          type: 'zip',
          files: '**/*'
        }
      })
    })

    const securityDynamicScanProject = new codebuild.Project(this, 'securityDynamicScanProject', {
      projectName: `${this.stackName}securityDynamicScanProject`,
      buildSpec: codebuild.BuildSpec.fromObject({

        version: "0.2",
        phases: {
          install: {
            commands: [
              'echo "install phase....."'
            ]
          },
          pre_build: {
            commands: [
              `scanid=$(curl "${config.OwaspZapURL}/JSON/ascan/action/scan/?apikey=${config.OwaspZapApiKey}&url=${config.ApplicationURL}&recurse=true&inScopeOnly=&scanPolicyName=&method=&postData=&contextId=" | jq -r '.scan')`,
              `| stat=50; while ["$stat" != 100]; do stat = $(curl "${config.OwaspZapURL}/JSON/ascan/view/status/?apikey=${config.OwaspZapApiKey}&scanId=$scanid" | jq - r '.status'); echo "OWASP ZAP scan status is $stat" echo "OWASP Zap analysis status is in progress..."; sleep 5; done`,
              'echo "OWASP Zap analysis status is completed...";',
              `high_alerts=$(curl "${config.OwaspZapURL}/JSON/alert/view/alertsSummary/?apikey=${config.OwaspZapApiKey}&baseurl=${config.ApplicationURL}" | jq - r '.alertsSummary.High')`,
              `medium_alerts=$(curl "${config.OwaspZapURL}/JSON/alert/view/alertsSummary/?apikey=${config.OwaspZapApiKey}&baseurl=${config.ApplicationURL}" | jq - r '.alertsSummary.Meduim')`,
              `echo "high alerts are $high_alerts"`,
            ]
          },
          build: {
            commands: [
              `curl "${config.OwaspZapURL}/OTHER/core/other/jsonreport/?apikey=${config.OwaspZapApiKey}" | jq. > zap - scan - results.json`,
              `echo "build stage completed"`,
            ]
          }, post_build: {
            commands: [
              `| jq "{ "messageType": "CodeScanReport", "reportType": "OWASP-Zap", "createdAt": $(date + "%Y-%m-%dT%H:%M:%S.%3NZ"), "source_repository": ${process.env.CODEBUILD_SOURCE_REPO_URL}, "source_branch": ${process.env.CODEBUILD_SOURCE_VERSION}, "build_id": ${process.env.CODEBUILD_BUILD_ID}, "source_commitid": ${process.env.CODEBUILD_RESOLVED_SOURCE_VERSION}, "report": . }" zap-scan-results.json > payload.json`,
              `aws lambda invoke --function-name ImportVulToSecurityHub --payload file://payload.json owaspzap_scan_report.json && echo "LAMBDA_SUCCEDED" || echo "LAMBDA_FAILED";`,
              `if [$high_alerts - gt 0] || [$medium_alerts - gt 0]; then echo "there are high or medium alerts.. failing the build" && exit 1; else exit 0; fi`
            ]
          }
        },
        artifacts: {
          type: 'zip',
          files: '**/*'
        }
      })
    })

    const securityStaticCodeAnalysisProject = new codebuild.Project(this, 'securityStaticCodeAnalysisProject', {
      projectName: `${this.stackName}securityStaticCodeAnalysisProject`,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            'runtime-versions': {
              php: "7.3",
              java: "corretto11"
            },
            commands: [
              'echo "in the install phase"',
            ],
            finally: [
              'echo This always runs even if the login command fails'
            ]
          },
          pre_build: {
            commands: [
              `wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.4.0.2170-linux.zip`,
              `unzip sonar-scanner-cli-4.4.0.2170-linux.zip`,
              `mv sonar-scanner-4.4.0.2170-linux/opt/sonar-scanner`,
              `chmod -R 775 /opt/sonar-scanner`,
              `echo "stage pre_build completed"`
            ]
          },
          build: {
            commands: [
              `cd ${process.env.CODEBUILD_SRC_DIR}`,
              `/opt/sonar-scanner/bin/sonar-scanner -Dsonar.sources=. -Dproject.settings=sonar -project.properties -Dsonar.host.url=$SonarQube_URL -Dsonar.login=$SonarQube_Access_Token > sonarqube_scanreport.json`,
              `echo "build stage completed"`
            ]
          },
          post_build: {
            commands: [`sonar_link=$(cat sonarqube_scanreport.json | egrep - o "you can browse http://[^, ]+")`,
              `sonar_task_id=$(cat sonarqube_scanreport.json | egrep - o "task\?id=[^ ]+" | cut - d'=' - f2)`,
              //# Allow time for SonarQube background task to complete
              `| stat="PENDING"; while ["$stat" != "SUCCESS"]; do if [$stat = "FAILED"] || [$stat = "CANCELLED"]; then echo "SonarQube task $sonar_task_id failed"; exit 1; fi stat = $(curl -u $SonarQube_Access_Token $SonarQube_URL/api/ce/task\?id=$sonar_task_id | jq -r '.task.status'); sleep 5; done`,
              `sonar_analysis_id=$(curl -u $SonarQube_Access_Token $SonarQube_URL/api/ce/task\?id=$sonar_task_id | jq -r '.task.analysisId')`,
              `quality_status=$(curl -u $SonarQube_Access_Token $SonarQube_URL/api/qualitygates/project_status\?analysisId=$sonar_analysis_id | jq -r '.projectStatus.status')`,
              `SCAN_RESULT=$(curl -o sonarqube_scanreport.json -u $SonarQube_Access_Token $SonarQube_URL/api/issues/search?createdAfter=2020-10-21&componentKeys=devsecops&severities=CRITICAL,BLOCKER&languages=php&types=VULNERABILITY&onComponentOnly=true)`,
              `| jq "{ "messageType": "CodeScanReport", "reportType": "SONAR-QUBE", "createdAt": $(date +"%Y-%m-%dT%H:%M:%S.%3NZ"), "source_repository": ${process.env.CODEBUILD_SOURCE_REPO_URL}, "source_branch": ${process.env.CODEBUILD_SOURCE_VERSION}, "build_id": ${process.env.CODEBUILD_BUILD_ID}, "source_commitid": ${process.env.CODEBUILD_RESOLVED_SOURCE_VERSION}, "report": . }" sonarqube_scanreport.json > payload.json`,
              `| if [$quality_status = "ERROR"] || [$quality_status = "WARN"]; then aws lambda invoke--function-name ImportVulToSecurityHub--payload file://payload.json sonarqube_scan_report.json && echo "LAMBDA_SUCCEDED" || echo "LAMBDA_FAILED"; echo "in quality_status ERROR or WARN condition" exit 1; elif[$quality_status = "OK"]; then echo "in quality_status OK condition" else echo "in quality_status  unexpected condition" exit 1; fi`
            ]
          }
        },
        artifacts: {
          type: 'zip',
          files: '**/*'
        }
      })
    })
    // ***pipeline actions***

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();
    const integrationTestOutput = new codepipeline.Artifact();
    const securityDependencyCheckOutput = new codepipeline.Artifact();
    const securityDynamicScanOutput = new codepipeline.Artifact();
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

    const integrationTestAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'integrationTest',
      project: integrationTestProject,
      input: sourceOutput,
      outputs: [integrationTestOutput], // optional
    });

    const securityDependencyCheckAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'securityDependencyCheck',
      project: securityDependencyCheckProject,
      input: sourceOutput,
      outputs: [securityDependencyCheckOutput], // optional
    });

    const securityDynamicScanAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'securityDependencyCheck',
      project: securityDynamicScanProject,
      input: sourceOutput,
      outputs: [securityDynamicScanOutput], // optional
    });

    const securityStaticCodeAnalysisAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'securityDependencyCheck',
      project: securityDynamicScanProject,
      input: sourceOutput,
      outputs: [securityDynamicScanOutput], // optional
    });
    // pipeline stages


    // NOTE - Approve action is commented out!
    const pipeline = new codepipeline.Pipeline(this, `${config.application}${config.serviceName}Pipeline`, {
      stages: [
        {
          stageName: 'source',
          actions: [sourceAction],
        },/*
        {
          stageName: 'security-dependency-check',
          actions: [securityDependencyCheckAction],
        },
        {
          stageName: 'security-code-analysis-scan',
          actions: [securityStaticCodeAnalysisAction],
        },*/
        {
          stageName: 'build',
          actions: [buildAction],
        },
        /*{
          stageName: 'approve',
          actions: [manualApprovalAction],
        },*/
        {
          stageName: 'deploy-to-ecs',
          actions: [deployAction],
        }, {
          stageName: 'integration-test',
          actions: [integrationTestAction],
        },
        /* {
           stageName: 'security-dynamic-scan-check',
           actions: [securityDynamicScanAction],
         },*/
      ]
    });


    nodeRepo.grantPullPush(project.role!)
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

    integrationTestProject.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        "s3:*",
      ],
      resources: [
        `arn:aws:s3:::${config.S3_BUCKET}`,
        `arn:aws:s3:::${config.S3_BUCKET}/*`
      ]
    }));

    securityDependencyCheckProject.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        "s3:*",
      ],
      resources: [
        `arn:aws:s3:::${config.S3_BUCKET}`,
        `arn:aws:s3:::${config.S3_BUCKET}/*`
      ]
    }));

    securityStaticCodeAnalysisProject.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        "s3:*",
      ],
      resources: [
        `arn:aws:s3:::${config.S3_BUCKET}`,
        `arn:aws:s3:::${config.S3_BUCKET}/*`
      ]
    }));

    securityDynamicScanProject.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        "s3:*",
      ],
      resources: [
        `arn:aws:s3:::${config.S3_BUCKET}`,
        `arn:aws:s3:::${config.S3_BUCKET}/*`
      ]
    }));

    new cdk.CfnOutput(this, "image", { value: ecrRepo.repositoryUri + ":latest" })
    new cdk.CfnOutput(this, 'loadbalancerdns', { value: "sampleApi-alb-578813700.us-east-1.elb.amazonaws.com" });

    const artifactBucket = pipeline.artifactBucket;
    artifactBucket.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }


}
