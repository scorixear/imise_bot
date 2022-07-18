
import SqlHandler from './misc/sqlHandler';
import InteractionHandler from './misc/interactionHandler';
import { LanguageHandler } from './misc/languageHandler';
import dotenv from 'dotenv';
import DiscordHandler from './misc/discordHandler';

dotenv.config();

declare global {
  var discordHandler: DiscordHandler;
  var sqlHandler: SqlHandler;
  var interactionHandler: InteractionHandler;
  var languageHandler: LanguageHandler;
}
global.discordHandler = new DiscordHandler();
global.sqlHandler = new SqlHandler();
global.interactionHandler = new InteractionHandler();
global.languageHandler = new LanguageHandler();

discordHandler.on('interactionCreate', (interaction) => interactionHandler.handle(interaction));


process.on('uncaughtException', (err: Error) => {
  console.error('Unhandled exception', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection', reason);
});


sqlHandler.initDB().then(async ()=> {
  await discordHandler.login(process.env.DISCORD_TOKEN??"");
  await interactionHandler.Init();
  console.log('Imise Bot live!')
});