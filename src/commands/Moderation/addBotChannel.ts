import SqlHandler from '../../handlers/sqlHandler';
import { LanguageHandler } from '../../handlers/languageHandler';
import { ChatInputCommandInteraction, SlashCommandChannelOption, SlashCommandStringOption } from 'discord.js';
import { ChannelType } from 'discord-api-types/v10';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

declare const sqlHandler: SqlHandler;

export default class AddBotChannelCommand extends CommandInteractionModel {
  constructor() {
    const commandOptions: any[] = [];
    const channelOption: SlashCommandChannelOption = new SlashCommandChannelOption()
      .setName('channel')
      .setDescription(LanguageHandler.language.commands.addBotChannel.options.channel)
      .setRequired(true);
    channelOption.addChannelTypes(ChannelType.GuildVoice);
    commandOptions.push(channelOption);
    commandOptions.push(
      new SlashCommandStringOption()
        .setName('channel_names')
        .setDescription(LanguageHandler.language.commands.addBotChannel.options.channel_names)
        .setRequired(true)
    );
    super(
      'addchannel',
      LanguageHandler.language.commands.addBotChannel.description,
      'addchannel #general general-$',
      'Moderation',
      'addchannel <#channel-name> <channel-names>',
      commandOptions
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const channel = interaction.options.getChannel('channel', true);
    const channelNames = interaction.options.getString('channel_names', true);
    if (!channelNames.includes('$')) {
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.addBotChannel.error.usageTitle,
        description: this.usage,
        color: 0xcc0000
      });
      return;
    }

    if (!(await sqlHandler.saveChannel(channel?.id ?? '', channelNames))) {
      MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.addBotChannel.error.sqlTitle,
        description: LanguageHandler.language.commands.addBotChannel.error.sqlDescription,
        color: 0xcc0000
      });
      return;
    }

    await MessageHandler.reply({
      interaction,
      title: LanguageHandler.language.commands.addBotChannel.labels.success,
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.addBotChannel.labels.description, [
        channel?.name ?? '',
        channelNames
      ])
    });
  }
}
