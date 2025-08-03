import * as tencentcloud from "tencentcloud-sdk-nodejs-lighthouse";
import { TencentCloudConfig } from "./types";

const LighthouseClient = tencentcloud.lighthouse.v20200324.Client;

// 验证必要的环境变量
function validateEnvironmentVariables(): void {
  const requiredVars = ['TENCENTCLOUD_SECRET_ID', 'TENCENTCLOUD_SECRET_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`缺少必要的环境变量: ${missingVars.join(', ')}`);
  }
}

// 创建腾讯云客户端配置
function createClientConfig(): TencentCloudConfig {
  return {
    credential: {
      secretId: process.env.TENCENTCLOUD_SECRET_ID!,
      secretKey: process.env.TENCENTCLOUD_SECRET_KEY!,
    },
    region: process.env.TENCENTCLOUD_REGION || "ap-guangzhou",
    profile: {
      httpProfile: {
        endpoint: "lighthouse.tencentcloudapi.com",
      },
    },
  };
}

// 初始化配置
validateEnvironmentVariables();
export const clientConfig: TencentCloudConfig = createClientConfig();

// 创建并导出客户端实例
export const client = new LighthouseClient(clientConfig);

// 导出其他有用的配置
export const config = {
  region: clientConfig.region,
  endpoint: clientConfig.profile.httpProfile.endpoint,
  
  // 添加一些常用的配置项
  retryOptions: {
    maxRetries: 3,
    retryDelay: 1000, // 1秒
  },
  
  // 超时配置
  timeout: 30000, // 30秒
} as const;

// 工具函数：检查配置是否有效
export function isConfigValid(): boolean {
  try {
    validateEnvironmentVariables();
    return true;
  } catch {
    return false;
  }
}

// 工具函数：获取配置摘要（不包含敏感信息）
export function getConfigSummary() {
  return {
    region: config.region,
    endpoint: config.endpoint,
    hasCredentials: !!(process.env.TENCENTCLOUD_SECRET_ID && process.env.TENCENTCLOUD_SECRET_KEY),
    secretIdPrefix: process.env.TENCENTCLOUD_SECRET_ID?.substring(0, 8) + '...',
  };
}