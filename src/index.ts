import express from "express"
import TelegramBot, { CallbackQuery, InlineQuery, Message } from "node-telegram-bot-api"
import path from "path"
import * as dotenv from 'dotenv'

dotenv.config()

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || ""
const miniAppUrl = process.env.MINI_APP_URL || ""

const server = express()
const bot = new TelegramBot(TOKEN, { polling: true })
const port = process.env.PORT || 3000
const miniAppName = "lovebird_demo"
const queries: Record<string, CallbackQuery> = {}

server.use(express.static(path.join(__dirname, 'static')))

bot.onText(/help/, (msg: Message) => {
    bot.sendMessage(msg.from?.id || 0, "Say /game if you want to play.")
})

bot.onText(/start|game/, (msg: Message) => {
    console.log("[msg]: ", msg)
    console.log("[miniAppName]: ", miniAppName)

    bot.sendMessage(msg.from?.id || 0, "Welcome to Lovebird!", {
        reply_markup: {
            inline_keyboard: [[{ text: "Start Lovebird", web_app: { url: miniAppUrl } }]]
        }
    }).catch(err => console.error("[ERR]: ", err))
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

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
