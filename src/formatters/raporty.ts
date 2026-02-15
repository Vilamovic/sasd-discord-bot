import { EmbedBuilder } from 'discord.js';

const divisionColors: Record<string, number> = {
  DTU: 0x60a5fa,
  GU: 0x059669,
  SWAT: 0xc41e1e,
  SS: 0xff8c00,
};

export function formatRaporty(type: string, d: Record<string, any>): EmbedBuilder {
  const embed = new EmbedBuilder().setTimestamp();

  switch (type) {
    case 'division_report':
      return embed
        .setTitle(`📋 Raport — ${d.division}`)
        .setColor(divisionColors[d.division] || 0x808080)
        .addFields(
          { name: 'Typ', value: d.reportType || '—', inline: true },
          { name: 'Autor', value: d.author || '—', inline: true },
          { name: 'Data', value: d.date || '—', inline: true },
          { name: 'Godzina', value: d.time || '—', inline: true },
          { name: 'Lokalizacja', value: d.location || '—', inline: true },
          { name: 'Uczestnicy', value: d.participants?.join(', ') || '—', inline: false },
        );

    default:
      return embed.setTitle(`📋 ${type}`).setColor(0x808080).setDescription(JSON.stringify(d, null, 2).slice(0, 1000));
  }
}
