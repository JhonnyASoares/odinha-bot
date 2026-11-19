import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getOrCreate as getOrCreateGuild } from "../models/guild";
import { updateOrCreate } from "../models/guild_rpg_attribute";

export const data = new SlashCommandBuilder()
  .setName("add_rpg_attribute")
  .setDescription("Cria ou atualiza um atributo de RPG do servidor.")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Nome do atributo.")
      .setMaxLength(25)
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
    if (!interaction.guildId || !interaction.guild) {
      return interaction.editReply("Esse comando só funciona em servidores.");
    }

    const name = interaction.options.getString("name", true);
    await getOrCreateGuild(interaction.guildId, interaction.guild.name);
    await updateOrCreate({
      name,
      guildId: interaction.guildId,
    });

    return interaction.editReply(`Atributo "${name}" salvo com sucesso.`);
  } catch (error) {
    console.error(error);
    return interaction.editReply("Erro ao salvar atributo do servidor.");
  }
}
