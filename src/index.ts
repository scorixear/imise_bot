import SqlHandler from './handlers/sqlHandler';
import InteractionHandler from './handlers/interactionHandler';
import dotenv from 'dotenv';
import DiscordHandler from './handlers/discordHandler';
import {Logger, WARNINGLEVEL} from './helpers/logger';

dotenv.config();

declare global {
  var discordHandler: DiscordHandler;
  var sqlHandler: SqlHandler;
  var interactionHandler: InteractionHandler;
}
global.discordHandler = new DiscordHandler();
global.sqlHandler = new SqlHandler();
global.interactionHandler = new InteractionHandler();

discordHandler.on('interactionCreate', (interaction) => interactionHandler.handle(interaction));


process.on('uncaughtException', (err: Error) => {
  Logger.Error('Uncaught Exception', err, WARNINGLEVEL.ERROR);
});
process.on('unhandledRejection', (reason) => {
  Logger.Error('Unhandled Rejection', reason, WARNINGLEVEL.ERROR);
});


sqlHandler.initDB().then(async ()=> {
  await discordHandler.login(process.env.DISCORD_TOKEN??"");
  await interactionHandler.Init();
  Logger.Log("Bot is ready", WARNINGLEVEL.INFO);
});