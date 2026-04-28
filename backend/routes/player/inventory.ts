import { app } from "~/index";
import { requireAuth } from "../auth/require";
import { db } from "~/utils/db";
import { userItems } from "~/db/schema";
import { getItemDefinitionIdByName } from "~/utils/query-inventory-items";
import { sql } from "drizzle-orm";

export default function InventoryRoutes() {
  app.get("/api/player/inventory/add", requireAuth, async (req, res) => {
    const { itemName } = req.query;
    if (!itemName)
      return res.status(400).send({
        success: false,
        message: "You need to provide an itemName query param.",
      });

    const definitionId = await getItemDefinitionIdByName(itemName as string);
    if (!definitionId) {
      return res
        .status(404)
        .send({ success: false, message: "Item not found." });
    }

    try {
      await db.transaction(async (tx) => {
        await tx
          .insert(userItems)
          .values({
            ownerId: req.user!.userId,
            definitionId,
            amount: 1,
          })
          .onConflictDoUpdate({
            target: [userItems.ownerId, userItems.definitionId],
            set: {
              amount: sql`${userItems.amount} + 1`,
            },
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
  app.get("/api/player/inventory", requireAuth, async (_req, res) => {
    try {
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: `We could not process that request. Reason: ${error}`,
      });
    }
  });
}
