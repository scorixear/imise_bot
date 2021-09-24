import {Client, Intents} from 'discord.js';
import sqlHandler from './sqlHandler';
const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
  intents: [Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS]});
const tempChannels = [];

client.on('voiceStateUpdate', async (newVoice, oldVoice) => {
  const newUserChannel = oldVoice.channel;
  const oldUserChannel = newVoice.channel;

  if (oldUserChannel != newUserChannel) {
    if (oldUserChannel && tempChannels.includes(oldUserChannel)) {
      if (oldUserChannel.members.size === 0) {
        for (let i = 0; i< tempChannels.length; i++) {
          if (tempChannels[i] === oldUserChannel) {
            tempChannels.splice(i, 1);
            break;
          }
        }
        await oldUserChannel.delete();
      }
    }
    if (newUserChannel) {
      const replacement = await sqlHandler.findChannel(newUserChannel.id);
      if (replacement) {
        let counter = 1;
        while (newVoice.guild.channels.cache.find((channel) => channel.name === replacement.replace('$', counter))) {
          counter++;
        }
        const channel = await newVoice.guild.channels.create(replacement.replace('$', counter), {
          type: 'GUILD_VOICE',
          parent: newUserChannel.parent,
          position: newUserChannel.position + 1,
        });
        channel.permissionOverwrites.set(newUserChannel.permissionOverwrites.cache);
        tempChannels.push(channel);
        newVoice.setChannel(channel);
      }
    }
  }
});

export default {client};
