import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { updateOrCreate } from "../models/user_rpg_attribute";

export const data = new SlashCommandBuilder()
  .setName("add_user_attribute")
  .setDescription("Cria ou atualiza um atributo para você.")
  .addStringOption((option) =>
    option
      .setName("attribute")
      .setDescription("Nome do atributo cadastrado no servidor.")
      .setMaxLength(25)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("value")
      .setDescription("Valor do atributo.")
      .setMaxLength(15)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("bonus")
      .setDescription("Bônus do atributo.")
      .setMaxLength(15),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
    if (!interaction.guildId) {
      return interaction.editReply("Esse comando só funciona em servidores.");
    }

    const attributeName = interaction.options.getString("attribute", true);
    await updateOrCreate({
      userId: interaction.user.id,
      guildId: interaction.guildId,
      attributeName,
      value: interaction.options.getString("value", true),
      bonus: interaction.options.getString("bonus") ?? undefined,
    });

    return interaction.editReply(
      `Atributo "${attributeName}" salvo para você.`,
    );
  } catch (error) {
    console.error(error);
    return interaction.editReply(
      "Erro ao salvar atributo do usuário. Verifique se o atributo existe neste servidor.",
    );
  }
}
