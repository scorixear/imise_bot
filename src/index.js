import DiscordHandler from './misc/discordHandler';
import CmdHandler from './misc/commandHandler';
import config from './config';
import sqlHandler from './misc/sqlHandler';

DiscordHandler.client.on('ready', ()=> {
  console.log('Imise Bot is online!');
});

DiscordHandler.client.on('messageCreate', CmdHandler ? CmdHandler.parseCommand: ()=> {});

sqlHandler.initDB().then(()=>{
  DiscordHandler.client.login(config.token);
});
