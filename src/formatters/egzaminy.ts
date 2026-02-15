import { EmbedBuilder } from 'discord.js';

export function formatEgzaminy(type: string, d: Record<string, any>): EmbedBuilder {
  const embed = new EmbedBuilder().setTimestamp();

  switch (type) {
    case 'exam_result':
      return embed
        .setTitle(d.passed ? '✅ Egzamin zdany' : '❌ Egzamin niezdany')
        .setColor(d.passed ? 0x3a6a3a : 0xc41e1e)
        .addFields(
          { name: 'Zdający', value: d.username || '—', inline: true },
          { name: 'Typ', value: d.examType || '—', inline: true },
          { name: 'Wynik', value: `${d.score}/${d.total} (${d.percentage}%)`, inline: true },
          { name: 'Próg', value: `${d.passingThreshold}%`, inline: true },
        );

    case 'exam_cheat':
      return embed
        .setTitle('🚨 OSZUSTWO NA EGZAMINIE')
        .setColor(0xff0000)
        .addFields(
          { name: 'Użytkownik', value: `${d.username} (${d.mtaNick || '—'})`, inline: false },
          { name: 'Typ egzaminu', value: d.examType || '—', inline: true },
          { name: 'Typ oszustwa', value: d.cheatType === 'tab_switch' ? 'Przełączenie karty' : 'Utrata focusu okna', inline: true },
          { name: 'Email', value: d.email || '—', inline: true },
        );

    case 'exam_booking':
      return embed
        .setTitle('📅 Rezerwacja egzaminu')
        .setColor(0x5588cc)
        .addFields(
          { name: 'Zdający', value: `${d.booker} (${d.bookerNick || '—'})`, inline: false },
          { name: 'Typ', value: d.examType || '—', inline: true },
          { name: 'Data', value: d.date || '—', inline: true },
          { name: 'Godzina', value: d.time || '—', inline: true },
          { name: 'Egzaminator', value: d.creator || '—', inline: true },
        );

    case 'exam_cancel':
      return embed
        .setTitle('❌ Anulowanie rezerwacji')
        .setColor(0xff8c00)
        .addFields(
          { name: 'Zdający', value: `${d.booker} (${d.bookerNick || '—'})`, inline: false },
          { name: 'Typ', value: d.examType || '—', inline: true },
          { name: 'Data', value: d.date || '—', inline: true },
        );

    case 'exam_slot_delete':
      return embed
        .setTitle('🗑️ Usunięcie slotu')
        .setColor(0xc41e1e)
        .addFields(
          { name: 'Typ', value: d.examType || '—', inline: true },
          { name: 'Data', value: d.date || '—', inline: true },
          { name: 'Usunął', value: d.deletedBy || '—', inline: true },
        );

    default:
      return embed.setTitle(`📋 ${type}`).setColor(0x808080).setDescription(JSON.stringify(d, null, 2).slice(0, 1000));
  }
}
