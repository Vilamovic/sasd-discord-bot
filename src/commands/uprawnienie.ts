import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { supabase } from '../supabase';
import { hasHCS } from '../utils/permissions';
import { getPortalUser } from '../utils/userLookup';
import { successEmbed, errorEmbed } from '../utils/embeds';

const PERMISSIONS = ['SWAT', 'SEU', 'AIR', 'Press Desk', 'Dispatch', 'Pościgowe'];

export const uprawnienie = {
  data: new SlashCommandBuilder()
    .setName('uprawnienie')
    .setDescription('[HCS+] Nadaj/usuń uprawnienie użytkownikowi')
    .addUserOption((o) => o.setName('user').setDescription('Użytkownik').setRequired(true))
    .addStringOption((o) =>
      o.setName('uprawnienie').setDescription('Uprawnienie').setRequired(true)
        .addChoices(...PERMISSIONS.map((p) => ({ name: p, value: p })))
    )
    .addStringOption((o) =>
      o.setName('akcja').setDescription('Nadaj lub usuń').setRequired(true)
        .addChoices({ name: 'Nadaj', value: 'grant' }, { name: 'Usuń', value: 'revoke' })
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.member || !hasHCS(interaction.member as any)) {
      return interaction.reply({ embeds: [errorEmbed('Brak uprawnień (wymagane HCS+).')], ephemeral: true });
    }

    const targetUser = interaction.options.getUser('user', true);
    const permission = interaction.options.getString('uprawnienie', true);
    const action = interaction.options.getString('akcja', true);
    const portalUser = await getPortalUser(targetUser.id);

    if (!portalUser) {
      return interaction.reply({ embeds: [errorEmbed('Użytkownik nie znaleziony w portalu.')], ephemeral: true });
    }

    const currentPerms: string[] = portalUser.permissions || [];
    let newPerms: string[];

    if (action === 'grant') {
      if (currentPerms.includes(permission)) {
        return interaction.reply({ embeds: [errorEmbed(`Użytkownik już ma uprawnienie ${permission}.`)], ephemeral: true });
      }
      newPerms = [...currentPerms, permission];
    } else {
      if (!currentPerms.includes(permission)) {
        return interaction.reply({ embeds: [errorEmbed(`Użytkownik nie ma uprawnienia ${permission}.`)], ephemeral: true });
      }
      newPerms = currentPerms.filter((p) => p !== permission);
    }

    const { error } = await supabase.from('users').update({ permissions: newPerms }).eq('id', portalUser.id);
    if (error) {
      return interaction.reply({ embeds: [errorEmbed(`Błąd: ${error.message}`)], ephemeral: true });
    }

    const actor = await getPortalUser(interaction.user.id);

    await supabase.from('discord_events').insert({
      event_type: 'permission_change',
      channel: 'logi-kadry',
      data: {
        action,
        user: portalUser.username,
        mtaNick: portalUser.mta_nick,
        permission,
        by: actor?.username || interaction.user.username,
      },
    });

    const emoji = action === 'grant' ? '🔑' : '🔒';
    const verb = action === 'grant' ? 'Nadano' : 'Usunięto';
    return interaction.reply({
      embeds: [successEmbed(`${emoji} ${verb} uprawnienie **${permission}** dla **${portalUser.mta_nick || portalUser.username}**`)],
    });
  },
};
