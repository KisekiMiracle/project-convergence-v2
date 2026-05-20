import { app } from "~/index";
import { requireAuth } from "../auth/require";
import { db } from "~/utils/db";
import { characterDefinitions, userCharacters } from "~/db/schema";
import { sql, eq } from "drizzle-orm";

export default function CharacterRoutes() {
  app.get("/api/player/characters/add", requireAuth, async (req, res) => {
    const { characterName } = req.query;
    if (!characterName)
      return res.status(400).send({
        success: false,
        message: "You need to provide a characterName query param.",
      });

    try {
      const [firstName, lastName] = (characterName as string).split(" ");

      const nameCondition = (t: any, { and, eq }: any) => {
        return lastName
          ? and(eq(t.name, firstName), eq(t.lastName, lastName))
          : eq(t.name, firstName);
      };

      const baseCharacter = await db.query.characterDefinitions.findFirst({
        where: (t, RecordAPI) => nameCondition(t, RecordAPI),
      });
      if (!baseCharacter) {
        return res
          .status(404)
          .send({ success: false, message: "Character blueprint not found." });
      }

      await db.transaction(async (tx) => {
        const existing = await tx.query.userCharacters.findFirst({
          where: (t, { and, eq }) =>
            and(
              eq(t.ownerId, req.user!.userId),
              eq(t.definitionId, baseCharacter.id),
            ),
        });

        if (existing) {
          throw new Error("ALREADY_OWNED");
        }

        const { id, createdAt, lastOnline, ...mutableStats } = baseCharacter;

        await tx
          .insert(userCharacters)
          .values({
            ownerId: req.user!.userId,
            definitionId: baseCharacter.id,
            metadata: {
              ...mutableStats, // Spreads currentHp, level, experience, skills, etc.
            },
          })
          .onConflictDoNothing({
            target: [userCharacters.ownerId, userCharacters.definitionId],
          });
      });

      return res.status(201).send({ success: true });
    } catch (error: any) {
      if (error.message === "ALREADY_OWNED") {
        return res.status(409).send({
          success: false,
          message: "Character already owned.",
        });
      }

      return res.status(500).send({
        success: false,
        message: `We could not process that request. Reason: ${error.message || error}`,
      });
    }
  });
  app.get("/api/player/characters", requireAuth, async (req, res) => {
    try {
      const characters = await db.transaction(async (tx) => {
        return await tx
          .select({
            id: userCharacters.id,
            firstMetAt: userCharacters.firstMetAt,
            equipSlot1: userCharacters.equipSlot1,
            equipSlot2: userCharacters.equipSlot2,
            equipSlot3: userCharacters.equipSlot3,
            equipSlot4: userCharacters.equipSlot4,
            equipSlot5: userCharacters.equipSlot5,
            equipSlot6: userCharacters.equipSlot6,

            // Bio data stays anchored to global definitions
            biography: {
              name: characterDefinitions.name,
              lastName: characterDefinitions.lastName,
              gender: characterDefinitions.gender,
              height: characterDefinitions.height,
            },

            // All real-time attributes now point to the player's unique metadata snapshot
            stats: userCharacters.metadata,
          })
          .from(userCharacters)
          .innerJoin(
            characterDefinitions,
            eq(userCharacters.definitionId, characterDefinitions.id),
          )
          .where(eq(userCharacters.ownerId, req.user!.userId));
      });
      return res.status(200).send({
        success: true,
        characters,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: `We could not process that request. Reason: ${error}`,
      });
    }
  });
}
