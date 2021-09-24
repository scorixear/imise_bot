import DiscordHandler from './misc/discordHandler';
import sqlHandler from './misc/sqlHandler';

DiscordHandler.client.on('ready', ()=> {
  console.log('Imise Bot is online!');
});

DiscordHandler.client.on('message', CmdHandler ? CmdHandler.parseCommand: ()=> {});

sqlHandler.initDB().then(()=>{
  DiscordHandler.client.login(config.token);
});
