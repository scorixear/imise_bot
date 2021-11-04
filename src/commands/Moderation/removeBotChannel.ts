import SqlHandler from "../../misc/sqlHandler";
import { LanguageHandler } from "../../misc/languageHandler";
import { CommandInteractionHandle } from "../../interactions/interactionHandles";
import { SlashCommandChannelOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import messageHandler from '../../misc/messageHandler';
import { ChannelType } from "discord-api-types";


declare const languageHandler: LanguageHandler;
declare const sqlHandler: SqlHandler;

export default class AddBotChannelCommand extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    const channelOption: SlashCommandChannelOption = new SlashCommandChannelOption().setName('channel').setDescription(languageHandler.language.commands.addBotChannel.options.channel).setRequired(true);
    channelOption.addChannelType(ChannelType.GuildVoice);
    commandOptions.push(channelOption);
    super(
      'removechannel',
      () => languageHandler.language.commands.removeBotChannel.description,
      'removechannel #general',
      'Moderation',
      'removechannel <#channel-name>',
      commandOptions,
      true,
    );
  }

  override async handle(interaction: CommandInteraction) {
    try {
      await super.handle(interaction);
    } catch(err) {
      return;
    }

    const channel = interaction.options.getChannel('channel');

    if (!await sqlHandler.removeChannel(channel.id)) {
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild,
        author: interaction.user,
        title: languageHandler.language.commands.removeBotChannel.sqlError,
        description: languageHandler.language.commands.removeBotChannel.sqlErrorDescription,
        color: 0xcc0000,
      }));
      return;
    }

    interaction.reply(await messageHandler.getRichTextExplicitDefault({
      guild: interaction.guild,
      author: interaction.user,
      title: languageHandler.language.commands.removeBotChannel.labels.success,
      description: languageHandler.replaceArgs(languageHandler.language.commands.removeBotChannel.labels.description, [channel.name]),
    }));
  }
}