import DiscordHandler from './misc/discordHandler';
import SqlHandler from './misc/sqlHandler';
import InteractionHandler from './misc/interactionHandler';
import dotenv from 'dotenv';
import { LanguageHandler } from './misc/languageHandler';

dotenv.config();

declare global {
  var discordHandler: DiscordHandler;
  var sqlHandler: SqlHandler;
  var interactionHandler: InteractionHandler;
  var languageHandler: LanguageHandler;
}
global.languageHandler = new LanguageHandler();
global.discordHandler = new DiscordHandler();
global.sqlHandler = new SqlHandler();
global.interactionHandler = new InteractionHandler();

discordHandler.client.on('interactionCreate', (interaction) => interactionHandler.handle(interaction));


process.on('uncaughtException', (err: Error) => {
  console.error('Unhandled exception', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection', reason);
});


sqlHandler.initDB().then(async ()=> {
  await discordHandler.client.login(process.env.DISCORD_TOKEN);
  await interactionHandler.Init();
  console.log('Imise Bot live!')
});