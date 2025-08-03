require('dotenv').config();
const { Bot } = require("grammy");
const { HttpsProxyAgent } = require('https-proxy-agent');

// 创建代理配置
const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:7897');

const bot = new Bot(process.env.BOT_TOKEN, {
  client: {
    // 设置代理
    baseFetchConfig: {
      agent: proxyAgent,
      timeout: 30000, // 30秒超时
    }
  }
});

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

sendNotification("hello github");