import { app } from "~/index";
import { requireAuth } from "../auth/require";
import { db } from "~/utils/db";
import { userCharacters } from "~/db/schema";
import { getCharacterDefinitionIdByName } from "~/utils/query-inventory-items";

export default function CharacterRoutes() {
  app.get("/api/player/characters/add", requireAuth, async (req, res) => {
    const { characterName } = req.query;
    if (!characterName)
      return res.status(400).send({
        success: false,
        message: "You need to provide an characterName query param.",
      });

    const definitionId = await getCharacterDefinitionIdByName(
      characterName as string,
    );
    if (!definitionId) {
      return res
        .status(404)
        .send({ success: false, message: "Item not found." });
    }

    try {
      await db.transaction(async (tx) => {
        // NOTE: Check if the player already owns this character
        const existing = await tx.query.userCharacters.findFirst({
          where: (t, { and, eq }) =>
            and(
              eq(t.ownerId, req.user!.userId),
              eq(t.definitionId, definitionId),
            ),
        });

        if (existing) {
          return res.status(409).send({
            success: false,
            message: "Character already owned.",
          });
        }

        await tx
          .insert(userCharacters)
          .values({
            ownerId: req.user!.userId,
            definitionId,
          })
          .onConflictDoNothing({
            target: [userCharacters.ownerId, userCharacters.definitionId],
          });
      });
      return res.status(201).send({
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: `We could not process that request. Reason: ${error}`,
      });
    }
  });
  app.get("/api/player/characters", requireAuth, async (req, res) => {
    try {
      const characters = await db.query.userCharacters.findMany({
        where: (t, { eq }) => eq(t.ownerId, req.user!.userId),
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
