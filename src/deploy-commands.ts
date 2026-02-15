import { REST, Routes } from 'discord.js';
import { config } from './config';
import { loadCommands } from './commands';

async function deploy() {
  const commands = loadCommands();
  const commandData = commands.map((c) => c.data.toJSON());

  const rest = new REST().setToken(config.token);

  console.log(`📡 Rejestracja ${commandData.length} komend...`);

  await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
    body: commandData,
  });

  console.log('✅ Komendy zarejestrowane!');
}

deploy().catch(console.error);
