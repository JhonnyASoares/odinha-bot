import prisma from "../prisma";

type UpdateOrCreateProps = {
  name: string;
  operation: string;
  alias?: string;
  guildId: string;
};

export async function updateOrCreate({
  name,
  operation,
  alias,
  guildId,
}: UpdateOrCreateProps) {
  try {
    return await prisma.advancedSheetSet.upsert({
      where: {
        name_guildId: {
          name,
          guildId,
        },
      },

      update: {
        alias,
        operation,
      },

      create: {
        name,
        operation,
        alias,
        guildId,
      },
    });
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao salvar sheet set.");
  }
}

export async function getOnly(name: string, guildId: string) {
  try {
    return await prisma.advancedSheetSet.findUnique({
      where: {
        name_guildId: {
          name,
          guildId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar sheet set.");
  }
}

export async function get(guildId: string) {
  try {
    return await prisma.advancedSheetSet.findMany({
      where: {
        guildId: guildId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar sheet set.");
  }
}

export async function remove(name: string, guildId: string) {
  try {
    return await prisma.advancedSheetSet.delete({
      where: {
        name_guildId: {
          name,
          guildId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao deletar sheet set.");
  }
}
