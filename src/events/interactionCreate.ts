import { Interaction, Client, Collection, ChatInputCommandInteraction } from 'discord.js';

interface BotCommand {
  data: { name: string };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export async function onInteractionCreate(interaction: Interaction, client: Client) {
  if (!interaction.isChatInputCommand()) return;

  const commands = (client as any).commands as Collection<string, BotCommand>;
  const command = commands.get(interaction.commandName);

  if (!command) {
    console.warn(`⚠️ Nieznana komenda: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Błąd komendy /${interaction.commandName}:`, error);

    const reply = { content: '❌ Wystąpił błąd podczas wykonywania komendy.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
}
