import prisma from "../prisma";

type UpdateOrCreateSpellProps = {
  command: string;
  alias: string;
  effect?: string;
  form: string;
  extra?: string;
  guildId: string;
};

export async function updateOrCreate({
  command,
  alias,
  effect,
  form,
  extra,
  guildId,
}: UpdateOrCreateSpellProps) {
  try {
    return await prisma.spell.upsert({
      where: {
        command_guildId: {
          command,
          guildId,
        },
      },
      update: {
        alias,
        effect,
        form,
        extra,
      },
      create: {
        command,
        alias,
        effect,
        form,
        extra,
        guildId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao salvar magia.");
  }
}
