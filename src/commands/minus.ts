import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { supabase } from '../supabase';
import { hasCS } from '../utils/permissions';
import { getPortalUser } from '../utils/userLookup';
import { successEmbed, errorEmbed } from '../utils/embeds';

export const minus = {
  data: new SlashCommandBuilder()
    .setName('minus')
    .setDescription('[CS+] Nadaj minus użytkownikowi')
    .addUserOption((o) => o.setName('user').setDescription('Użytkownik').setRequired(true))
    .addStringOption((o) => o.setName('powod').setDescription('Powód').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.member || !hasCS(interaction.member as any)) {
      return interaction.reply({ embeds: [errorEmbed('Brak uprawnień (wymagane CS+).')], ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('powod', true);
    const portalUser = await getPortalUser(targetUser.id);

    if (!portalUser) {
      return interaction.reply({ embeds: [errorEmbed('Użytkownik nie znaleziony w portalu.')], ephemeral: true });
    }

    const actor = await getPortalUser(interaction.user.id);

    const { error: penaltyError } = await supabase.from('user_penalties').insert({
      user_id: portalUser.id,
      created_by: actor?.id || portalUser.id,
      type: 'minus',
      description: reason,
    });

    if (penaltyError) {
      return interaction.reply({ embeds: [errorEmbed(`Błąd: ${penaltyError.message}`)], ephemeral: true });
    }

    await supabase.from('users').update({ minus_count: (portalUser.minus_count || 0) + 1 }).eq('id', portalUser.id);

    await supabase.from('discord_events').insert({
      event_type: 'plus_minus',
      channel: 'logi-kary-nagrody',
      data: {
        type: 'minus',
        user: portalUser.username,
        mtaNick: portalUser.mta_nick,
        description: reason,
        by: actor?.username || interaction.user.username,
      },
    });

    return interaction.reply({
      embeds: [successEmbed(`Nadano **-1** dla **${portalUser.mta_nick || portalUser.username}**\nPowód: ${reason}`)],
    });
  },
};
