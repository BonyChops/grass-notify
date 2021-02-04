# grass-notify
 Notify whether contributed today or not / 今日GitHubにて草を生やしたかどうかを通知する

# config.json
Put `config.json` on root of directory.
```json
{
    "daily": ["20:00", "21:00", "//Set time like HH:mm"],
    "username": "your-github-username",
    "webhook":{
        "to": "discord-webhook-uri",
        "userId": "discord-your-id",
        "type": "discord"
    }
}
```