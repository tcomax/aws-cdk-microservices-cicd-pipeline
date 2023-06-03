export const configuration =
    [
        {
            application: 'sampleApi',
            namespace: 'sampleApi.local',
            namespaceId: 'ns-xxxxxxxxxxxxxxxx',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:xxxxxxxxxxxxxx:namespace/ns-xxxxxxxxxxxxxxxx',
            serviceName: 'authentication',
            port: 5555,
            listenerName: 'xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleApiintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleApi Authentication Service API - Github source code repository",
                default: "sampleApi-authentication-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleApi/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:xxxxxxxxxxxxxx:listener/app/sampleApi-alb/xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            },
            albListenerRule: {
                priority: 123,
                conditions: {
                    hostHeaders: ['api.sampleApi.replace-with-your-domain.com'],
                    pathPatterns: ['/auth*', '/doc*'],
                }
            },
            fargateService: {
                serviceName: 'sampleApiAuthServiceApi',
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
                environment: "sampleApiAPITest.postman_environment.json",
                collection: "sampleApiAPITest.postman_collection.json",
            }
        },
        {
            application: 'sampleApi',
            namespace: 'sampleApi.local',
            namespaceId: 'ns-xxxxxxxxxxxxxxxx',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:xxxxxxxxxxxxxx:namespace/ns-xxxxxxxxxxxxxxxx',
            serviceName: 'authorization',
            port: 5555,
            listenerName: 'xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleApiintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleApi Authorization Service API - Github source code repository",
                default: "sampleApi-authorization-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleApi/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:xxxxxxxxxxxxxx:listener/app/sampleApi-alb/xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            },
            albListenerRule: {
                priority: 110,
                conditions: {
                    hostHeaders: ['api.sampleApi.replace-with-your-domain.com'],
                    pathPatterns: ['/authorization*', '/permission*', '/role*'],
                }
            },
            fargateService: {
                serviceName: 'sampleApiAuthorizationApi',
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
                environment: "sampleApiAPITest.postman_environment.json",
                collection: "sampleApiAPITest.postman_collection.json",
            }
        },
        {
            application: 'sampleApi',
            namespace: 'sampleApi.local',
            namespaceId: 'ns-xxxxxxxxxxxxxxxx',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:xxxxxxxxxxxxxx:namespace/ns-xxxxxxxxxxxxxxxx',
            serviceName: 'user',
            port: 5555,
            listenerName: 'xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleApiintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleApi User Profile Service - Github source code repository",
                default: "sampleApi-user-profile-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleApi/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:xxxxxxxxxxxxxx:listener/app/sampleApi-alb/xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            },
            albListenerRule: {
                priority: 190,
                conditions: {
                    hostHeaders: ['api.sampleApi.replace-with-your-domain.com'],
                    pathPatterns: ['/user*, /subscribe*'],
                }
            },
            fargateService: {
                serviceName: 'sampleApiUserService',
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
                environment: "sampleApiAPITest.postman_environment.json",
                collection: "sampleApiAPITest.postman_collection.json",
            }
        },
        {
            application: 'sampleApi',
            namespace: 'sampleApi.local',
            namespaceId: 'ns-xxxxxxxxxxxxxxxx',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:xxxxxxxxxxxxxx:namespace/ns-xxxxxxxxxxxxxxxx',
            serviceName: 'analytics',
            port: 5555,
            listenerName: 'xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleApiintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleApi Analytics Service API - Github source code repository",
                default: "sampleApi-analytics-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleApi/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:xxxxxxxxxxxxxx:listener/app/sampleApi-alb/xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            },
            albListenerRule: {
                priority: 123,
                conditions: {
                    hostHeaders: ['api.sampleApi.replace-with-your-domain.com'],
                    pathPatterns: ['/analytics*'],
                }
            },
            fargateService: {
                serviceName: 'sampleApiAnalyticsApi',
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
                environment: "sampleApiAPITest.postman_environment.json",
                collection: "sampleApiAPITest.postman_collection.json",
            }
        },
        {
            application: 'sampleApi',
            namespace: 'sampleApi.local',
            namespaceId: 'ns-xxxxxxxxxxxxxxxx',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:xxxxxxxxxxxxxx:namespace/ns-xxxxxxxxxxxxxxxx',
            serviceName: 'merchant',
            port: 5555,
            listenerName: 'xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleApiintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleApi Authorization Service API - Github source code repository",
                default: "sampleApi-merchant-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleApi/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:xxxxxxxxxxxxxx:listener/app/sampleApi-alb/xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            },
            albListenerRule: {
                priority: 110,
                conditions: {
                    hostHeaders: ['api.sampleApi.replace-with-your-domain.com'],
                    pathPatterns: ['/merchant*', '/store*', '/paypoint*'],
                }
            },
            fargateService: {
                serviceName: 'sampleApiMerchantApi',
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
                environment: "sampleApiAPITest.postman_environment.json",
                collection: "sampleApiAPITest.postman_collection.json",
            }
        },
        {
            application: 'sampleApi',
            namespace: 'sampleApi.local',
            namespaceId: 'ns-xxxxxxxxxxxxxxxx',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:xxxxxxxxxxxxxx:namespace/ns-xxxxxxxxxxxxxxxx',
            serviceName: 'paystack',
            port: 5555,
            listenerName: 'xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "sampleApiintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "sampleApi Paystack Integration Service Middleware - Github source code repository",
                default: "sampleApi-paystack-integration-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/sampleApi/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:xxxxxxxxxxxxxx:listener/app/sampleApi-alb/xxxxxxxxxxxxxx/yyyyyyyyyyyyyyyyyyyy',
            },
            albListenerRule: {
                priority: 190,
                conditions: {
                    hostHeaders: ['api.sampleApi.replace-with-your-domain.com'],
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
                environment: "sampleApiAPITest.postman_environment.json",
                collection: "sampleApiAPITest.postman_collection.json",
            }
        }
    ]