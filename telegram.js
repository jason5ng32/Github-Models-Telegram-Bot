import TelegramBot from 'node-telegram-bot-api';
import { setModelName } from './chat.js'
import dotenv from 'dotenv';
dotenv.config();

const token = process.env['TELEGRAM_TOKEN'];
const bot = new TelegramBot(token, { polling: true });

// 定义允许响应的用户ID列表
const allowedUserIds = process.env['ALLOWED_USER_IDS'].split(',');

// 发送消息的功能, 加入错误处理
export async function sendMessage(userId, message) {
    try {
        await bot.sendMessage(userId, message, { parse_mode: 'Markdown' });
    } catch (error) {
        console.error(`发送消息到 ${userId} 失败:`, error); 
    }
}

// 初始化机器人并设置消息接收的回调
export function initializeBot(onMessage, onStart, onStop) {
    // 设置命令菜单
    bot.setMyCommands([
        { command: '/start', description: '开始对话' },
        { command: '/stop', description: '停止本轮对话' },
        { command: '/options', description: '选择模型' },
    ]);

    // 命令处理
    bot.on('message', async (msg) => {
        const userId = msg.chat.id;
        const userFirstName = msg.from.first_name;
        const userLastName = msg.from.last_name;
        if (!('text' in msg)) {
            return sendMessage(userId, "本机器人只接受文本消息，请不要发送图片、表情包或其他文件类型。");
        }
        const text = msg.text;

        if (!allowedUserIds.includes(userId.toString())) {
            return sendMessage(userId, "对不起，您没有权限使用这个机器人。");
        }

        switch (text) {
            case '/start':
                onStart(userId, userFirstName, userLastName);
                break;
            case '/stop':
                onStop(userId);
                break;
            case '/options':
                const options = {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'GPT 4o', callback_data: 'gpt-4o' }],
                            [{ text: 'GPT 4o Mini', callback_data: 'gpt-4o-mini' }],
                            [{ text: 'Meta LLaMa 3.1 405b', callback_data: 'meta-llama-3.1-405b-instruct' }],
                            [{ text: 'Meta LLaMa 3.1 70b', callback_data: 'meta-llama-3.1-70b-instruct' }],
                            [{ text: 'Phi 3', callback_data: 'Phi-3-medium-128k-instruct' }],
                            [{ text: 'AI21 Jamba 1.5', callback_data: 'ai21-jamba-1.5-large' }],
                            [{ text: 'Mistral Large', callback_data: 'Mistral-large' }],
                            [{ text: 'Cohere Command R+', callback_data: 'cohere-command-r-plus' }]
                        ]
                    }
                };
                bot.sendMessage(userId, '请选择您需要的模型：', options);
                break;
            default: 
                // 过滤掉已经处理过的命令消息
                if (text.startsWith('/')) return; 
                onMessage(userId, text);
        }
    });

    // 监听模型选择
    bot.on('callback_query', (callbackQuery) => {
        const userId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;

        bot.answerCallbackQuery(callbackQuery.id);
        setModelName(userId, data);  // 设置模型名称，传递 userId 进行历史对话清空
        sendMessage(userId, `模型已经切换为：${data}`);
    });

    // 错误处理
    bot.on('polling_error', (error) => {
        console.error('Polling error occurred:', error);
    });
}