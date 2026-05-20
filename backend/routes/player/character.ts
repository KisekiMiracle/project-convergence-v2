import { userCharacters } from "~/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { app } from "~/index";
import { requireAuth } from "../auth/require";
import { db } from "~/utils/db";

app.post(
  "/api/player/characters/update-stats",
  requireAuth,
  async (req, res) => {
    try {
      const { characterInstanceId, statsToUpdate } = req.body;

      // Validation
      if (
        !characterInstanceId ||
        !statsToUpdate ||
        typeof statsToUpdate !== "object"
      ) {
        return res.status(400).send({
          success: false,
          message:
            "Invalid payload. Provide characterInstanceId and a statsToUpdate object.",
        });
      }

      const updatedRows = await db.transaction(async (tx) => {
        // 1. Double-check ownership to ensure players can't modify someone else's character
        const character = await tx.query.userCharacters.findFirst({
          where: (t, { and, eq }) =>
            and(eq(t.id, characterInstanceId), eq(t.ownerId, req.user!.userId)),
        });

        if (!character) {
          throw new Error("NOT_FOUND_OR_UNAUTHORIZED");
        }

        // 2. Safely stringify the updates so Postgres can consume it as a jsonb object
        const updatesJson = JSON.stringify(statsToUpdate);

        // 3. Perform the selective atomic update using the || operator
        return await tx
          .update(userCharacters)
          .set({
            // The || operator merges the old metadata object with our new key-value pairs
            metadata: sql`${userCharacters.metadata} || ${updatesJson}::jsonb`,
          })
          .where(eq(userCharacters.id, characterInstanceId))
          .returning({
            id: userCharacters.id,
            metadata: userCharacters.metadata,
          });
      });

      return res.status(200).send({
        success: true,
        character: updatedRows[0],
      });
    } catch (error: any) {
      if (error.message === "NOT_FOUND_OR_UNAUTHORIZED") {
        return res.status(404).send({
          success: false,
          message: "Character not found or access denied.",
        });
      }

      return res.status(500).send({
        success: false,
        message: `Failed to update character. Reason: ${error.message || error}`,
      });
    }
  },
);
