import { EmbedBuilder } from 'discord.js';

const actionLabels: Record<string, Record<string, string>> = {
  mdt_record: {
    create: '📝 Nowa kartoteka',
    delete: '🗑️ Usunięto kartotekę',
    add_charge: '⚖️ Nowy zarzut',
  },
  mdt_warrant: {
    issue: '🔴 Wystawiono nakaz',
    remove: '✅ Cofnięto nakaz',
  },
  mdt_bolo: {
    create: '🚗 Nowy BOLO',
    delete: '🗑️ Usunięto BOLO',
    resolve: '✅ BOLO rozwiązany',
  },
  map_marker: {
    create: '📍 Nowe oznaczenie na mapie',
    delete: '🗑️ Usunięto oznaczenie z mapy',
  },
  map_sharing: {
    create: '🔗 Udostępniono warstwę mapową',
    delete: '🔗 Usunięto udostępnienie warstwy',
  },
};

export function formatMdt(type: string, d: Record<string, any>): EmbedBuilder {
  const embed = new EmbedBuilder().setTimestamp();
  const label = actionLabels[type]?.[d.action] || `${type}:${d.action}`;

  switch (type) {
    case 'mdt_record':
      embed.setTitle(label).setColor(d.action === 'delete' ? 0xc41e1e : 0x5588cc);
      if (d.person) embed.addFields({ name: 'Osoba', value: d.person, inline: true });
      if (d.action === 'add_charge') {
        if (d.offense) embed.addFields({ name: 'Zarzut', value: d.offense, inline: false });
        if (d.code) embed.addFields({ name: 'Kod', value: d.code, inline: true });
        if (d.status) embed.addFields({ name: 'Status', value: d.status, inline: true });
        if (d.officer) embed.addFields({ name: 'Funkcjonariusz', value: d.officer, inline: true });
      }
      return embed;

    case 'mdt_warrant':
      embed
        .setTitle(label)
        .setColor(d.action === 'issue' ? 0xff0000 : 0x3a6a3a);
      if (d.person) embed.addFields({ name: 'Osoba', value: d.person, inline: true });
      if (d.type) embed.addFields({ name: 'Typ nakazu', value: d.type, inline: true });
      if (d.reason) embed.addFields({ name: 'Powód', value: d.reason, inline: false });
      if (d.officer) embed.addFields({ name: 'Funkcjonariusz', value: d.officer, inline: true });
      return embed;

    case 'mdt_bolo':
      embed.setTitle(label).setColor(d.action === 'create' ? 0xff8c00 : d.action === 'resolve' ? 0x3a6a3a : 0xc41e1e);
      if (d.plate) embed.addFields({ name: 'Tablica', value: d.plate, inline: true });
      if (d.make || d.model) embed.addFields({ name: 'Pojazd', value: `${d.make || ''} ${d.model || ''}`.trim() || '—', inline: true });
      if (d.color) embed.addFields({ name: 'Kolor', value: d.color, inline: true });
      if (d.reason) embed.addFields({ name: 'Powód', value: d.reason, inline: false });
      if (d.reportedBy) embed.addFields({ name: 'Zgłosił', value: d.reportedBy, inline: true });
      return embed;

    case 'map_marker':
      embed.setTitle(label).setColor(d.action === 'delete' ? 0xc41e1e : 0x3a6a3a);
      if (d.marker_title) embed.addFields({ name: 'Oznaczenie', value: d.marker_title, inline: true });
      if (d.marker_type) embed.addFields({ name: 'Typ', value: d.marker_type, inline: true });
      if (d.division) embed.addFields({ name: 'Dywizja', value: d.division, inline: true });
      if (d.actor_name) embed.addFields({ name: 'Wykonał', value: d.actor_name, inline: true });
      return embed;

    case 'map_sharing':
      embed.setTitle(label).setColor(d.action === 'delete' ? 0xc41e1e : 0x60a5fa);
      if (d.division_from && d.division_to) {
        embed.addFields({ name: 'Udostępnienie', value: `${d.division_from} → ${d.division_to}`, inline: false });
      }
      if (d.actor_name) embed.addFields({ name: 'Wykonał', value: d.actor_name, inline: true });
      return embed;

    default:
      return embed.setTitle(`📋 ${type}`).setColor(0x808080).setDescription(JSON.stringify(d, null, 2).slice(0, 1000));
  }
}
