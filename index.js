const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();
const API_URL = "https://wallhaven.cc/api/v1/";
const search = async (query) => {
  let args = query.split(" ");
  let q = "search?q=" + args.join("+");
  let data = await axios.get(API_URL + q + "&sorting=random");
  let resp = (await data.data.data[0]) ? data.data.data[0].path : "404";
  return resp;
};
const nsfw = async () => {
  let data = await axios.get(
    API_URL +
      "search?sorting=random" +
      "&purity=001" +
      "&apikey=" +
      process.env.WALLHAVEN_API_KEY
  );
  let resp = await data.data.data[1].path;
  return resp;
};
const random = async () => {
  let data = await axios.get(API_URL + "search?sorting=random");
  let resp = await data.data.data[1].path;
  return resp;
};
const token = process.env.TELEGRAM_API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/search (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const resp = await search(match[1]);
  resp != "404"
    ? bot.sendDocument(chatId, resp)
    : bot.sendMessage(chatId, "Try again with some other keyword(s)");
});
bot.onText(/\/random/, async (msg) => {
  const chatId = msg.chat.id;
  const resp = await random();
  bot.sendDocument(chatId, resp);
});
bot.onText(/\/nsfw/, async (msg) => {
  const chatId = msg.chat.id;
  const resp = await nsfw();
  bot.sendDocument(chatId, resp);
});
