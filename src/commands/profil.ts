import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { getPortalUser, getPortalUserByNick } from '../utils/userLookup';
import { sasdEmbed, errorEmbed, BADGE_LABELS } from '../utils/embeds';

export const profil = {
  data: new SlashCommandBuilder()
    .setName('profil')
    .setDescription('Pokaż profil użytkownika')
    .addUserOption((o) => o.setName('user').setDescription('Użytkownik Discord'))
    .addStringOption((o) => o.setName('nick').setDescription('MTA Nick')),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('user');
    const nick = interaction.options.getString('nick');

    let user;
    if (targetUser) {
      user = await getPortalUser(targetUser.id);
    } else if (nick) {
      user = await getPortalUserByNick(nick);
    } else {
      user = await getPortalUser(interaction.user.id);
    }

    if (!user) {
      return interaction.reply({ embeds: [errorEmbed('Nie znaleziono użytkownika w portalu.')], ephemeral: true });
    }

    const embed = sasdEmbed()
      .setTitle(`👤 ${user.mta_nick || user.username}`)
      .addFields(
        { name: 'Username', value: user.username || '—', inline: true },
        { name: 'MTA Nick', value: user.mta_nick || '—', inline: true },
        { name: 'Stopień', value: BADGE_LABELS[user.badge] || user.badge || '—', inline: true },
        { name: 'Rola', value: user.role?.toUpperCase() || '—', inline: true },
        { name: 'Dywizja', value: user.division || 'Brak', inline: true },
        { name: '+/-', value: `+${user.plus_count || 0} / -${user.minus_count || 0}`, inline: true },
      );

    if (user.permissions?.length > 0) {
      embed.addFields({ name: 'Uprawnienia', value: user.permissions.join(', '), inline: false });
    }

    if (user.avatar_url) {
      embed.setThumbnail(user.avatar_url);
    }

    return interaction.reply({ embeds: [embed] });
  },
};
