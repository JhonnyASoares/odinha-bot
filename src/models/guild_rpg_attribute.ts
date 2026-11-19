import prisma from "../prisma";

type UpdateOrCreateGuildRpgAttributeProps = {
  name: string;
  guildId: string;
};

export async function updateOrCreate({
  name,
  guildId,
}: UpdateOrCreateGuildRpgAttributeProps) {
  try {
    return await prisma.guildRpgAttribute.upsert({
      where: {
        name_guildId: {
          name,
          guildId,
        },
      },
      update: {},
      create: {
        name,
        guildId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao salvar atributo do servidor.");
  }
}

export async function getOnly(name: string, guildId: string) {
  try {
    return await prisma.guildRpgAttribute.findUnique({
      where: {
        name_guildId: {
          name,
          guildId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar atributo do servidor.");
  }
}
