import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { supabase } from '../supabase';
import { hasHCS } from '../utils/permissions';
import { getPortalUser } from '../utils/userLookup';
import { successEmbed, errorEmbed } from '../utils/embeds';

export const forceLogout = {
  data: new SlashCommandBuilder()
    .setName('force-logout')
    .setDescription('[HCS+] Wymuś wylogowanie użytkownika z portalu')
    .addUserOption((o) => o.setName('user').setDescription('Użytkownik').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.member || !hasHCS(interaction.member as any)) {
      return interaction.reply({ embeds: [errorEmbed('Brak uprawnień (wymagane HCS+).')], ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user', true);
    const portalUser = await getPortalUser(targetUser.id);

    if (!portalUser) {
      return interaction.reply({ embeds: [errorEmbed('Użytkownik nie znaleziony w portalu.')], ephemeral: true });
    }

    const { error } = await supabase
      .from('users')
      .update({ force_logout_after: new Date().toISOString() })
      .eq('id', portalUser.id);

    if (error) {
      return interaction.reply({ embeds: [errorEmbed(`Błąd: ${error.message}`)], ephemeral: true });
    }

    const actor = await getPortalUser(interaction.user.id);

    await supabase.from('discord_events').insert({
      event_type: 'admin_action',
      channel: 'logi-kadry',
      data: {
        action: 'force_logout',
        actor: actor?.username || interaction.user.username,
        target: portalUser.mta_nick || portalUser.username,
      },
    });

    return interaction.reply({
      embeds: [successEmbed(`Wymuszono wylogowanie **${portalUser.mta_nick || portalUser.username}** z portalu.`)],
    });
  },
};
