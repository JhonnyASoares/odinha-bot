import prisma from "../prisma";
import { getOnly as getGuildRpgAttribute } from "./guild_rpg_attribute";

type UpdateOrCreateUserRpgAttributeProps = {
  userId: string;
  guildId: string;
  attributeName: string;
  value: string;
  bonus?: string;
};

export async function updateOrCreate({
  userId,
  guildId,
  attributeName,
  value,
  bonus,
}: UpdateOrCreateUserRpgAttributeProps) {
  try {
    const attribute = await getGuildRpgAttribute(attributeName, guildId);

    if (!attribute) {
      throw new Error("Atributo não encontrado neste servidor.");
    }

    return await prisma.userRpgAttribute.upsert({
      where: {
        userId_attributeId: {
          userId,
          attributeId: attribute.id,
        },
      },
      update: {
        value,
        bonus,
      },
      create: {
        userId,
        value,
        bonus,
        attributeId: attribute.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao salvar atributo do usuário.");
  }
}

export async function getAllForUser(userId: string, guildId: string) {
  try {
    return await prisma.guildRpgAttribute.findMany({
      where: {
        guildId,
      },
      include: {
        userAttributes: {
          where: {
            userId,
          },
          select: {
            value: true,
            bonus: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar atributos do usuário.");
  }
}
