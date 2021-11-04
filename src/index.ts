import DiscordHandler from './misc/discordHandler';
import config from './config';
import SqlHandler from './misc/sqlHandler';
import InteractionHandler from './misc/InteractionHandler';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  discordHandler: DiscordHandler;
  sqlHandler: SqlHandler;
  interactionHandler: InteractionHandler;
}

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
});