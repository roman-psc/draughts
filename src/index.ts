import { run } from "@grammyjs/runner";
import { Bot } from "grammy";

import { handleMoveCallback } from "./handlers/move";
import { handleStart } from "./handlers/start";

const TOKEN = process.env["TOKEN"];
if (!TOKEN) throw new Error("Missing TOKEN env variable");

const bot = new Bot(TOKEN);

bot.on("message").command("start", handleStart);
bot.on("callback_query:data", (ctx) => {
  const data = ctx.callbackQuery.data;
  if (!data.startsWith("move:")) return;
  handleMoveCallback(ctx, data);
});

const runner = run(bot);
const stopRunner = () => runner.isRunning() && runner.stop();
process.once("SIGINT", stopRunner);
process.once("SIGTERM", stopRunner);
