# Discord YouTube Alerts Bot
This is a simple Discord Bot code that send messages when a new video from a specific YouTube channel is published to a Discord server channel of choice. This bot has nearly every feature offered, and has easy configurations with /slash commands to help you get set up with sharing alert announcements with ease. Code is open-source and improvements are welcome.

<img src="https://raw.githubusercontent.com/LightWeightCodeWorks/Discord-YouTube-Alerts-Bot/main/misc/exampleresult.png">
<img src="https://raw.githubusercontent.com/LightWeightCodeWorks/Discord-YouTube-Alerts-Bot/main/misc/slashcommands.png">
(Example of the bot in action under the name "ConnectSocialsNotifier")

## Features

- Uses easy to configure slash commands to add, remove or list channel IDs being tracked
- Point where the bot should announce an alert to a specific Discord server channel with it's unique ID
- Choose which role to ping for latest alert messages easily
- Optimizes the YouTube Data API v3 quota usage by using the /activities endpoint rather than the frequent /search endpoint which incurs an extremely high API quota cost
- Tune the frequency of checking videos with a customizable cron job
- So far, completely Javascript based - uses node.js to work through the process
- Uses environment variables to safely store your Discord Token, YouTube API Key, and Bot's Client ID (Used for registering commands)
- Limit use of slash commands to admins or staff (to prevent unwanted additions of channel IDs requested by normal users)

## Things to add/improve

- More testing if this code is good for multiple servers/guilds (great for use with only one Discord bot)
- Occassional updates to frequency checks (Well optimized with API already but check for issues now ad then)
- Creating custom messages when the bot shares a new video (This is currently in discussion)

## What should the Environment Variables be like? (the .env file you must add yourself)

```bash
# Set up the .env file
DISCORD_TOKEN=YOUR DISCORD TOKEN
CLIENT_ID=YOUR DISCORD BOT CLIENT ID
YOUTUBE_API_KEY=YOUR YOUTUBE API KEY
```

## Installation

We recommend adding your credientials and adding respective Discord server channel IDs before installing these files to your own bot/server.

```bash
# Clone the repository
git clone https://github.com/LightWeightCodeWorks/Discord-YouTube-Alerts-Bot.git

# Navigate into the directory
cd Discord-YouTube-Alerts-Bot

# Install dependencies
npm install

# Register slash commands
node register-commands.js

# Start the bot
node index.js
```

You're done! Use the slash commands to begin adding a channel. (/addchannel)
You will need the YouTube channel ID that you will want to track. (PM2 is recommended for production use for starting the bot)
