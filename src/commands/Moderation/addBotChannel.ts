import SqlHandler from "../../misc/sqlHandler";
import { LanguageHandler } from "../../misc/languageHandler";
import { CommandInteractionHandle } from "../../interactions/interactionHandles";
import { SlashCommandChannelOption, SlashCommandStringOption } from "@discordjs/builders";
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
    commandOptions.push(new SlashCommandStringOption().setName('channel_names').setDescription(languageHandler.language.commands.addBotChannel.options.channel_names).setRequired(true));
    super(
      'addchannel',
      () => languageHandler.language.commands.addBotChannel.description,
      'addchannel #general general-$',
      'Moderation',
      'addchannel <#channel-name> <channel-names>',
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
    const channelNames = interaction.options.getString('channel_names');

    if (!channelNames) {
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild,
        author: interaction.user,
        title: languageHandler.language.commands.addBotChannel.usageTitle,
        description: this.usage,
        color: 0xcc0000,
      }));
      return;
    }
    if (!channelNames.includes('$')) {
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild,
        author: interaction.user,
        title: languageHandler.language.commands.addBotChannel.error.usageTitle,
        description: this.usage,
        color: 0xcc0000,
      }));
      return;
    }

    if (!await sqlHandler.saveChannel(channel.id, channelNames)) {
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild,
        author: interaction.user,
        title: languageHandler.language.commands.addBotChannel.error.sqlTitle,
        description: languageHandler.language.commands.addBotChannel.error.sqlDescription,
        color: 0xcc0000,
      }));
      return;
    }

    interaction.reply(await messageHandler.getRichTextExplicitDefault({
      guild: interaction.guild,
      author: interaction.user,
      title: languageHandler.language.commands.addBotChannel.labels.success,
      description: languageHandler.replaceArgs(languageHandler.language.commands.addBotChannel.labels.description, [channel.name, channelNames]),
    }));
  }
}