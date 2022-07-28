import SqlHandler from '../../handlers/sqlHandler';
import { LanguageHandler } from '../../handlers/languageHandler';
import { ChatInputCommandInteraction, SlashCommandChannelOption } from 'discord.js';
import { ChannelType } from 'discord-api-types/v10';
import { CommandInteractionModel, MessageHandler } from 'discord.ts-architecture';

declare const sqlHandler: SqlHandler;

export default class RemoveBotChannelCommand extends CommandInteractionModel {
  constructor() {
    const commandOptions: any[] = [];
    const channelOption: SlashCommandChannelOption = new SlashCommandChannelOption()
      .setName('channel')
      .setDescription(LanguageHandler.language.commands.addBotChannel.options.channel)
      .setRequired(true);
    channelOption.addChannelTypes(ChannelType.GuildVoice);
    commandOptions.push(channelOption);
    super(
      'removechannel',
      LanguageHandler.language.commands.removeBotChannel.description,
      'removechannel #general',
      'Moderation',
      'removechannel <#channel-name>',
      commandOptions
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }

    const channel = interaction.options.getChannel('channel');

    if (!(await sqlHandler.removeChannel(channel?.id ?? ''))) {
      await MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.removeBotChannel.error.sqlTitle,
        description: LanguageHandler.language.commands.removeBotChannel.error.sqlDescription,
        color: 0xcc0000
      });
      return;
    }

    await MessageHandler.reply({
      interaction,
      title: LanguageHandler.language.commands.removeBotChannel.labels.success,
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.removeBotChannel.labels.description, [
        channel?.name ?? ''
      ])
    });
  }
}
