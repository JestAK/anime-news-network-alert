"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const webScraper_1 = require("./webScraper");
const BOT_TOKEN = '6460297373:AAEyTFGpfLLn5tBtMDKsbSZZzTCGa-nMieo'; // Replace with the token you obtained from BotFather
const bot = new telegraf_1.Telegraf(BOT_TOKEN);
const siteURL = 'https://www.animenewsnetwork.com/';
const chatId = '-1002055191267';
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
const sendMsg = (chatId, messages) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        messages = [...messages].reverse();
        for (const msg of messages) {
            const imgSrc = msg.imgSrc;
            const title = msg.title;
            const description = msg.description;
            const src = msg.src;
            yield delay(10 * 1000);
            bot.telegram.sendPhoto(chatId, { url: imgSrc }, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'В новини', callback_data: 'approved' }],
                        [{ text: 'В смітник', callback_data: 'rejected' }]
                    ]
                },
                caption: `*${title}*\n\n_${description}_\n\n[Посилання на новину](${src})`,
                parse_mode: 'Markdown'
            });
            console.log('Message sent successfully!');
        }
        return true;
    }
    catch (error) {
        console.error('Error sending message:', error.message);
        return false;
    }
});
function intervalCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        const msg = yield (0, webScraper_1.getUpdate)(siteURL);
        console.log(msg);
        if (msg) {
            console.log("New Update");
            yield sendMsg(chatId, msg);
        }
        else {
            console.log(`No News ${msg}`);
        }
    });
}
bot.command('start_fetch', intervalCheck);
bot.action('approved', (ctx) => {
    var _a;
    if ((_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) {
        const messages = ['*Додано в новини!*', '*Ура додано новину!*', '*Мені теж ця новина сподобалась)*', '*Ууууфффф шикарно, додано ще одну новину!*', '~Я хочу знищити людей!!!~ тобто *Новину додано)))*'];
        const randomArrayIndex = getRandomInt(messages.length);
        ctx.reply(messages[randomArrayIndex], {
            reply_to_message_id: ctx.callbackQuery.message.message_id,
            parse_mode: 'Markdown'
        });
    }
});
bot.action('rejected', (ctx) => {
    var _a;
    if ((_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.message) {
        const messages = ['*Новину переміщено в смітник!*', '*Погоджуюсь, така собі новина*', '*Тааак, абсолютно не цікава новина*', '*Трьохочковий прямо в смітник, йоу!*', '~~Рятуйте! Я не бот, я людина і мене змушують надсилати повідомлення~~ тобто *Новину переіщено в смітник)))*', '*Туди її рілл*', '*Новина, ІДІ НАХУЙ*', '*Патєрь нєт*'];
        const randomArrayIndex = getRandomInt(messages.length);
        ctx.reply(messages[randomArrayIndex], {
            reply_to_message_id: ctx.callbackQuery.message.message_id,
            parse_mode: 'Markdown'
        });
    }
});
const checkDelay = 10 * 1000;
setTimeout(function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield intervalCheck();
        setTimeout(() => __awaiter(this, void 0, void 0, function* () { yield run; }), checkDelay);
    });
}, checkDelay);
//TESTS
bot.command('test', () => {
    bot.telegram.sendPhoto(chatId, 'https://izvestia.kiev.ua/images/items/2021-11/01/Zu3n03rhetz89xSA/image/2.jpg', { "reply_markup": { "inline_keyboard": [[{ "text": "test button", "callback_data": "test" }]] }, caption: 'cute kitty' });
});
bot.action('test', (ctx) => {
    ctx.reply("IDI NAHUI");
});
bot.launch();
