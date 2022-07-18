import SqlHandler from "../../handlers/sqlHandler";
import { LanguageHandler } from "../../handlers/LanguageHandler";
import { CommandInteractionHandle } from "../../model/CommandInteractionHandle";
import { SlashCommandChannelOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import messageHandler from '../../handlers/messageHandler';
import { ChannelType } from "discord-api-types/v10";

declare const sqlHandler: SqlHandler;

export default class RemoveBotChannelCommand extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    const channelOption: SlashCommandChannelOption = new SlashCommandChannelOption().setName('channel').setDescription(LanguageHandler.language.commands.addBotChannel.options.channel).setRequired(true);
    channelOption.addChannelTypes(ChannelType.GuildVoice);
    commandOptions.push(channelOption);
    super(
      'removechannel',
      () => LanguageHandler.language.commands.removeBotChannel.description,
      'removechannel #general',
      'Moderation',
      'removechannel <#channel-name>',
      commandOptions,
      false,
    );
  }

  override async handle(interaction: CommandInteraction) {
    try {
      await super.handle(interaction);
    } catch(err) {
      return;
    }

    const channel = interaction.options.getChannel('channel');

    if (!await sqlHandler.removeChannel(channel?.id??"")) {
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild??undefined,
        author: interaction.user,
        title: LanguageHandler.language.commands.removeBotChannel.error.sqlTitle,
        description: LanguageHandler.language.commands.removeBotChannel.error.sqlDescription,
        color: 0xcc0000,
      }));
      return;
    }

    interaction.reply(await messageHandler.getRichTextExplicitDefault({
      guild: interaction.guild??undefined,
      author: interaction.user,
      title: LanguageHandler.language.commands.removeBotChannel.labels.success,
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.removeBotChannel.labels.description, [channel?.name??""]),
    }));
  }
}