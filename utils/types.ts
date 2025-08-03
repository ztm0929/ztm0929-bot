// 腾讯云配置类型
export interface TencentCloudConfig {
  credential: {
    secretId: string;
    secretKey: string;
  };
  region: string;
  profile: {
    httpProfile: {
      endpoint: string;
    };
  };
}

// 快照相关类型
export interface Snapshot {
  SnapshotId: string;
  DiskUsage: string;
  DiskId: string;
  DiskSize: number;
  SnapshotName: string;
  SnapshotState: string;
  Percent: number;
  LatestOperation: string;
  LatestOperationState: string;
  LatestOperationRequestId: string;
  CreatedTime: string;
}

export interface SnapshotListResponse {
  TotalCount: number;
  SnapshotSet: Snapshot[];
  RequestId: string;
}

// 实例相关类型
export interface Instance {
  InstanceId: string;
  InstanceName: string;
  InstanceState: string;
}

export interface InstanceListResponse {
  TotalCount: number;
  InstanceSet: Instance[];
  RequestId: string;
}

// API 请求参数类型
export interface CreateSnapshotParams {
  InstanceId: string;
  SnapshotName?: string;
}

export interface DeleteSnapshotParams {
  SnapshotIds: string[];
}

// 操作结果类型
export interface OperationResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface CreateSnapshotOperationResult {
  instanceId: string;
  snapshotName: string;
  success: boolean;
  result?: any;
  error?: string;
}

export interface CreateSnapshotResult extends OperationResult {
  snapshotId?: string;
  instanceId?: string;
}

export interface DeleteSnapshotResult extends OperationResult {
  deletedSnapshotId?: string;
}

// Telegram 通知相关类型
export interface NotificationConfig {
  botToken?: string;
  chatId?: string;
}