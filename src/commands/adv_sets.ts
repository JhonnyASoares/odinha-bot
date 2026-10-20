import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { updateOrCreate } from "../models/adv_set";

export const data = new SlashCommandBuilder()
  .setName("adv_sets")
  .setDescription(
    "Define rolagens ou magias automaticas usando planilha ou não",
  )
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Nome do comando, sera utilizado como >nome")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("operation")
      .setDescription("[+2]{T_STR}{T_MAG}{T_TEC}{T_AGI}")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("alias")
      .setDescription(
        "Define o nome que o bot falará junto a rolagem, ex: >in bot: *iniciativa* [resultado]",
      ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    if (!interaction.guildId) {
      return interaction.editReply("Esse comando só funciona em servidores.");
    }

    const alias = interaction.options.getString("alias") as string | null;

    await updateOrCreate({
      name: interaction.options.getString("name")!,
      alias: alias ?? undefined,
      operation: interaction.options.getString("operation")!,
      guildId: interaction.guildId,
    });

    await interaction.editReply(
      `Criado comando >${interaction.options.getString("name")!} ${interaction.options.getString("operation")!}`,
    );
  } catch (error) {
    console.error(error);
    await interaction.editReply("Erro ao acessar o banco de dados.");
  }
}
