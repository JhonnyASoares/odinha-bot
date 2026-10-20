import prisma from "../../prisma";

export async function getOnly(name: string, guildId: string) {
  try {
    return await prisma.vSheetSet.findFirst({
      where: {
        name: name,
        guildId: guildId,
      },
    });
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao buscar set no db.");
  }
}

export async function getAll(guildId: string) {
  try {
    return await prisma.vSheetSet.findMany({
      where: {
        guildId: guildId,
      },
    });
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao buscar sets no db.");
  }
}
