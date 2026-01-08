require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('fs');
const cron = require('node-cron');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

const trackedChannels = fs.existsSync('channels.json') ? JSON.parse(fs.readFileSync('channels.json')) : {};

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
} 

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  cron.schedule('*/5 * * * *', checkForNewVideos); // Every 5 mins - a fair warning that this overloads YouTube API limits
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (command) {
    try {
      await command.execute(interaction, trackedChannels);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
  }
});

async function checkForNewVideos() {
  for (const guildId in trackedChannels) {
    for (const channelId in trackedChannels[guildId].youtubeChannels) {
      const lastVideoId = trackedChannels[guildId].youtubeChannels[channelId];
      const newVideo = await getLatestVideo(channelId);

      if (newVideo && newVideo.id.videoId !== lastVideoId) {
        const discordChannel = await client.channels.fetch(trackedChannels[guildId].discordChannelId);
        if (discordChannel) {
          await discordChannel.send(`<@everyone> 📢 New YouTube video from ${newVideo.snippet.channelTitle}! Feel free to check it out!\nhttps://youtu.be/${newVideo.id.videoId}`);
        }

        trackedChannels[guildId].youtubeChannels[channelId] = newVideo.id.videoId;
        fs.writeFileSync('channels.json', JSON.stringify(trackedChannels, null, 2));
      }
    }
  }
}

async function getLatestVideo(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1&type=video`;
  try {
    const res = await axios.get(url);
    return res.data.items[0];
  } catch (err) {
    console.error('YouTube API error:', err.message);
    return null;
  }
}

client.login(process.env.DISCORD_TOKEN);
