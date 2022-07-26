import SqlHandler from './handlers/sqlHandler';
import InteractionHandler from './handlers/interactionHandler';
import dotenv from 'dotenv';
import DiscordHandler from './handlers/discordHandler';

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