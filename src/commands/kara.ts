import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { supabase } from '../supabase';
import { hasCS } from '../utils/permissions';
import { getPortalUser } from '../utils/userLookup';
import { successEmbed, errorEmbed } from '../utils/embeds';

const PENALTY_TYPES = [
  { name: 'Zawieszenie frakcyjne', value: 'zawieszenie_sluzba' },
  { name: 'Zawieszenie dywizyjne', value: 'zawieszenie_dywizja' },
  { name: 'Zawieszenie uprawnieniowe', value: 'zawieszenie_uprawnienia' },
  { name: 'Zawieszenie pościgowe', value: 'zawieszenie_poscigowe' },
  { name: 'Upomnienie pisemne', value: 'upomnienie_pisemne' },
];

export const kara = {
  data: new SlashCommandBuilder()
    .setName('kara')
    .setDescription('[CS+] Nadaj karę użytkownikowi')
    .addUserOption((o) => o.setName('user').setDescription('Użytkownik').setRequired(true))
    .addStringOption((o) =>
      o.setName('typ').setDescription('Typ kary').setRequired(true)
        .addChoices(...PENALTY_TYPES)
    )
    .addStringOption((o) => o.setName('powod').setDescription('Powód').setRequired(true))
    .addIntegerOption((o) => o.setName('godziny').setDescription('Czas trwania (h) — nie dotyczy upomnienia')),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.member || !hasCS(interaction.member as any)) {
      return interaction.reply({ embeds: [errorEmbed('Brak uprawnień (wymagane CS+).')], ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user', true);
    const penaltyType = interaction.options.getString('typ', true);
    const reason = interaction.options.getString('powod', true);
    const hours = interaction.options.getInteger('godziny');
    const portalUser = await getPortalUser(targetUser.id);

    if (!portalUser) {
      return interaction.reply({ embeds: [errorEmbed('Użytkownik nie znaleziony w portalu.')], ephemeral: true });
    }

    const actor = await getPortalUser(interaction.user.id);
    const isWrittenWarning = penaltyType === 'upomnienie_pisemne';

    const penaltyData: any = {
      user_id: portalUser.id,
      created_by: actor?.id || portalUser.id,
      type: penaltyType,
      description: reason,
    };

    if (!isWrittenWarning && hours && hours > 0) {
      penaltyData.duration_hours = hours;
      penaltyData.expires_at = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    }

    const { error } = await supabase.from('user_penalties').insert(penaltyData);
    if (error) {
      return interaction.reply({ embeds: [errorEmbed(`Błąd: ${error.message}`)], ephemeral: true });
    }

    const eventType = isWrittenWarning ? 'written_warning' : 'penalty';
    await supabase.from('discord_events').insert({
      event_type: eventType,
      channel: 'logi-kary-nagrody',
      data: {
        type: penaltyType,
        user: portalUser.username,
        mtaNick: portalUser.mta_nick,
        description: reason,
        durationHours: hours,
        by: actor?.username || interaction.user.username,
      },
    });

    const typeLabel = PENALTY_TYPES.find((t) => t.value === penaltyType)?.name || penaltyType;
    return interaction.reply({
      embeds: [successEmbed(`Nadano **${typeLabel}** dla **${portalUser.mta_nick || portalUser.username}**${hours ? ` (${hours}h)` : ''}\nPowód: ${reason}`)],
    });
  },
};
