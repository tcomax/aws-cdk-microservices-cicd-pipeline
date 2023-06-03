export const configuration =
    [
        {
            application: 'sampleapp',
            namespace: 'sampleapp.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'authentication',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleappintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleapp Authentication Service API - Github source code repository",
                default: "sampleapp-authentication-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleapp/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/sampleapp-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 123,
                conditions: {
                    hostHeaders: ['api.sampleapp.propagately.com'],
                    pathPatterns: ['/auth*', '/doc*'],
                }
            },
            fargateService: {
                serviceName: 'sampleappAuthServiceApi',
                desiredCount: 1,
                enableExecuteCommand: true,
                healthCheckGracePeriod: 60,
                assignPublicIp: true,
                autoScaleTaskCount: {
                    maxCapacity: 2
                },
                scalingOnCpuUtilization: {
                    targetUtilizationPercent: 50,
                    scaleInCooldown: 60,
                    scaleOutCooldown: 60
                }
            },
            postman: {
                environment: "sampleappAPITest.postman_environment.json",
                collection: "sampleappAPITest.postman_collection.json",
            }
        },
        {
            application: 'sampleapp',
            namespace: 'sampleapp.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'authorization',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleappintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleapp Authorization Service API - Github source code repository",
                default: "sampleapp-authorization-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleapp/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/sampleapp-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 110,
                conditions: {
                    hostHeaders: ['api.sampleapp.propagately.com'],
                    pathPatterns: ['/authorization*', '/permission*', '/role*'],
                }
            },
            fargateService: {
                serviceName: 'sampleappAuthorizationApi',
                desiredCount: 1,
                enableExecuteCommand: true,
                healthCheckGracePeriod: 60,
                assignPublicIp: true,
                autoScaleTaskCount: {
                    maxCapacity: 2
                },
                scalingOnCpuUtilization: {
                    targetUtilizationPercent: 50,
                    scaleInCooldown: 60,
                    scaleOutCooldown: 60
                }
            },
            postman: {
                environment: "sampleappAPITest.postman_environment.json",
                collection: "sampleappAPITest.postman_collection.json",
            }
        },
        {
            application: 'sampleapp',
            namespace: 'sampleapp.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'user',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleappintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleapp User Profile Service - Github source code repository",
                default: "sampleapp-user-profile-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleapp/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/sampleapp-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 190,
                conditions: {
                    hostHeaders: ['api.sampleapp.propagately.com'],
                    pathPatterns: ['/user*, /subscribe*'],
                }
            },
            fargateService: {
                serviceName: 'sampleappUserService',
                desiredCount: 1,
                enableExecuteCommand: true,
                healthCheckGracePeriod: 60,
                assignPublicIp: true,
                autoScaleTaskCount: {
                    maxCapacity: 2
                },
                scalingOnCpuUtilization: {
                    targetUtilizationPercent: 50,
                    scaleInCooldown: 60,
                    scaleOutCooldown: 60
                }
            },
            postman: {
                environment: "sampleappAPITest.postman_environment.json",
                collection: "sampleappAPITest.postman_collection.json",
            }
        },
        {
            application: 'sampleapp',
            namespace: 'sampleapp.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'analytics',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleappintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleapp Analytics Service API - Github source code repository",
                default: "sampleapp-analytics-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleapp/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/sampleapp-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 123,
                conditions: {
                    hostHeaders: ['api.sampleapp.propagately.com'],
                    pathPatterns: ['/analytics*'],
                }
            },
            fargateService: {
                serviceName: 'sampleappAnalyticsApi',
                desiredCount: 1,
                enableExecuteCommand: true,
                healthCheckGracePeriod: 60,
                assignPublicIp: true,
                autoScaleTaskCount: {
                    maxCapacity: 2
                },
                scalingOnCpuUtilization: {
                    targetUtilizationPercent: 50,
                    scaleInCooldown: 60,
                    scaleOutCooldown: 60
                }
            },
            postman: {
                environment: "sampleappAPITest.postman_environment.json",
                collection: "sampleappAPITest.postman_collection.json",
            }
        },
        {
            application: 'sampleapp',
            namespace: 'sampleapp.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'merchant',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleappintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleapp Authorization Service API - Github source code repository",
                default: "sampleapp-merchant-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleapp/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/sampleapp-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 110,
                conditions: {
                    hostHeaders: ['api.sampleapp.propagately.com'],
                    pathPatterns: ['/merchant*', '/store*', '/paypoint*'],
                }
            },
            fargateService: {
                serviceName: 'sampleappMerchantApi',
                desiredCount: 1,
                enableExecuteCommand: true,
                healthCheckGracePeriod: 60,
                assignPublicIp: true,
                autoScaleTaskCount: {
                    maxCapacity: 2
                },
                scalingOnCpuUtilization: {
                    targetUtilizationPercent: 50,
                    scaleInCooldown: 60,
                    scaleOutCooldown: 60
                }
            },
            postman: {
                environment: "sampleappAPITest.postman_environment.json",
                collection: "sampleappAPITest.postman_collection.json",
            }
        },
        {
            application: 'sampleapp',
            namespace: 'sampleapp.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'paystack',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleappintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleapp Paystack Integration Service Middleware - Github source code repository",
                default: "sampleapp-paystack-integration-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleapp/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/sampleapp-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 190,
                conditions: {
                    hostHeaders: ['api.sampleapp.propagately.com'],
                    pathPatterns: ['/paystack*'],
                }
            },
            fargateService: {
                serviceName: 'PaystackIntegrationMiddleware',
                desiredCount: 1,
                enableExecuteCommand: true,
                healthCheckGracePeriod: 60,
                assignPublicIp: true,
                autoScaleTaskCount: {
                    maxCapacity: 2
                },
                scalingOnCpuUtilization: {
                    targetUtilizationPercent: 50,
                    scaleInCooldown: 60,
                    scaleOutCooldown: 60
                }
            },
            postman: {
                environment: "sampleappAPITest.postman_environment.json",
                collection: "sampleappAPITest.postman_collection.json",
            }
        }
    ]