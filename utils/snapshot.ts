import { client } from './config';
import { 
  Snapshot, 
  Instance, 
  SnapshotListResponse, 
  InstanceListResponse,
  CreateSnapshotParams,
  DeleteSnapshotParams 
} from './types';

// 获取快照列表
export async function getSnapshots(): Promise<Snapshot[]> {
  const params = {};
  const data = await client.DescribeSnapshots(params) as SnapshotListResponse;
  return data.SnapshotSet || [];
}

// 找到最早的快照
export function findOldestSnapshot(snapshots: Snapshot[]): Snapshot | null {
  if (!snapshots || snapshots.length === 0) {
    return null;
  }
  
  return snapshots.reduce((oldest, current) => {
    return new Date(oldest.CreatedTime) < new Date(current.CreatedTime) ? oldest : current;
  });
}

// 删除快照
export async function deleteSnapshot(snapshotId: string): Promise<any> {
  const deleteParams: DeleteSnapshotParams = {
    SnapshotIds: [snapshotId]
  };
  const data = await client.DeleteSnapshots(deleteParams);
  return data;
}

// 创建快照
export async function createSnapshot(instanceId: string, snapshotName?: string): Promise<any> {
  const params: CreateSnapshotParams = {
    InstanceId: instanceId,
    SnapshotName: snapshotName || `backup-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}`
  };
  const data = await client.CreateInstanceSnapshot(params);
  return data;
}

// 获取实例列表
export async function getInstances(): Promise<Instance[]> {
  const data = await client.DescribeInstances({}) as InstanceListResponse;
  return data.InstanceSet || [];
}