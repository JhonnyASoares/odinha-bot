import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { evaluate } from "mathjs";

export const data = new SlashCommandBuilder()
  .setName("calc")
  .setDescription("Calcula uma operação matemática.")
  .addStringOption((option) =>
    option
      .setName("operation")
      .setDescription("Operação que deseja calcular.")
      .setMaxLength(100)
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const operation = interaction.options.getString("operation", true);
    const result = evaluate(operation).toFixed(2);

    return interaction.editReply(
      `\`${operation}\` = **${result}**`,
    );
  } catch (error) {
    console.error(error);
    return interaction.editReply(
      "❌ Não foi possível calcular essa operação. Confira a expressão e tente novamente.",
    );
  }
}
