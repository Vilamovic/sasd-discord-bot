import { EmbedBuilder } from 'discord.js';

export function formatKadry(type: string, d: Record<string, any>): EmbedBuilder {
  const embed = new EmbedBuilder().setTimestamp();

  switch (type) {
    case 'user_register':
      return embed
        .setTitle('👤 Nowy użytkownik')
        .setColor(0x3a6a3a)
        .addFields(
          { name: 'Username', value: d.username || '—', inline: true },
          { name: 'MTA Nick', value: d.mtaNick || '—', inline: true },
        );

    case 'badge_change':
      return embed
        .setTitle(d.isPromotion ? '⬆️ Awans' : '⬇️ Degradacja')
        .setColor(d.isPromotion ? 0x3a6a3a : 0xc41e1e)
        .addFields(
          { name: 'Użytkownik', value: `${d.user} (${d.mtaNick || '—'})`, inline: false },
          { name: 'Poprzedni', value: d.oldBadge || '—', inline: true },
          { name: 'Nowy', value: d.newBadge || '—', inline: true },
          { name: 'Przez', value: d.by || '—', inline: true },
        );

    case 'division_change':
      return embed
        .setTitle(d.action === 'grant' ? '🏷️ Nadanie dywizji' : '🏷️ Usunięcie dywizji')
        .setColor(d.action === 'grant' ? 0x60a5fa : 0xff8c00)
        .addFields(
          { name: 'Użytkownik', value: `${d.user} (${d.mtaNick || '—'})`, inline: false },
          { name: 'Dywizja', value: d.division || '—', inline: true },
          { name: 'Przez', value: d.by || '—', inline: true },
        );

    case 'permission_change':
      return embed
        .setTitle(d.action === 'grant' ? '🔑 Nadanie uprawnienia' : '🔑 Usunięcie uprawnienia')
        .setColor(d.action === 'grant' ? 0x3a6a3a : 0xc41e1e)
        .addFields(
          { name: 'Użytkownik', value: `${d.user} (${d.mtaNick || '—'})`, inline: false },
          { name: 'Uprawnienie', value: d.permission || '—', inline: true },
          { name: 'Przez', value: d.by || '—', inline: true },
        );

    case 'admin_action':
      return embed
        .setTitle('⚙️ Akcja administracyjna')
        .setColor(0x5588cc)
        .addFields(
          { name: 'Akcja', value: d.action || '—', inline: false },
          { name: 'Wykonał', value: d.actor || '—', inline: true },
          { name: 'Cel', value: d.target || '—', inline: true },
        );

    default:
      return embed.setTitle(`📋 ${type}`).setColor(0x808080).setDescription(JSON.stringify(d, null, 2).slice(0, 1000));
  }
}
