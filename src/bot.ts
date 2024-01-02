import { Context, Telegraf } from 'telegraf'
import {getUpdate} from './webScraper'
import {message} from "telegraf/filters";
import {addNews, setStatus, getDateRangeList} from './dbClient'
import {scheduleJob} from 'node-schedule';


const BOT_TOKEN = '6460297373:AAEyTFGpfLLn5tBtMDKsbSZZzTCGa-nMieo'; // Replace with the token you obtained from BotFather

const bot = new Telegraf(BOT_TOKEN);

const siteURL = 'https://www.animenewsnetwork.com/'

const chatId = '-1002055191267'

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

const sendMsg = async (chatId:any, messages:any, toDB: boolean = true) => {
    try {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        messages = [...messages].reverse()

        for (const msg of messages){
            const imgSrc = msg.imgSrc
            const title = msg.title
            const description = msg.description
            const src = msg.src

            await delay(6 * 1000)

            const sentMessage = await bot.telegram.sendPhoto(
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
                });

            console.log('Message sent successfully!');
            console.log(new Date());

            const messageId = sentMessage.message_id;
            console.log(messageId)

            if (toDB){
                addNews({
                    title: title,
                    imageSrc: imgSrc,
                    description: description,
                    originalSrc: src,
                }, messageId.toString())
            }
        }

        console.log("All news has been sent")
        console.log(new Date());
        return true
    } catch (error:any) {
        console.error('Error sending message:', error.message);
        console.log(new Date());
        return false
    }
};

async function intervalCheck(){
    console.log("Start IntervalCheck")
    const msg = await getUpdate(siteURL)
    // console.log(msg)
    console.log("Got news!")

    if (msg.length !== 0){
        console.log("New Update")
        let mss = await sendMsg(chatId, msg)
        console.log(mss)
    }
    else {
        console.log(`No News ${msg}`)
    }

    return true
}

bot.command('start_fetch', intervalCheck)

bot.action('approved', async (ctx) => {

    if (ctx.callbackQuery?.message) {
        const messageId = ctx.callbackQuery.message.message_id

        await setStatus(true, messageId.toString())

        const messages =
            ['*Додано в новини\\!*',
                '*Ура додано новину\\!*',
                '*Мені теж ця новина сподобалась\\)*',
                '*Ууууфффф шикарно\, додано ще одну новину\\!*',
                '~Я хочу знищити людей\\!\\!\\!~ тобто *Новину додано\\)\\)\\)*',
                '*Ура Урааа новина буде\, люди\, 15 травня буде новина УРААА\\!\\!\\!*'
            ]
        const randomArrayIndex = getRandomInt(messages.length)
        ctx.reply(messages[randomArrayIndex], {
            reply_to_message_id: ctx.callbackQuery.message.message_id,
            parse_mode: 'MarkdownV2'
        });
    }
});

bot.action('rejected', async (ctx) => {


    if (ctx.callbackQuery?.message) {
        const messageId = ctx.callbackQuery.message.message_id

        await setStatus(false, messageId.toString())

        const messages =
            ['*Новину переміщено в смітник\\!*',
                '*Погоджуюсь\, така собі новина*',
                '*Тааак\, абсолютно не цікава новина*',
                '*Трьохочковий прямо в смітник, йоу\\!*',
                '~Рятуйте\\! Я не бот\, я людина і мене змушують надсилати повідомлення~ тобто *Новину переміщено в смітник\\)\\)\\)*',
                '*Туди її рілл*',
                '*Новина\, ІДІ НАХУЙ*',
                '*Патєрь нєт*'
            ]
        const randomArrayIndex = getRandomInt(messages.length)
        ctx.reply(messages[randomArrayIndex], {
            reply_to_message_id: messageId,
            parse_mode: 'MarkdownV2'
        });
    }
});

const checkDelay = 60 * 1000
setTimeout(async function run() {
    console.log("First STO")
    await intervalCheck()
    console.log("Will start second STO")
    setTimeout(async () => {await run()}, checkDelay);
}, checkDelay);

const weeklyList = scheduleJob('0 0 12 * * 6', async function () {

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newsList = await getDateRangeList(oneWeekAgo, now)

    if (newsList.length !== 0){
        await bot.telegram.sendMessage(chatId, '*А ось і список відбірних за останній тиждень!!!*', {
            parse_mode: 'Markdown'
        })

        await sendMsg(chatId, newsList, false)

        await bot.telegram.sendMessage(chatId, '*Ось весь список новин)*', {
            parse_mode: 'Markdown'
        })
    }
    else {
        await bot.telegram.sendMessage(chatId, '*За тиждень зовсім немає новин(((*', {
            parse_mode: 'Markdown'
        })
    }
})


//TESTS
bot.command('test', () => {
    bot.telegram.sendPhoto(chatId, 'https://izvestia.kiev.ua/images/items/2021-11/01/Zu3n03rhetz89xSA/image/2.jpg', {"reply_markup":{"inline_keyboard":[[{"text":"test button","callback_data":"test"}]]}, caption: 'cute kitty'})
})
bot.action('test', (ctx) => {
    ctx.reply("IDI NAHUI")
})

bot.launch();
