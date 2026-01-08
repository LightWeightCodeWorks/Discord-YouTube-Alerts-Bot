# Discord YouTube Alerts Bot
This is a simple lightweight Discord Bot code that send messages when a new video from a specific YouTube channel is published to a Discord server channel of choice.

## Features

- Uses easy to configure slash commands to add, remove or list channel IDs being tracked
- Custom messages can be created when the bot shares a new video
- Tune the frequency of checking videos with a customizable cron job
- Uses environment variables to safely store your Discord Token, YouTube API Key, and Bot's Client ID (Used for registering commands)
- Limit use of slash commands to a specific role, such as admins or staff (to prevent unwanted additions of channel IDs requested by normal users)

## Things to add/improve

- YouTube API Optimization: Fixed a 403 Forbidden error by switching from the /search endpoint to the /activities endpoint. This is more reliable and typically has lower quota costs for fetching the latest channel uploads.
- An additional slash command to add/point where the bot should announce to a specific Discord server channel with an unique ID
- An additional slash command to add/point what role should the bot use to ping members that can be optionally used when announcing with an unique role ID (currently have to add the role ID manually in the code or use @everyone)

## Installation

We recommend adding your credientials and adding respective Discord server channel IDs before installing to your own server.

```bash
# Clone the repository
git clone https://github.com/Andrew-Drive/Discord-YouTube-Alerts-Bot

# Navigate into the directory
cd Discord-YouTube-Alerts-Bot

# Install dependencies
npm install

# Register slash commands
node register-commands.js

# Start the bot
node index.js

You're done! Use the slash commands to begin adding a channel. (/add-channel)
You will need the YouTube channel ID that you will want to track.
