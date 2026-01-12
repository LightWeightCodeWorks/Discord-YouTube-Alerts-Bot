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
  cron.schedule('*/15 * * * *', checkForNewVideos); // Every 15 mins to save quota
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
  const channelIds = new Set();
  for (const guildId in trackedChannels) {
    for (const channelId in trackedChannels[guildId].youtubeChannels) {
      channelIds.add(channelId);
    }
  }

  if (channelIds.size === 0) return;

  // Process in batches of 50 (API limit)
  const channelList = Array.from(channelIds);
  for (let i = 0; i < channelList.length; i += 50) {
    const batch = channelList.slice(i, i + 50);
    const uploadsData = await getUploadsBatch(batch);
    
    for (const guildId in trackedChannels) {
      for (const channelId of batch) {
        if (!trackedChannels[guildId].youtubeChannels[channelId]) continue;
        
        const lastVideoId = trackedChannels[guildId].youtubeChannels[channelId];
        const latestVideo = uploadsData[channelId];

        if (latestVideo && latestVideo.videoId !== lastVideoId) {
          const discordChannelId = trackedChannels[guildId].discordChannelId;
          
          if (!discordChannelId) {
            console.error(`No alert channel set for guild ${guildId}`);
            continue;
          }

          const discordChannel = await client.channels.fetch(discordChannelId).catch(() => null);
          if (discordChannel) {
            await discordChannel.send(`<@everyone> 📢 New YouTube video from ${latestVideo.channelTitle}! Feel free to check it out!\nhttps://youtu.be/${latestVideo.videoId}`).catch(console.error);
          } else {
            console.error(`Could not fetch alert channel ${discordChannelId} for guild ${guildId}. It may have been deleted.`);
          }
          trackedChannels[guildId].youtubeChannels[channelId] = latestVideo.videoId;
        }
      }
    }
  }
  fs.writeFileSync('channels.json', JSON.stringify(trackedChannels, null, 2));
}

async function getUploadsBatch(channelIds) {
  try {
    const results = {};
    
    for (const channelId of channelIds) {
      const activitiesUrl = `https://www.googleapis.com/youtube/v3/activities?key=${process.env.YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,contentDetails&maxResults=5&type=upload`;
      const activitiesRes = await axios.get(activitiesUrl);
      
      if (activitiesRes.data.items && activitiesRes.data.items.length > 0) {
        // Find the most recent upload activity
        const latestUpload = activitiesRes.data.items.find(item => item.snippet.type === 'upload');
        if (latestUpload) {
          results[channelId] = {
            videoId: latestUpload.contentDetails.upload.videoId,
            channelTitle: latestUpload.snippet.channelTitle
          };
        }
      }
    }
    return results;
  } catch (err) {
    console.error('YouTube API batch error:', err.message);
    return {};
  }
}

async function getLatestVideo(channelId) {
  try {
    const activitiesUrl = `https://www.googleapis.com/youtube/v3/activities?key=${process.env.YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,contentDetails&maxResults=1&type=upload`;
    const res = await axios.get(activitiesUrl);
    
    if (res.data.items && res.data.items.length > 0) {
      const latestUpload = res.data.items[0];
      if (latestUpload && latestUpload.contentDetails.upload) {
        return {
          id: { videoId: latestUpload.contentDetails.upload.videoId },
          snippet: { channelTitle: latestUpload.snippet.channelTitle }
        };
      }
    }
    return null;
  } catch (err) {
    console.error('YouTube API error:', err.message);
    return null;
  }
}

client.login(process.env.DISCORD_TOKEN);

