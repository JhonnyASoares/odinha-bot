import prisma from "../prisma";

type UpdateOrCreateProps = {
  name: string;
  cell: string;
  guildId: string;
};

export async function updateOrCreate({
  name,
  cell,
  guildId,
}: UpdateOrCreateProps) {
  try {
    return await prisma.sheetMap.upsert({
      where: {
        name_guildId: {
          name,
          guildId,
        },
      },

      update: {
        cell,
      },

      create: {
        name,
        cell,
        guildId,
      },
    });
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao salvar mapeamento set.");
  }
}

export async function getOnly(name: string, guildId: string) {
  try {
    return await prisma.sheetMap.findUnique({
      where: {
        name_guildId: {
          name,
          guildId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar mapeamento set.");
  }
}

export async function get(guildId: string) {
  try {
    return await prisma.sheetMap.findMany({
      where: {
        guildId: guildId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar mapeamento set.");
  }
}

export async function remove(name: string, guildId: string) {
  try {
    return await prisma.sheetMap.delete({
      where: {
        name_guildId: {
          name,
          guildId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao deletar mapeamento set.");
  }
}
