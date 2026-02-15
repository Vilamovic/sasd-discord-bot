import { profil } from './profil';
import { balance } from './balance';
import { egzaminy } from './egzaminy';
import { bolo } from './bolo';
import { kartoteka } from './kartoteka';
import { stats } from './stats';
import { plus } from './plus';
import { minus } from './minus';
import { awans } from './awans';
import { kara } from './kara';
import { boloDodaj } from './boloDodaj';
import { dywizja } from './dywizja';
import { uprawnienie } from './uprawnienie';
import { forceLogout } from './forceLogout';

export function loadCommands() {
  return [
    profil, balance, egzaminy, bolo, kartoteka, stats,
    plus, minus, awans, kara, boloDodaj,
    dywizja, uprawnienie, forceLogout,
  ];
}
