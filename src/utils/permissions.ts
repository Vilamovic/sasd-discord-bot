import { GuildMember } from 'discord.js';
import { config } from '../config';

/** CS+ role check (CS, HCS, or Dev) */
export function hasCS(member: GuildMember): boolean {
  return (
    member.roles.cache.has(config.roleCS) ||
    member.roles.cache.has(config.roleHCS) ||
    member.id === config.devDiscordId
  );
}

/** HCS+ role check (HCS or Dev) */
export function hasHCS(member: GuildMember): boolean {
  return member.roles.cache.has(config.roleHCS) || member.id === config.devDiscordId;
}

/** Dev check (hardcoded Discord ID) */
export function isDev(member: GuildMember): boolean {
  return member.id === config.devDiscordId;
}
