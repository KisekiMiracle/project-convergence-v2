import { eq } from "drizzle-orm";
import { characterDefinitions, itemDefinitions } from "~/db/schema";
import { db } from "./db";

export async function getItemDefinitionIdByName(
  name: string,
): Promise<string | null> {
  const result = await db
    .select({ id: itemDefinitions.id })
    .from(itemDefinitions)
    .where(eq(itemDefinitions.name, name))
    .limit(1);

  return result.length > 0 ? result[0]!.id : null;
}

export async function getCharacterDefinitionIdByName(
  name: string,
): Promise<string | null> {
  const result = await db
    .select({ id: characterDefinitions.id })
    .from(characterDefinitions)
    .where(eq(characterDefinitions.name, name))
    .limit(1);

  return result.length > 0 ? result[0]!.id : null;
}
