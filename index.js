const TOKEN = process.env.API_KEY;
const TelegramBot = require('node-telegram-bot-api');
require('es6-promise').polyfill();
require('isomorphic-fetch');
const options = {
  webHook: {
    port: process.env.PORT
  }
};

const url = process.env.APP_URL;
const bot = new TelegramBot(TOKEN, options);

const keyboardOptions = {
"reply_markup": {
  "keyboard": [["Consultar saldo"]],
  }
};

bot.setWebHook(`${url}/bot${TOKEN}`);

bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, "Consulta tu saldo", { ...keyboardOptions }).then(() => {
    bot.once('message', answer => {
      const cardId = answer.text;
      console.log(cardId);
      getWalletBalance(msg, cardId);
    });
  });

});

const getBalance = async (msg, cardId) => {
  try {
    console.log(`${url}=${cardId}`);
    const data = await fetch(`${url}=${cardId}`);
    console.log(data);
    const parsedData = await data.json();
    console.log(parsedData);

    const balance = parsedData.split(/<[^>]*>/).filter(a => a !== '');
    console.log(balance);

    bot.sendMessage(msg.chat.id, balance[0]);
  } catch (error) {
    console.log(error);
  }
}
