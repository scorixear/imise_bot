import {Client, Guild, Intents, Awaitable, VoiceBasedChannel} from 'discord.js';
export default class DiscordHandler {
  private client: Client;
  private tempChannels: VoiceBasedChannel[];
  constructor() {
    this.client = new Client({
      partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
      intents: [Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS]});
    this.tempChannels = []
    this.client.on('voiceStateUpdate', async (newVoice, oldVoice) => {
      const newUserChannel = oldVoice.channel;
      const oldUserChannel = newVoice.channel;

      if (oldUserChannel !== newUserChannel) {
        if (oldUserChannel && this.tempChannels.includes(oldUserChannel)) {
          if (oldUserChannel.members.size === 0) {
            for (let i = 0; i < this.tempChannels.length; i++) {
              if (this.tempChannels[i] === oldUserChannel) {
                this.tempChannels.splice(i, 1);
                break;
              }
            }
            await oldUserChannel.delete();
          }
        }
        if (newUserChannel) {
          const replacement = await global.sqlHandler.findChannel(newUserChannel.id);
          if (replacement) {
            let counter = 1;
            while (newVoice.guild.channels.cache.find((c) => c.name === replacement.replace('$', counter))) {
              counter++;
            }
            const channel = await newVoice.guild.channels.create(replacement.replace('$', counter), {
              type: 'GUILD_VOICE',
              parent: newUserChannel.parent??undefined,
              position: newUserChannel.position + 1,
            });
            channel.permissionOverwrites.set(newUserChannel.permissionOverwrites.cache);
            this.tempChannels.push(channel);
            newVoice.setChannel(channel);
          }
        }
      }
    })
  }
  public getFirstGuild() {
    return this.client.guilds.cache.first();
  }
  public getGuilds() {
    return this.client.guilds.cache;
  }
  public on(event: string, callback: (...args: any[]) => Awaitable<void>) {
    return this.client.on(event, callback);
  }
  public async login(token: string) {
    return await this.client.login(token);
  }
}
