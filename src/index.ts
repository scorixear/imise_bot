/* eslint-disable no-var */
import SqlHandler from './handlers/sqlHandler';
import dotenv from 'dotenv';
import { DiscordHandler, InteractionHandler, Logger, TwoWayMap, WARNINGLEVEL } from 'discord.ts-architecture';
import { GatewayIntentBits, Partials } from 'discord.js';
import AddBotChannelCommand from './commands/Moderation/addBotChannel';
import RemoveBotChannelCommand from './commands/Moderation/removeBotChannel';
import VoiceEventHandler from './handlers/voiceEventHandler';

dotenv.config();

declare global {
  var discordHandler: DiscordHandler;
  var sqlHandler: SqlHandler;
  var interactionHandler: InteractionHandler;
}
global.discordHandler = new DiscordHandler(
  [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
  [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.Guilds
  ]
);
global.sqlHandler = new SqlHandler();

global.interactionHandler = new InteractionHandler(
  new TwoWayMap(new Map()),
  [new AddBotChannelCommand(), new RemoveBotChannelCommand()],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {}
);

discordHandler.on('interactionCreate', (interaction) => interactionHandler.handle(interaction));
VoiceEventHandler.tempChannels = [];
discordHandler.on('voiceStateUpdate', VoiceEventHandler.handleVoiceStateUpdate);

process.on('uncaughtException', (err: Error) => {
  Logger.exception('Uncaught Exception', err, WARNINGLEVEL.ERROR);
});
process.on('unhandledRejection', (reason) => {
  Logger.exception('Unhandled Rejection', reason, WARNINGLEVEL.ERROR);
});

sqlHandler.initDB().then(async () => {
  await discordHandler.login(process.env.DISCORD_TOKEN ?? '');
  await interactionHandler.init(process.env.DISCORD_TOKEN ?? '', process.env.CLIENTID ?? '', discordHandler);
  Logger.info('Bot is ready');
});
