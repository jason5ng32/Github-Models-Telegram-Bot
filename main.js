import { initializeBot, sendMessage } from './telegram.js';
import { getAIResponse, resetUserHistory } from './chat.js';
import { getUserModelName, getUserTemperature } from './user.js';

// 处理用户消息
async function handleUserMessage(userId, message) {
    try {
        const response = await getAIResponse(userId, message);
        await sendMessage(userId, response);
    } catch (error) {
        console.error('处理用户消息时出错：', error);
        await sendMessage(userId, "抱歉，处理用户消息时出错。请稍后再试。");
    }
}

// 处理开始命令
async function handleStart(userId, userFirstName, userLastName) {
    let currentModelName = getUserModelName(userId);
    let currentTemperature = getUserTemperature(userId);
    sendMessage(userId, `👏👏👏\n${userFirstName} ${userLastName} 您来啦！\n我已经准备好为你提供帮助！\n当前选择的大模型是：${currentModelName}，温度是${currentTemperature}。`);
}

// 处理停止命令
async function handleStop(userId) {
    sendMessage(userId, "已经清空本轮对话，你可以重新开始新一轮对话。");
    resetUserHistory(userId);  // 清空该用户的对话历史
}

async function main() {
    try {
        // 初始化 Telegram 机器人
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