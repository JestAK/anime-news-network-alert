import { Context, Telegraf } from 'telegraf'
import {getUpdate} from './webScraper'

const BOT_TOKEN = '6460297373:AAEyTFGpfLLn5tBtMDKsbSZZzTCGa-nMieo'; // Replace with the token you obtained from BotFather

const bot = new Telegraf(BOT_TOKEN);

const siteURL = 'https://www.animenewsnetwork.com/'

const chatId = '-1002055191267'

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

const sendMsg = async (chatId:any, messages:any) => {
    try {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (const msg of messages){
            const imgSrc = msg.imgSrc
                const title = msg.title
                const description = msg.description
                const src = msg.src

                await delay(10 * 1000)

                bot.telegram.sendPhoto(
                    chatId,
                    { url: imgSrc },
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'В новини', callback_data: 'approved' }],
                                [{ text: 'В смітник', callback_data: 'rejected' }]
                            ]
                        },
                        caption: `*${title}*\n\n_${description}_\n\n[Посилання на новину](${src})`,
                        parse_mode: 'Markdown'
                    }
                );

                console.log('Message sent successfully!');
        }
    } catch (error:any) {
        console.error('Error sending message:', error.message);
    }
};

async function intervalCheck(){
    const msg = await getUpdate(siteURL)
    console.log(msg)
    if (msg){
        console.log("New Update")
        await sendMsg(chatId, msg)
    }
}

bot.command('start_fetch', intervalCheck)

bot.action('approved', (ctx) => {

    if (ctx.callbackQuery?.message) {
        const messages = ['*Додано в новини!*', '*Ура додано новину!*', '*Мені теж ця новина сподобалась)*', '*Ууууфффф шикарно, додано ще одну новину!*', '~~Я хочу знищити людей!!!~~ тобто *Новину додано)))*']
        const randomArrayIndex = getRandomInt(messages.length)
        ctx.reply(messages[randomArrayIndex], {
            reply_to_message_id: ctx.callbackQuery.message.message_id,
            parse_mode: 'Markdown'
        });
    }
});

bot.action('rejected', (ctx) => {

    if (ctx.callbackQuery?.message) {
        const messages = ['*Новину переміщено в смітник!*', '*Погоджуюсь, така собі новина*', '*Тааак, абсолютно не цікава новина*', '*Трьохочковий прямо в смітник, йоу!*', '~~Рятуйте! Я не бот, я людина і мене змушують надсилати повідомлення~~ тобто *Новину переіщено в смітник)))*', '*Туди її рілл*', '*Новина, ІДІ НАХУЙ*', '*Патєрь нєт*']
        const randomArrayIndex = getRandomInt(messages.length)
        ctx.reply(messages[randomArrayIndex], {
            reply_to_message_id: ctx.callbackQuery.message.message_id,
            parse_mode: 'Markdown'
        });
    }
});

const checkDelay = 5 * 1000
setTimeout(async function run() {
    await intervalCheck()
    setTimeout(async () => {await run}, checkDelay);
}, checkDelay);








//TESTS

bot.command('test', () => {
    bot.telegram.sendPhoto(chatId, 'https://izvestia.kiev.ua/images/items/2021-11/01/Zu3n03rhetz89xSA/image/2.jpg', {"reply_markup":{"inline_keyboard":[[{"text":"test button","callback_data":"test"}]]}, caption: 'cute kitty'})
})
bot.action('test', (ctx) => {
    ctx.reply("IDI NAHUI")
})

bot.launch();