import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v10'
import { ChatInputCommandInteraction, Interaction } from "discord.js";
import AddBotChannelCommand from "../commands/Moderation/addBotChannel";
import RemoveBotChannelCommand from "../commands/Moderation/removeBotChannel";
import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

export default class InteractionHandler {
  public commandInteractions: CommandInteractionHandle[];
  constructor() {
    this.commandInteractions = [
      new AddBotChannelCommand(),
      new RemoveBotChannelCommand()
    ];
  }

  public async Init() {
    for (const interaction of this.commandInteractions) {
      if (interaction.Ready) {
        await interaction.Ready;
      }
    }
    const commands = this.commandInteractions.map(command => command.slashCommandBuilder.toJSON());
    const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN??"");

    global.discordHandler.getGuilds().forEach(async guild => {
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENTID??"", guild.id), {body: commands});
      Logger.Log("Successfully registered application commands for guild", WARNINGLEVEL.INFO, guild.name);
    })
  }

  public async handle(interaction: Interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const commandInteraction: ChatInputCommandInteraction = interaction as ChatInputCommandInteraction;
        const handler = this.commandInteractions.find(interactionHandle => interactionHandle.command === commandInteraction.commandName);
        if (handler) {
          await handler.handle(commandInteraction);
        }
      } else {
        return;
      }
    } catch (err) {
      Logger.Error("Error handling Interaction", err, WARNINGLEVEL.ERROR);
    }
  }
}
