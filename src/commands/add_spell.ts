import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { updateOrCreate } from "../models/spell";
import { getOrCreate as getOrCreateGuild } from "../models/guild";

export const data = new SlashCommandBuilder()
  .setName("add_spell")
  .setDescription("Cria ou atualiza uma magia do servidor.")
  .addStringOption((option) =>
    option
      .setName("command")
      .setDescription("Nome do comando da magia.")
      .setMaxLength(25)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("alias")
      .setDescription("Nome exibido para a magia.")
      .setMaxLength(50)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("form")
      .setDescription("Forma ou instrução da magia.")
      .setMaxLength(100)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("effect")
      .setDescription("Efeito da magia.")
      .setMaxLength(50),
  )
  .addStringOption((option) =>
    option
      .setName("extra")
      .setDescription("Informação adicional.")
      .setMaxLength(50),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
    if (!interaction.guildId || !interaction.guild) {
      return interaction.editReply("Esse comando só funciona em servidores.");
    }

    const command = interaction.options.getString("command", true);
    await getOrCreateGuild(interaction.guildId, interaction.guild.name);
    await updateOrCreate({
      command,
      alias: interaction.options.getString("alias", true),
      form: interaction.options.getString("form", true),
      effect: interaction.options.getString("effect") ?? undefined,
      extra: interaction.options.getString("extra") ?? undefined,
      guildId: interaction.guildId,
    });

    return interaction.editReply(`Magia "${command}" salva com sucesso.`);
  } catch (error) {
    console.error(error);
    return interaction.editReply("Erro ao salvar magia.");
  }
}
