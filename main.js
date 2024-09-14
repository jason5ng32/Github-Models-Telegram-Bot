import { initializeBot, sendMessage } from './telegram.js';
import { getAIResponse, resetUserHistory } from './chat.js';

async function handleUserMessage(chatId, message) {
    try {
        // 使用 OpenAI 获取响应
        const response = await getAIResponse(chatId, message);  // 确保传入 chatId
        // 发送响应回 Telegram 用户
        await sendMessage(chatId, response);
    } catch (error) {
        console.error('处理用户消息时出错：', error);
        // 发送错误消息给用户
        await sendMessage(chatId, "抱歉，处理用户消息时出错。请稍后再试。");
    }
}

async function handleStart(chatId) {
    sendMessage(chatId, "👏 您来啦！我已经准备好为你提供帮助！");
}

async function handleStop(chatId) {
    sendMessage(chatId, "已经清空本轮对话，你可以重新开始新一轮对话。");
    resetUserHistory(chatId);  // 清空该用户的对话历史
}

async function main() {
    try {
        // 初始化 Telegram 机器人，处理收到的消息
        initializeBot(handleUserMessage, handleStart, handleStop);
    } catch (error) {
        console.error('初始化机器人时出错:', error);
    }
}

console.log('机器人服务已启动。');

main();

// 处理异常
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的拒绝:', promise, '原因:', reason);服务
});

process.on('uncaughtException', error => {
    console.error('未捕获的异常:', error);
    process.exit(1);
});