import express from "express"
import TelegramBot, { CallbackQuery, InlineQuery, Message } from "node-telegram-bot-api"
import path from "path"
import * as dotenv from 'dotenv'
const axios = require('axios');

dotenv.config()

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || ""
const miniAppUrl = process.env.MINI_APP_URL || ""

const server = express()
const bot = new TelegramBot(TOKEN, { polling: true })
const port = process.env.PORT || 3000
const miniAppName = "lovebird_demo"
const queries: Record<string, CallbackQuery> = {}

server.use(express.static(path.join(__dirname, 'static')))

bot.getUpdates({offset: -1}).then(() => {
    console.log("Cleared old updates")
})

bot.onText(/check-version-01/, (msg: Message) => {
    console.log(`Lovebird v1.0.0`)
})

// bot.onText(/start|game/, async (msg: Message) => {
//     const userId = msg.from?.id || 0;
//     const name = msg.from?.first_name || "";
//     console.log(`${miniAppUrl}dating/${userId}?name=${name}&t=${+(new Date())}`)
//     try {
//         // Call API to check user
//         const userCheckResponse = await axios.get(`https://api-staging.lvbrd.uk/api/inviteCode/check-user?telegramId=${userId}`);
//         console.log("[userCheckResponse]: ", userCheckResponse.data);
//         // const time = new Date().getTime().toString();
//         console.log("[time]: ", +(new Date()));

//         if (!userCheckResponse.data) {
//             const askForInviteCode = async () => {
//                 bot.once('message', async (responseMsg: Message) => {
//                     const inviteCode = responseMsg.text?.trim();

//                     console.log("[inviteCode]: ", inviteCode);
//                     const response = await axios.get(`https://api-staging.lvbrd.uk/api/inviteCode/check-invite-code?code=${inviteCode}`);
//                     console.log("[response]: ", response.data);

//                     if (response.data === "Invite code is valid") {
//                         const useInviteCodeResponse = await axios.post('https://api-staging.lvbrd.uk/api/inviteCode/update-invite-code', {
//                             telegramId: userId,
//                             code: inviteCode
//                         });
//                         console.log("[useInviteCodeResponse]: ", useInviteCodeResponse.data);
                        
//                         if (useInviteCodeResponse.data) {
//                             bot.sendMessage(userId, "Welcome to Lovebird!", {
//                                 reply_markup: {
//                                     inline_keyboard: [[{ text: "Start Lovebird", web_app: { url: `${miniAppUrl}dating/${userId}?name=${name}&t=${+(new Date())}` } }]]
//                                 }
//                             }).catch(err => console.error("[ERR]: ", err));
//                         } 
//                     } else {
//                         bot.sendMessage(userId, "Wrong code! Enter again").then(() => askForInviteCode());
//                     }
//                 });
//             };

//             bot.sendMessage(userId, "Enter invite code").then(() => askForInviteCode()).catch(err => console.error("[ERR]: ", err));
//         } else {
//             bot.sendMessage(userId, "Welcome to Lovebird!", {
//                 reply_markup: {
//                     inline_keyboard: [[{ text: "Start Lovebird", web_app: { url: `${miniAppUrl}dating/${userId}?name=${name}&t=${+(new Date())}` } }]]
//                 }
//             }).catch(err => console.error("[ERR]: ", err));
//         }
//     } catch (error) {
//         console.error("[API Error]: ", error);
//         bot.sendMessage(userId, "An error occurred while checking your user status. Please try again later.");
//     }
// })

bot.onText(/start|game/, async (msg: Message) => {
    const userId = msg.from?.id || 0;
    const name = msg.from?.first_name || "";
    console.log(`${miniAppUrl}dating/${userId}?name=${name}&t=${+(new Date())}`)
    console.log("[time]: ", +(new Date()));
    bot.sendMessage(userId, "Welcome to Lovebird!", {
        reply_markup: {
            inline_keyboard: [[{ text: "Start Lovebird", web_app: { url: `${miniAppUrl}dating/${userId}?name=${name}&t=${+(new Date())}` } }]]
        }
    }).catch(err => console.error("[ERR]: ", err));
    
})

bot.onText(/help/, (msg: Message) => {
    bot.sendMessage(msg.from?.id || 0, "Say /game if you want to play.")
})

bot.on("callback_query", (query: CallbackQuery) => {
    console.log("query.game_short_name: ", query.game_short_name)

    if (query.game_short_name !== miniAppName) {
        bot.answerCallbackQuery(query.id, { text: "Sorry, '" + query.game_short_name + "' is not available." })
    } else {
        queries[query.id] = query
        bot.answerCallbackQuery({ callback_query_id: query.id, url: miniAppUrl })
    }
})

bot.on("inline_query", (iq: InlineQuery) => {
    bot.answerInlineQuery(iq.id, [{ type: "game", id: "0", game_short_name: miniAppName }])
})

bot.on('polling_error', (error) => {
    console.error('[polling_error]', error)
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
