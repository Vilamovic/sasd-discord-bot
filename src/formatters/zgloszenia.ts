import { EmbedBuilder } from 'discord.js';

const typeLabels: Record<string, string> = {
  bug: '🐛 Błąd',
  idea: '💡 Pomysł',
  vacation: '🏖️ Urlop',
  excuse: '📄 Usprawiedliwienie',
  division_application: '🛡️ Podanie do dywizji',
  plus_exchange: '🔄 Wymiana plusów',
};

export function formatZgloszenia(type: string, d: Record<string, any>): EmbedBuilder {
  const embed = new EmbedBuilder().setTimestamp();

  switch (type) {
    case 'submission_new':
      return embed
        .setTitle(`📩 Nowe zgłoszenie — ${typeLabels[d.type] || d.type}`)
        .setColor(0x5588cc)
        .addFields(
          { name: 'Od', value: d.user || '—', inline: true },
          { name: 'Tytuł', value: d.title || '—', inline: false },
        );

    case 'submission_status':
      const statusColors: Record<string, number> = {
        approved: 0x3a6a3a,
        rejected: 0xc41e1e,
        archived: 0x808080,
      };
      const statusLabels: Record<string, string> = {
        approved: '✅ Zatwierdzony',
        rejected: '❌ Odrzucony',
        archived: '📦 Zarchiwizowany',
      };
      return embed
        .setTitle(`📋 Zmiana statusu zgłoszenia`)
        .setColor(statusColors[d.newStatus] || 0x808080)
        .addFields(
          { name: 'Zgłoszenie', value: d.title || '—', inline: false },
          { name: 'Status', value: statusLabels[d.newStatus] || d.newStatus, inline: true },
          { name: 'Przez', value: d.by || '—', inline: true },
        )
        .setDescription(d.adminNote ? `**Notatka:** ${d.adminNote}` : '');

    default:
      return embed.setTitle(`📋 ${type}`).setColor(0x808080).setDescription(JSON.stringify(d, null, 2).slice(0, 1000));
  }
}
