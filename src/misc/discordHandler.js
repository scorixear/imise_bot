import Discord from 'discord.js';
import sqlHandler from './sqlHandler';
const client = new Discord.Client();
const tempChannels = [];

client.on('voiceStateUpdate', async (newVoice, oldVoice) => {
  const newUserChannel = oldVoice.channel;
  const oldUserChannel = newVoice.channel;

  if (oldUserChannel != newUserChannel) {
    if (oldUserChannel && tempChannels.includes(oldUserChannel)) {
      if (oldUserChannel.members.array().length === 0) {
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
          type: 'voice',
          parent: newUserChannel.parent,
          permissionOverwrites: newUserChannel.permissionOverwrites,
          position: newUserChannel.position,
        });
        tempChannels.push(channel);
        newVoice.setChannel(channel);
      }
    }
  }
});

export default {client};
