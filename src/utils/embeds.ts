import { EmbedBuilder } from 'discord.js';

/** Standard embed with SASD branding */
export function sasdEmbed() {
  return new EmbedBuilder()
    .setColor(0x2d5a2d)
    .setFooter({ text: 'SASD Portal Bot' })
    .setTimestamp();
}

/** Error embed */
export function errorEmbed(message: string) {
  return new EmbedBuilder()
    .setColor(0xc41e1e)
    .setTitle('❌ Błąd')
    .setDescription(message)
    .setTimestamp();
}

/** Success embed */
export function successEmbed(message: string) {
  return new EmbedBuilder()
    .setColor(0x3a6a3a)
    .setTitle('✅ Sukces')
    .setDescription(message)
    .setTimestamp();
}

/** Badge/rank labels */
export const BADGE_LABELS: Record<string, string> = {
  trainee: 'Trainee',
  deputy_i: 'Deputy I',
  deputy_ii: 'Deputy II',
  deputy_iii: 'Deputy III',
  senior_deputy_i: 'Senior Deputy I',
  senior_deputy_ii: 'Senior Deputy II',
  senior_deputy_iii: 'Senior Deputy III',
  corporal: 'Corporal',
  sergeant_i: 'Sergeant I',
  sergeant_ii: 'Sergeant II',
  sergeant_iii: 'Sergeant III',
  lieutenant: 'Lieutenant',
  captain_i: 'Captain I',
  captain_ii: 'Captain II',
  captain_iii: 'Captain III (Commander)',
  assistant_sheriff: 'Assistant Sheriff',
  undersheriff: 'Undersheriff',
  sheriff: 'Sheriff',
};
