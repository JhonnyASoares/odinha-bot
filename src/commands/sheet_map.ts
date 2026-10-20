import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { updateOrCreate } from "../models/sheet_map";

export const data = new SlashCommandBuilder()
  .setName("sheet_map")
  .setDescription("Abistração de celulas para ajudar no 'rpg_sets'")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Nome do comando, sera utilizado como {nome}")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("cell")
      .setDescription(
        "Planilha!Celula ex: Character!AB11 (Obs: é possivel colocar range)",
      )
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();
  try {
    if (!interaction.guildId) {
      return interaction.editReply("Esse comando só funciona em servidores.");
    }
    // Adicionar regra para registrar comando

    await updateOrCreate({
      name: interaction.options.getString("name")!,
      cell: interaction.options.getString("cell")!,
      guildId: interaction.guildId,
    });

    await interaction.editReply(
      `Atualizado mapeamento "${interaction.options.getString("name")!} = ${interaction.options.getString("cell")!}"`,
    );
  } catch (error) {
    console.error(error);
    await interaction.editReply("Erro ao acessar o banco de dados.");
  }
}
