import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { supabase } from '../supabase';
import { hasCS } from '../utils/permissions';
import { getPortalUser } from '../utils/userLookup';
import { successEmbed, errorEmbed } from '../utils/embeds';

export const boloDodaj = {
  data: new SlashCommandBuilder()
    .setName('bolo-dodaj')
    .setDescription('[CS+] Dodaj BOLO na pojazd')
    .addStringOption((o) => o.setName('tablica').setDescription('Numer tablicy').setRequired(true))
    .addStringOption((o) => o.setName('pojazd').setDescription('Marka/model'))
    .addStringOption((o) => o.setName('kolor').setDescription('Kolor pojazdu'))
    .addStringOption((o) => o.setName('opis').setDescription('Powód poszukiwania').setRequired(true)),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.member || !hasCS(interaction.member as any)) {
      return interaction.reply({ embeds: [errorEmbed('Brak uprawnień (wymagane CS+).')], ephemeral: true });
    }

    const plate = interaction.options.getString('tablica', true).toUpperCase();
    const vehicle = interaction.options.getString('pojazd') || '';
    const color = interaction.options.getString('kolor') || '';
    const reason = interaction.options.getString('opis', true);
    const actor = await getPortalUser(interaction.user.id);

    const { error } = await supabase.from('mdt_bolo_vehicles').insert({
      plate,
      make: vehicle,
      color,
      reason,
      status: 'ACTIVE',
      reported_by: actor?.mta_nick || interaction.user.username,
      created_by: actor?.id,
    });

    if (error) {
      return interaction.reply({ embeds: [errorEmbed(`Błąd: ${error.message}`)], ephemeral: true });
    }

    await supabase.from('discord_events').insert({
      event_type: 'mdt_bolo',
      channel: 'logi-mdt',
      data: {
        action: 'create',
        plate,
        make: vehicle,
        color,
        reason,
        reportedBy: actor?.mta_nick || interaction.user.username,
      },
    });

    return interaction.reply({
      embeds: [successEmbed(`BOLO dodany: **${plate}** ${vehicle} ${color}\n> ${reason}`)],
    });
  },
};
