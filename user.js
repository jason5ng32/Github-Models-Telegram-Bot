import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 确保 user.json 文件存在
const userJsonPath = path.join(__dirname, 'user.json');
if (!fs.existsSync(userJsonPath)) {
    fs.writeFileSync(userJsonPath, '[]');
}

// 缓存 users 数据
let users = [];
let usersMap = new Map();

function loadUsers() {
    try {
        const userJson = fs.readFileSync(userJsonPath, 'utf8');
        users = JSON.parse(userJson || '[]'); 
        usersMap = new Map(users.map(user => [user.id, user]));
    } catch (err) {
        console.error('读取 user.json 文件出错:', err);
        users = [];
        usersMap = new Map();
    }
}

function saveUsers() {
    try {
        fs.writeFileSync(userJsonPath, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('写入 user.json 文件出错:', err);
    }
}

// 确保 user.json 文件存在并加载 users 数据
if (!fs.existsSync(userJsonPath)) {
    fs.writeFileSync(userJsonPath, '[]');
}
loadUsers();

// 读取用户的模型名称
function getUserModelName(userId) {
    return usersMap.get(userId)?.modelName || 'gpt-4o';
}

// 读取用户设置的温度值
function getUserTemperature(userId) {
    return usersMap.get(userId)?.temperature || 0.7;
}

// 设置用户的模型名称
function saveUserModelName(userId, modelName) {
    let user = usersMap.get(userId);
    if (user) {
        user.modelName = modelName;
    } else {
        user = { id: userId, modelName: modelName };
        users.push(user);
        usersMap.set(userId, user);
    }

    saveUsers(); 
}

// 设置用户的温度值
function saveUserTemperature(userId, temperature) {
    const numericTemperature = parseFloat(temperature);
    if (isNaN(numericTemperature)) {
        console.error('无效的温度值:', temperature);
        return;
    }

    let user = usersMap.get(userId);
    if (user) {
        user.temperature = numericTemperature;
    } else {
        user = { id: userId, temperature: numericTemperature };
        users.push(user);
        usersMap.set(userId, user);
    }

    saveUsers(); 
}

export { getUserModelName, saveUserModelName, getUserTemperature, saveUserTemperature };