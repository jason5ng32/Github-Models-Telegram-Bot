import { initializeBot, sendMessage } from './telegram.js';
import { getAIResponse, resetUserHistory } from './chat.js';
import { getUserModelName } from './user.js';

async function handleUserMessage(userId, message) {
    try {
        const response = await getAIResponse(userId, message);  // 确保传入 userId
        // 发送响应回 Telegram 用户
        await sendMessage(userId, response);
    } catch (error) {
        console.error('处理用户消息时出错：', error);
        // 发送错误消息给用户
        await sendMessage(userId, "抱歉，处理用户消息时出错。请稍后再试。");
    }
}

async function handleStart(userId, userFirstName, userLastName) {
    let currentModelName = getUserModelName(userId);
    sendMessage(userId, `${userFirstName} ${userLastName} 👏 您来啦！\n我已经准备好为你提供帮助！\n当前选择的大模型是：${currentModelName}`);
}

async function handleStop(userId) {
    sendMessage(userId, "已经清空本轮对话，你可以重新开始新一轮对话。");
    resetUserHistory(userId);  // 清空该用户的对话历史
}

async function main() {
    try {
        // 初始化 Telegram 机器人，处理收到的消息
        initializeBot(handleUserMessage, handleStart, handleStop);
    } catch (error) {
        console.error('初始化机器人时出错:', error);
    }
}

// 调用主函数
main();
console.log('机器人服务已启动。');

// 处理异常
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的拒绝:', promise, '原因:', reason);服务
});

process.on('uncaughtException', error => {
    console.error('未捕获的异常:', error);
    process.exit(1);
});