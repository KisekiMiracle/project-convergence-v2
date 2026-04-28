import { Ashe, Luciana } from "~/data/game/Characters";
import { characterDefinitions, itemDefinitions } from "~/db/schema";
import { app } from "~/index";
import { db } from "~/utils/db";
import { getItemDefinitionIdByName } from "~/utils/query-inventory-items";

export default function DBItemSeed() {
  app.get("/api/db/seed", async (_req, res) => {
    try {
      // await seedItems();
      await seedCharacters();

      return res.status(201).send({
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        error,
      });
    }
  });
}

export async function seedItems() {
  await db.insert(itemDefinitions).values([
    {
      id: crypto.randomUUID(),
      name: "Tome of Healing Alchemy Vol. II",
      description:
        "The second volume of the successful series written by Beryl—with no last name.",
      effect: "0",
      scope: "none",
      message: "none",
      category: "weapon",
    },
  ]);
}

export async function seedCharacters() {
  await db.insert(characterDefinitions).values([
    {
      id: crypto.randomUUID(),
      name: Luciana.name,
      lastName: Luciana.lastName,
      gender: Luciana.gender.toLocaleLowerCase(),
      height: Luciana.height,
      level: Luciana.level,
      experience: Luciana.exp,
      experienceToLvlUp: Luciana.expToLevelUp,
      currentHp: Luciana.hp,
      maxHp: Luciana.maxHp,
      currentMp: Luciana.mp,
      maxMp: Luciana.maxMp,
      physicalDamage: Luciana.physDmg,
      magicalDamage: Luciana.magDmg,
      armor: Luciana.armor,
      magicalArmor: Luciana.magArmor,
      finesse: Luciana.finesse,
      dexterity: Luciana.dexterity,
      weapon: await getItemDefinitionIdByName("Fermata"),
    },
    {
      id: crypto.randomUUID(),
      name: Ashe.name,
      lastName: Ashe.lastName,
      gender: Ashe.gender.toLocaleLowerCase(),
      height: Ashe.height,
      level: Ashe.level,
      experience: Ashe.exp,
      experienceToLvlUp: Ashe.expToLevelUp,
      currentHp: Ashe.hp,
      maxHp: Ashe.maxHp,
      currentMp: Ashe.mp,
      maxMp: Ashe.maxMp,
      physicalDamage: Ashe.physDmg,
      magicalDamage: Ashe.magDmg,
      armor: Ashe.armor,
      magicalArmor: Ashe.magArmor,
      finesse: Ashe.finesse,
      dexterity: Ashe.dexterity,
      weapon: await getItemDefinitionIdByName(
        "Tome of Healing Alchemy Vol. II",
      ),
    },
  ]);
}
