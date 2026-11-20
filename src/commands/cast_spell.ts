import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { evaluate } from "mathjs";
import { getOnly as getSpell } from "../models/spell";
import { getAllForUser } from "../models/user_rpg_attribute";
import { handleSpellRoll } from "../services/dice.service";

export const data = new SlashCommandBuilder()
  .setName("cast_spell")
  .setDescription("Rola uma magia cadastrada neste servidor.")
  .addStringOption((option) =>
    option
      .setName("spell")
      .setDescription("Comando da magia cadastrada.")
      .setMaxLength(25)
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("extension")
      .setDescription("Complemento matemático, por exemplo: + 10, * 1.5 ou / 2.")
      .setMaxLength(50),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    if (!interaction.guildId) {
      return interaction.editReply("Esse comando só funciona em servidores.");
    }

    const command = interaction.options.getString("spell", true);
    const extension = interaction.options.getString("extension")?.trim() ?? "";

    if (extension && !isValidExtension(extension)) {
      return interaction.editReply(
        "Extensão inválida. Use apenas operações matemáticas, como + 10, * 1.5 ou / 2.",
      );
    }

    const spell = await getSpell(command, interaction.guildId);

    if (!spell) {
      return interaction.editReply(`Magia "${command}" não encontrada.`);
    }

    const attributes = await getAllForUser(
      interaction.user.id,
      interaction.guildId,
    );
    let form = spell.form;
    let extra = spell.extra ?? "";

    for (const attribute of attributes) {
      const attributePattern = escapeRegExp(attribute.name);
      const pattern = new RegExp(
        `(?<![\\p{L}\\p{N}_])(?:\\{${attributePattern}\\}|${attributePattern})(?=d\\d|[^\\p{L}\\p{N}_]|$)`,
        "giu",
      );

      const hasAttributeInForm = pattern.test(form);
      pattern.lastIndex = 0;
      const hasAttributeInExtra = pattern.test(extra);
      pattern.lastIndex = 0;

      if (!hasAttributeInForm && !hasAttributeInExtra) {
        continue;
      }

      const userAttribute = attribute.userAttributes[0];
      if (!userAttribute) {
        return interaction.editReply(
          `Configure seu atributo "${attribute.name}" antes de usar esta magia com /add_user_attribute.`,
        );
      }

      const value = Number(userAttribute.value);
      const bonus = Number(userAttribute.bonus ?? 0);
      if (!Number.isFinite(value) || !Number.isFinite(bonus)) {
        return interaction.editReply(
          `O valor ou bônus do atributo "${attribute.name}" não é numérico.`,
        );
      }

      form = form.replace(pattern, String(value + bonus));
      extra = extra.replace(pattern, String(value + bonus));
    }

    if (extension) {
      form = `(${form}) ${extension}`;
    }

    if (extra) {
      form = `(${form}) + (${extra})`;
    }

    return interaction.editReply(
      handleSpellRoll(spell.alias, spell.effect, form),
    );
  } catch (error) {
    console.error(error);
    return interaction.editReply("Erro ao conjurar magia.");
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isValidExtension(extension: string) {
  if (!/^[+\-*/][\d+\-*/().\s]*$/.test(extension)) {
    return false;
  }

  try {
    return Number.isFinite(evaluate(`1 ${extension}`));
  } catch {
    return false;
  }
}
