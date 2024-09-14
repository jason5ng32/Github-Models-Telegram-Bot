# Github-Models-Telegram-Bot

一个非常简单的，在 Telegram 里使用机器人调用 Github 大模型的小工具。

为啥弄这个呢？因为我觉得用 Telegram 玩大模型，比在 Github Model Playground 里玩更容易使用。

当然啦，最重要的是，免费。单纯给自己玩的话，每天的额度其实足够用了。

## 使用说明

安装：

```bash
npm install
```

设置环境变量

```bash
cp .env.example .env
```

根据里面的字段，自己填一下。字段说明如下：

* `TELEGRAM_TOKEN`：Telegram 机器人的 token，如果不知道怎么弄，自己 Google 一下。
* `GITHUB_TOKEN`：你的 Github token，可以在设置里生成。
* `ALLOWED_USER_IDS`：允许使用机器人的 Telegram 用户 ID （不是用户名） 列表，多个用 ``,`` 隔开。如果不知道怎样查看自己的 ID，自己 Google 一下。

配置完之后，就可以运行了：

```bash
npm start
```

或者通过 pm2 运行：

```bash
pm2 start main.js
```

搞定。
