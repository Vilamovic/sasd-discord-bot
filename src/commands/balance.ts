import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getPortalUser } from '../utils/userLookup';
import { sasdEmbed, errorEmbed } from '../utils/embeds';

export const balance = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Pokaż bilans +/- użytkownika')
    .addUserOption((o) => o.setName('user').setDescription('Użytkownik Discord')),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const user = await getPortalUser(targetUser.id);

    if (!user) {
      return interaction.reply({ embeds: [errorEmbed('Nie znaleziono użytkownika w portalu.')], ephemeral: true });
    }

    const embed = sasdEmbed()
      .setTitle(`📊 Bilans — ${user.mta_nick || user.username}`)
      .addFields(
        { name: '➕ Plusy', value: `${user.plus_count || 0}`, inline: true },
        { name: '➖ Minusy', value: `${user.minus_count || 0}`, inline: true },
        { name: '📈 Netto', value: `${(user.plus_count || 0) - (user.minus_count || 0)}`, inline: true },
      );

    return interaction.reply({ embeds: [embed] });
  },
};
