import { getSnapshots, findOldestSnapshot, deleteSnapshot, createSnapshot } from './snapshot';
import { sendNotification } from './telegram';
import { Snapshot } from './types';

// 明确的实例ID
const TARGET_INSTANCE_ID = 'lhins-qnnlcv6r';

function formatBeijingTime(utcTimeString: string): string {
  const utcDate = new Date(utcTimeString);
  return utcDate.toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

async function rotateSnapshots(): Promise<void> {
  try {
    console.log(`开始为实例 ${TARGET_INSTANCE_ID} 轮换快照...`);
    
    // 1. 获取快照列表
    console.log("正在获取快照列表...");
    const snapshots = await getSnapshots();
    console.log(`找到 ${snapshots.length} 个快照`);
    
    let deletedSnapshot: Snapshot | null = null;

    // 2. 如果有快照，先删除最旧的
    if (snapshots.length > 0) {
      const oldestSnapshot = findOldestSnapshot(snapshots);
      
      if (oldestSnapshot) {
        console.log(`正在删除最旧的快照: ${oldestSnapshot.SnapshotId} (${oldestSnapshot.CreatedTime})`);
        
        try {
          await deleteSnapshot(oldestSnapshot.SnapshotId);
          console.log("删除快照成功");
          deletedSnapshot = oldestSnapshot;
        } catch (deleteError) {
          console.error("删除快照失败:", deleteError);
          
          // 删除失败就不继续创建新快照
          const errorMessage = `❌ <b>删除快照失败</b>\n\n` +
            `📋 快照ID: <code>${oldestSnapshot.SnapshotId}</code>\n` +
            `📅 创建时间: ${oldestSnapshot.CreatedTime}\n` +
            `💾 快照名称: ${oldestSnapshot.SnapshotName}\n` +
            `❌ 错误信息: ${deleteError instanceof Error ? deleteError.message : '未知错误'}\n\n` +
            `⚠️ 已取消创建新快照`;
          
          await sendNotification(errorMessage);
          throw deleteError;
        }
      }
    } else {
      console.log("没有现有快照，直接创建新快照");
    }
    
    // 3. 为指定实例创建新快照
    const timestamp = new Date().toISOString().slice(0, 10);
    const snapshotName = `auto-backup-${timestamp}-${TARGET_INSTANCE_ID}`;
    
    console.log(`正在为实例 ${TARGET_INSTANCE_ID} 创建快照: ${snapshotName}`);
    
    let createSuccess = false;
    let createError: string | null = null;
    
    try {
      const createResult = await createSnapshot(TARGET_INSTANCE_ID, snapshotName);
      console.log(`实例 ${TARGET_INSTANCE_ID} 快照创建成功`);
      createSuccess = true;
    } catch (error) {
      console.error(`实例 ${TARGET_INSTANCE_ID} 快照创建失败:`, error);
      createError = error instanceof Error ? error.message : '未知错误';
    }
    
    // 4. 发送汇总通知
    let summaryMessage = `🔄 <b>快照轮换完成</b>\n\n`;
    summaryMessage += `🆔 实例ID: <code>${TARGET_INSTANCE_ID}</code>\n\n`;
    
    // 删除部分的摘要
    if (deletedSnapshot) {
      summaryMessage += `🗑️ <b>删除旧快照</b>\n`;
      summaryMessage += `📋 快照ID: <code>${deletedSnapshot.SnapshotId}</code>\n`;
      summaryMessage += `📅 创建时间: ${formatBeijingTime(deletedSnapshot.CreatedTime)} (北京时间)\n\n`;
    } else {
      summaryMessage += `ℹ️ 无旧快照需要删除\n\n`;
    }
    
    // 创建部分的摘要
    summaryMessage += `📸 <b>创建新快照</b>\n`;
    summaryMessage += `💾 快照名称: ${snapshotName}\n`;
    
    if (createSuccess) {
      summaryMessage += `✅ 状态: 创建成功`;
    } else {
      summaryMessage += `❌ 状态: 创建失败\n`;
      summaryMessage += `❌ 错误信息: ${createError}`;
    }
    
    await sendNotification(summaryMessage);
    
    console.log("快照轮换流程完成");
    console.log(`删除: ${deletedSnapshot ? 1 : 0} 个，创建: ${createSuccess ? '成功' : '失败'}`);
    
  } catch (error) {
    console.error("快照轮换流程失败:", error);
    
    // 发送总体错误通知
    const errorMessage = `💥 <b>快照轮换流程失败</b>\n\n` +
      `🆔 实例ID: <code>${TARGET_INSTANCE_ID}</code>\n` +
      `❌ 错误信息: ${error instanceof Error ? error.message : '未知错误'}`;
    
    await sendNotification(errorMessage);
    process.exit(1);
  }
}

// 执行快照轮换
rotateSnapshots().then(() => {
  console.log("程序执行完成");
  process.exit(0);
}).catch((error) => {
  console.error("程序执行失败:", error);
  process.exit(1);
});