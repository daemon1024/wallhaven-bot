const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
// require("dotenv").config();
const API_URL = "https://wallhaven.cc/api/v1/search";
const search = async (query) => {
  let args = query.split(" ");
  let q = "?q=" + args.join("+");
  console.log(q);
  let data = await axios.get(API_URL + q);
  console.log(data);
  let resp = await data.data.data[1].path;
  return resp;
};
const token = process.env.TELEGRAM_API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/search (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const resp = await search(match[1]);
  console.log(resp);
  bot.sendDocument(chatId, resp);
});
