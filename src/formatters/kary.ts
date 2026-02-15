import { EmbedBuilder } from 'discord.js';

export function formatKary(type: string, d: Record<string, any>): EmbedBuilder {
  const embed = new EmbedBuilder().setTimestamp();

  switch (type) {
    case 'plus_minus':
      const isPlus = d.type === 'plus';
      return embed
        .setTitle(isPlus ? '➕ Plus' : '➖ Minus')
        .setColor(isPlus ? 0x3a6a3a : 0xc41e1e)
        .addFields(
          { name: 'Użytkownik', value: `${d.user} (${d.mtaNick || '—'})`, inline: false },
          { name: 'Powód', value: d.description || '—', inline: false },
          { name: 'Przez', value: d.by || '—', inline: true },
        );

    case 'penalty':
      const penaltyLabels: Record<string, string> = {
        zawieszenie_sluzba: 'Zawieszenie frakcyjne',
        zawieszenie_dywizja: 'Zawieszenie dywizyjne',
        zawieszenie_uprawnienia: 'Zawieszenie uprawnieniowe',
        zawieszenie_poscigowe: 'Zawieszenie pościgowe',
      };
      return embed
        .setTitle('🚫 Kara — Zawieszenie')
        .setColor(0xc41e1e)
        .addFields(
          { name: 'Typ', value: penaltyLabels[d.type] || d.type, inline: true },
          { name: 'Czas', value: d.durationHours ? `${d.durationHours}h` : '—', inline: true },
          { name: 'Użytkownik', value: `${d.user} (${d.mtaNick || '—'})`, inline: false },
          { name: 'Powód', value: d.description || '—', inline: false },
          { name: 'Przez', value: d.by || '—', inline: true },
        )
        .setDescription(d.evidenceLink ? `[Link do dowodów](${d.evidenceLink})` : '');

    case 'written_warning':
      return embed
        .setTitle('📝 Upomnienie pisemne')
        .setColor(0xff8c00)
        .addFields(
          { name: 'Użytkownik', value: `${d.user} (${d.mtaNick || '—'})`, inline: false },
          { name: 'Powód', value: d.description || '—', inline: false },
          { name: 'Przez', value: d.by || '—', inline: true },
        )
        .setDescription(d.evidenceLink ? `[Link do dowodów](${d.evidenceLink})` : '');

    default:
      return embed.setTitle(`📋 ${type}`).setColor(0x808080).setDescription(JSON.stringify(d, null, 2).slice(0, 1000));
  }
}
