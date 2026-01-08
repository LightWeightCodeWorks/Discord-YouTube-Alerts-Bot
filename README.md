# Discord YouTube Alerts Bot
This is a simple Discord Bot code that send messages when a new video from a specific YouTube channel is published to a Discord server channel of choice. Of course, this is not fully complete and still requires a lot of work to be done. Code is open-source and improvements are welcomed.

<img src="https://raw.githubusercontent.com/Andrew-Drive/Discord-YouTube-Alerts-Bot/main/misc/exampleresult.png">
<img src="https://raw.githubusercontent.com/Andrew-Drive/Discord-YouTube-Alerts-Bot/main/misc/slashcommands.png">
(Example of the bot in action under the name "ConnectSocialsNotifier")

## Features

- Uses easy to configure slash commands to add, remove or list channel IDs being tracked
- Custom messages can be created when the bot shares a new video
- Tune the frequency of checking videos with a customizable cron job
- So far, completely Javascript based - uses node.js to work through the process
- Uses environment variables to safely store your Discord Token, YouTube API Key, and Bot's Client ID (Used for registering commands)
- Limit use of slash commands to a specific role, such as admins or staff (to prevent unwanted additions of channel IDs requested by normal users)

## Things to add/improve

- YouTube API Optimization: Fix a 403 Forbidden error by switching from the /search endpoint to the /activities endpoint. This is more reliable and typically has lower quota costs for fetching the latest channel uploads.
- Improvements to frequency checks (slight delays but should be consistent, and must remain within YouTube API limits)
- An additional slash command to add/point where the bot should announce to a specific Discord server channel with an unique ID
- An additional slash command to add/point what role should the bot use to ping members that can be optionally used when announcing with an unique role ID (currently have to add the role ID manually in the code or use @everyone)
- Easily configure which role can use slash commands (have to manually configure permissions through the code in the commands folder - currently set to Admin, and role must exist in the server for it to work)

## What should the Environment Variables be like? (the .env file you must add yourself)

```bash
# Set up the .env file
DISCORD_TOKEN=YOUR DISCORD TOKEN
CLIENT_ID=YOUR DISCORD BOT CLIENT ID
YOUTUBE_API_KEY=YOUR YOUTUBE API KEY
```

## Installation

We recommend adding your credientials and adding respective Discord server channel IDs before installing to your own server.

```bash
# Clone the repository
git clone https://github.com/Andrew-Drive/Discord-YouTube-Alerts-Bot.git

# Navigate into the directory
cd Discord-YouTube-Alerts-Bot

# Install dependencies
npm install

# Register slash commands
node register-commands.js

# Start the bot
node index.js
```

You're done! Use the slash commands to begin adding a channel. (/add-channel)
You will need the YouTube channel ID that you will want to track. (PM2 is recommended for production use for starting the bot)
