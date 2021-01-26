const cron = require('node-cron');
const moment = require('moment');
const request = require('request');
const fs = require('fs');
const loadJSON = (fileName) => { return JSON.parse(fs.readFileSync(fileName)) };
const config = loadJSON("./config.json");

const job = () => {
    request({ url: `https://api.github.com/users/${config.username}/events`, headers: { 'User-Agent': 'grass-notify' } }, (error, response, body) => {
        // エラーチェック
        if (error !== null) {
            console.error('error:', error);
            return (false);
        }
        const data = JSON.parse(body);
        const count = data.filter(event => moment(event.created_at).format("YYYY/MM/DD") === moment().format("YYYY/MM/DD")).length;
        console.log(`Today has ${count} contributions!`);
        if (count === 4) {
            if (config.webhook.type === "discord") {
                request({
                    url: config.webhook.to, method: "POST", json: {
                        "username": "grass-notify",
                        "avatar_url": "https://github.com/github.png",
                        "content": `<@!308554186373464064> **Warning:**`,
                        "embeds": [
                            {
                                "title": `${config.username}さん，今日の草が生えていません`,
                                "description": "**本日分の草を至急生やしてください**",
                                "url": `https://github.com/${config.username}`,
                                "timestamp": moment().utc(),
                                "color": 0xFF0000,
                                "thumbnail": {
                                    "url": "https://cdn1.iconfinder.com/data/icons/color-bold-style/21/08-512.png"
                                }
                            }
                        ]
                    }
                }, (error, response, body) => {
                    if (error !== null) {
                        console.error('error:', error);
                        return (false);
                    }
                });
            } else {
                console.error("Discord以外は未実装です＞＜");
            }
        }
    });

}

cron.schedule("* * * * *", () => {
    if (config.daily.some(time => moment(time).format("hh:mm") === moment().format("hh:mm"))) {
        job();
    }
});
