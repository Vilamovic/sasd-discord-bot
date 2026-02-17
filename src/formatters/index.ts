import { EmbedBuilder } from 'discord.js';
import { formatKadry } from './kadry';
import { formatKary } from './kary';
import { formatEgzaminy } from './egzaminy';
import { formatRaporty } from './raporty';
import { formatZgloszenia } from './zgloszenia';
import { formatMdt } from './mdt';
import { formatPatchnotes } from './patchnotes';

const formatters: Record<string, (data: Record<string, any>) => EmbedBuilder | null> = {
  // Kadry
  user_register: (d) => formatKadry('user_register', d),
  badge_change: (d) => formatKadry('badge_change', d),
  division_change: (d) => formatKadry('division_change', d),
  permission_change: (d) => formatKadry('permission_change', d),
  admin_action: (d) => formatKadry('admin_action', d),

  // Kary / Nagrody
  plus_minus: (d) => formatKary('plus_minus', d),
  penalty: (d) => formatKary('penalty', d),
  written_warning: (d) => formatKary('written_warning', d),

  // Egzaminy
  exam_result: (d) => formatEgzaminy('exam_result', d),
  exam_cheat: (d) => formatEgzaminy('exam_cheat', d),
  exam_booking: (d) => formatEgzaminy('exam_booking', d),
  exam_cancel: (d) => formatEgzaminy('exam_cancel', d),
  exam_slot_delete: (d) => formatEgzaminy('exam_slot_delete', d),

  // Raporty
  division_report: (d) => formatRaporty('division_report', d),

  // Zgłoszenia
  submission_new: (d) => formatZgloszenia('submission_new', d),
  submission_status: (d) => formatZgloszenia('submission_status', d),

  // MDT
  mdt_record: (d) => formatMdt('mdt_record', d),
  mdt_warrant: (d) => formatMdt('mdt_warrant', d),
  mdt_bolo: (d) => formatMdt('mdt_bolo', d),

  // Mapa
  map_marker: (d) => formatMdt('map_marker', d),
  map_sharing: (d) => formatMdt('map_sharing', d),

  // Patchnotes
  patchnotes: (d) => formatPatchnotes('patchnotes', d),
};

export function formatEvent(eventType: string, data: Record<string, any>): EmbedBuilder | null {
  const formatter = formatters[eventType];
  if (!formatter) {
    console.warn(`⚠️ Brak formattera dla event_type: ${eventType}`);
    return null;
  }
  return formatter(data);
}
