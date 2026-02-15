import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { supabase } from '../supabase';
import { hasCS } from '../utils/permissions';
import { getPortalUser } from '../utils/userLookup';
import { successEmbed, errorEmbed, BADGE_LABELS } from '../utils/embeds';

const BADGES = Object.keys(BADGE_LABELS);

export const awans = {
  data: new SlashCommandBuilder()
    .setName('awans')
    .setDescription('[CS+] Zmień stopień użytkownika')
    .addUserOption((o) => o.setName('user').setDescription('Użytkownik').setRequired(true))
    .addStringOption((o) =>
      o.setName('stopien').setDescription('Nowy stopień').setRequired(true)
        .addChoices(...BADGES.map((b) => ({ name: BADGE_LABELS[b], value: b })))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.member || !hasCS(interaction.member as any)) {
      return interaction.reply({ embeds: [errorEmbed('Brak uprawnień (wymagane CS+).')], ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user', true);
    const newBadge = interaction.options.getString('stopien', true);
    const portalUser = await getPortalUser(targetUser.id);

    if (!portalUser) {
      return interaction.reply({ embeds: [errorEmbed('Użytkownik nie znaleziony w portalu.')], ephemeral: true });
    }

    const oldBadge = portalUser.badge;
    const isPromotion = BADGES.indexOf(newBadge) > BADGES.indexOf(oldBadge);

    const { error } = await supabase.from('users').update({ badge: newBadge }).eq('id', portalUser.id);
    if (error) {
      return interaction.reply({ embeds: [errorEmbed(`Błąd: ${error.message}`)], ephemeral: true });
    }

    const actor = await getPortalUser(interaction.user.id);

    await supabase.from('discord_events').insert({
      event_type: 'badge_change',
      channel: 'logi-kadry',
      data: {
        user: portalUser.username,
        mtaNick: portalUser.mta_nick,
        oldBadge: BADGE_LABELS[oldBadge] || oldBadge,
        newBadge: BADGE_LABELS[newBadge] || newBadge,
        isPromotion,
        by: actor?.username || interaction.user.username,
      },
    });

    const emoji = isPromotion ? '⬆️' : '⬇️';
    return interaction.reply({
      embeds: [successEmbed(`${emoji} **${portalUser.mta_nick || portalUser.username}**\n${BADGE_LABELS[oldBadge] || oldBadge} → **${BADGE_LABELS[newBadge] || newBadge}**`)],
    });
  },
};
