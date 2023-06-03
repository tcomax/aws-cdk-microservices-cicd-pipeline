export const configuration =
    [
        {
            application: 'propapay',
            namespace: 'propapay.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'authentication',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "propapayintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "Propapay Authentication Service API - Github source code repository",
                default: "propapay-authentication-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/propapay/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/propapay-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 123,
                conditions: {
                    hostHeaders: ['api.propapay.propagately.com'],
                    pathPatterns: ['/auth*', '/doc*'],
                }
            },
            fargateService: {
                serviceName: 'PropapayAuthServiceApi',
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
                environment: "PropapayAPITest.postman_environment.json",
                collection: "PropapayAPITest.postman_collection.json",
            }
        },
        {
            application: 'propapay',
            namespace: 'propapay.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'authorization',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "propapayintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "Propapay Authorization Service API - Github source code repository",
                default: "propapay-authorization-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/propapay/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/propapay-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 110,
                conditions: {
                    hostHeaders: ['api.propapay.propagately.com'],
                    pathPatterns: ['/authorization*', '/permission*', '/role*'],
                }
            },
            fargateService: {
                serviceName: 'PropapayAuthorizationApi',
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
                environment: "PropapayAPITest.postman_environment.json",
                collection: "PropapayAPITest.postman_collection.json",
            }
        },
        {
            application: 'propapay',
            namespace: 'propapay.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'user',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "propapayintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "Propapay User Profile Service - Github source code repository",
                default: "propapay-user-profile-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/propapay/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/propapay-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 190,
                conditions: {
                    hostHeaders: ['api.propapay.propagately.com'],
                    pathPatterns: ['/user*, /subscribe*'],
                }
            },
            fargateService: {
                serviceName: 'PropapayUserService',
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
                environment: "PropapayAPITest.postman_environment.json",
                collection: "PropapayAPITest.postman_collection.json",
            }
        },
        {
            application: 'propapay',
            namespace: 'propapay.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'analytics',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "propapayintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "Propapay Analytics Service API - Github source code repository",
                default: "propapay-analytics-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/propapay/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/propapay-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 123,
                conditions: {
                    hostHeaders: ['api.propapay.propagately.com'],
                    pathPatterns: ['/analytics*'],
                }
            },
            fargateService: {
                serviceName: 'PropapayAnalyticsApi',
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
                environment: "PropapayAPITest.postman_environment.json",
                collection: "PropapayAPITest.postman_collection.json",
            }
        },
        {
            application: 'propapay',
            namespace: 'propapay.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'merchant',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "propapayintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "Propapay Authorization Service API - Github source code repository",
                default: "propapay-merchant-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/propapay/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/propapay-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 110,
                conditions: {
                    hostHeaders: ['api.propapay.propagately.com'],
                    pathPatterns: ['/merchant*', '/store*', '/paypoint*'],
                }
            },
            fargateService: {
                serviceName: 'PropapayMerchantApi',
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
                environment: "PropapayAPITest.postman_environment.json",
                collection: "PropapayAPITest.postman_collection.json",
            }
        },
        {
            application: 'propapay',
            namespace: 'propapay.local',
            namespaceId: 'ns-zzmjlght3byi2xq3',
            namespaceArn: ' arn:aws:servicediscovery:us-east-1:539763292489:namespace/ns-zzmjlght3byi2xq3',
            serviceName: 'paystack',
            port: 5555,
            listenerName: '26d19fc20555ffdf/ff03934b92e8d554',
            vpcId: "vpc-019e94ba861d92f85",
            serviceSubnets: ['subnet-054667646fd339cb4', 'subnet-0e5c3fb4ddd065fc7'],
            S3_BUCKET: "propapayintegrationtests",
            OwaspZapURL: "",
            OwaspZapApiKey: "",
            ApplicationURL: "",
            githubRepository: {
                type: "String",
                description: "Propapay Paystack Integration Service Middleware - Github source code repository",
                default: "propapay-paystack-integration-service"
            },
            githubRepositoryBranch: "main",
            githubPersonalTokenSecretName: {
                type: "String",
                description: "The name of the AWS Secrets Manager Secret which holds the GitHub Personal Access Token for this project.",
                default: "/propapay/github/access-token"
            },
            githubUserName: {
                type: "String",
                description: "Github username for source code repository",
                default: "tcomax"
            },
            albListener: {
                listenerArn: 'arn:aws:elasticloadbalancing:us-east-1:539763292489:listener/app/propapay-alb/26d19fc20555ffdf/ff03934b92e8d554',
            },
            albListenerRule: {
                priority: 190,
                conditions: {
                    hostHeaders: ['api.propapay.propagately.com'],
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
                environment: "PropapayAPITest.postman_environment.json",
                collection: "PropapayAPITest.postman_collection.json",
            }
        }
    ]