const tencentcloud = require("tencentcloud-sdk-nodejs-lighthouse");
const { Bot } = require("grammy");

const LighthouseClient = tencentcloud.lighthouse.v20200324.Client;

const clientConfig = {
  credential: {
    secretId: process.env.TENCENTCLOUD_SECRET_ID,
    secretKey: process.env.TENCENTCLOUD_SECRET_KEY,
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "lighthouse.tencentcloudapi.com",
    },
  },
};

// 初始化 Bot
const bot = new Bot(process.env.BOT_TOKEN);

// 发送通知函数
async function sendNotification(message) {
  const chatId = process.env.CHAT_ID;
  
  if (!chatId) {
    console.error("缺少 CHAT_ID 环境变量");
    return;
  }
  
  try {
    await bot.api.sendMessage(chatId, message, { parse_mode: "HTML" });
    console.log("通知发送成功");
  } catch (error) {
    console.error("发送通知失败:", error);
  }
}

const client = new LighthouseClient(clientConfig);
const params = {};
client.DescribeSnapshots(params).then(
  async (data) => {
    console.log(data);
    
    // 找到最早的快照
    if (data.SnapshotSet && data.SnapshotSet.length > 0) {
      // 按创建时间排序，找到最早的快照
      const oldestSnapshot = data.SnapshotSet.reduce((oldest, current) => {
        return new Date(oldest.CreatedTime) < new Date(current.CreatedTime) ? oldest : current;
      });
      
      console.log("最早的快照:", oldestSnapshot.SnapshotId, oldestSnapshot.CreatedTime);
      
      // 删除最早的快照
      const deleteParams = {
        "SnapshotIds": [
          oldestSnapshot.SnapshotId
        ]
      };
      
      client.DeleteSnapshots(deleteParams).then(
        async (deleteData) => {
          console.log("删除成功:", deleteData);
          
          // 发送成功通知
          const successMessage = `🗑️ <b>快照删除成功</b>\n\n` +
            `📋 快照ID: <code>${oldestSnapshot.SnapshotId}</code>\n` +
            `📅 创建时间: ${oldestSnapshot.CreatedTime}\n` +
            `💾 快照名称: ${oldestSnapshot.SnapshotName}\n` +
            `✅ 状态: 删除成功`;
          
          await sendNotification(successMessage);
        },
        async (deleteErr) => {
          console.error("删除失败:", deleteErr);
          
          // 发送失败通知
          const errorMessage = `❌ <b>快照删除失败</b>\n\n` +
            `📋 快照ID: <code>${oldestSnapshot.SnapshotId}</code>\n` +
            `📅 创建时间: ${oldestSnapshot.CreatedTime}\n` +
            `💾 快照名称: ${oldestSnapshot.SnapshotName}\n` +
            `❌ 错误信息: ${deleteErr.message || '未知错误'}`;
          
          await sendNotification(errorMessage);
        }
      );
    } else {
      console.log("没有找到快照");
      
      // 发送无快照通知
      const noSnapshotMessage = `ℹ️ <b>未找到快照</b>\n\n` +
        `当前腾讯云账户下没有可删除的快照。`;
      
      await sendNotification(noSnapshotMessage);
    }
  },
  async (err) => {
    console.error("error", err);
    
    // 发送错误通知
    const errorMessage = `💥 <b>获取快照列表失败</b>\n\n` +
      `❌ 错误信息: ${err.message || '未知错误'}`;
    
    await sendNotification(errorMessage);
  }
);