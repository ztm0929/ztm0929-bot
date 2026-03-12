import { Bot, Context, webhookCallback } from "grammy";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;
  BOT_INFO: string;
  BOT_TOKEN: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const bot = new Bot(env.BOT_TOKEN, { botInfo: JSON.parse(env.BOT_INFO) });

    bot.command("start", async (ctx: Context) => {
      await ctx.reply("Hello, ztm0929!");
    });

    // 监听频道消息
    bot.on("channel_post", async (ctx) => {
      const channelPost = ctx.channelPost;
      
      console.log("=== Channel Message Received ===");
      console.log("Chat ID:", channelPost.chat.id);
      console.log("Chat Title:", channelPost.chat.title);
      console.log("Message ID:", channelPost.message_id);
      console.log("Date:", new Date(channelPost.date * 1000).toISOString());
      
      if (channelPost.text) {
        console.log("Text:", channelPost.text);
      }
      
      if (channelPost.caption) {
        console.log("Caption:", channelPost.caption);
      }
      
      if (channelPost.photo) {
        console.log("Photo IDs:", channelPost.photo.map(p => p.file_id));
      }
      
      if (channelPost.video) {
        console.log("Video ID:", channelPost.video.file_id);
      }
      
      console.log("Full message object:", JSON.stringify(channelPost, null, 2));
      console.log("================================\n");
    });

    // 错误处理
    bot.catch((err) => {
      console.error("Bot error:", err);
    });

    return webhookCallback(bot, "cloudflare-mod")(request);
  },
};