import { Bot } from "grammy";

// 检查必要的环境变量
let bot: Bot | null = null;
if (process.env.BOT_TOKEN) {
  bot = new Bot(process.env.BOT_TOKEN);
} else {
  console.warn("警告: BOT_TOKEN 未设置，将跳过 Telegram 通知");
}

// 发送通知函数
export async function sendNotification(message: string): Promise<void> {
  const chatId = process.env.CHAT_ID;
  
  if (!bot) {
    console.log("Telegram 通知被跳过（未配置 BOT_TOKEN）");
    console.log("消息内容:", message);
    return;
  }
  
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