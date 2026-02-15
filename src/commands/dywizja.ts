import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { supabase } from '../supabase';
import { hasHCS } from '../utils/permissions';
import { getPortalUser } from '../utils/userLookup';
import { successEmbed, errorEmbed } from '../utils/embeds';

const DIVISIONS = [
  { name: 'FTO', value: 'FTO' },
  { name: 'SS', value: 'SS' },
  { name: 'DTU', value: 'DTU' },
  { name: 'GU', value: 'GU' },
  { name: 'Brak (usuń)', value: 'none' },
];

export const dywizja = {
  data: new SlashCommandBuilder()
    .setName('dywizja')
    .setDescription('[HCS+] Zmień dywizję użytkownika')
    .addUserOption((o) => o.setName('user').setDescription('Użytkownik').setRequired(true))
    .addStringOption((o) =>
      o.setName('dywizja').setDescription('Dywizja').setRequired(true)
        .addChoices(...DIVISIONS)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.member || !hasHCS(interaction.member as any)) {
      return interaction.reply({ embeds: [errorEmbed('Brak uprawnień (wymagane HCS+).')], ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user', true);
    const divisionValue = interaction.options.getString('dywizja', true);
    const portalUser = await getPortalUser(targetUser.id);

    if (!portalUser) {
      return interaction.reply({ embeds: [errorEmbed('Użytkownik nie znaleziony w portalu.')], ephemeral: true });
    }

    const newDivision = divisionValue === 'none' ? null : divisionValue;
    const { error } = await supabase.from('users').update({ division: newDivision }).eq('id', portalUser.id);

    if (error) {
      return interaction.reply({ embeds: [errorEmbed(`Błąd: ${error.message}`)], ephemeral: true });
    }

    const actor = await getPortalUser(interaction.user.id);

    await supabase.from('discord_events').insert({
      event_type: 'division_change',
      channel: 'logi-kadry',
      data: {
        action: newDivision ? 'grant' : 'revoke',
        user: portalUser.username,
        mtaNick: portalUser.mta_nick,
        division: newDivision || portalUser.division,
        by: actor?.username || interaction.user.username,
      },
    });

    const msg = newDivision
      ? `Nadano dywizję **${newDivision}** dla **${portalUser.mta_nick || portalUser.username}**`
      : `Usunięto dywizję dla **${portalUser.mta_nick || portalUser.username}**`;

    return interaction.reply({ embeds: [successEmbed(msg)] });
  },
};
