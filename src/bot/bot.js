const TelegramBot = require("node-telegram-bot-api");
const { token } = require('../config/config.js')

const bot = new TelegramBot(token, { polling: true });


bot.setMyCommands([
    { command: '/start', description: 'start the game' }
]).then(() => {
    console.log('Commands set successfully')
})
    .catch(error => {
        console.log('Error setting commands: ' + error);
    });

module.exports = { bot };