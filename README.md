# Discord YouTube Alerts Bot
This is a simple lightweight Discord Bot code that send messages when a new video from a specific YouTube channel is published to a Discord server channel of choice.

## Features

- Uses three easy to configure slash commands to add, remove or list channel IDs being tracked
- Custom messages can be created when the bot shares a new video
- Tune the frequency of checking videos with a customizable cron job
- Limit use of slash commands to a specific role, such as admins or staff (to prevent unwanted additions of channel IDs requested by normal users)

## Things to add/improve

- YouTube API Optimization: Fixed a 403 Forbidden error by switching from the /search endpoint to the /activities endpoint. This is more reliable and typically has lower quota costs for fetching the latest channel uploads.
- An additional slash command to add/point where the bot should announce to a specific Discord server channel with an unique ID
- An additional slash command to add/point what role should the bot use to ping members when used with an unique role ID (currently have to add the role ID manually in the code or use @everyone)


