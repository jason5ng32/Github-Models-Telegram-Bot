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

// 读取同目录下的 user.json 文件
const userJson = fs.readFileSync(userJsonPath, 'utf8');
const users = JSON.parse(userJson || '[]');  // 确保总是有一个数组可用

// 读取用户的模型名称
function getUserModelName(userId) {
    return users.find(user => user.id === userId)?.modelName || 'gpt-4o';
}

// 设置用户的模型名称
function setUserModelName(userId, modelName) {
    let found = false;
    for (const user of users) {
        if (user.id === userId) {
            user.modelName = modelName;
            found = true;
            break;
        }
    }
    if (!found) {
        users.push({ id: userId, modelName: modelName });
    }
    fs.writeFileSync(userJsonPath, JSON.stringify(users, null, 2));
}

export { getUserModelName, setUserModelName };
