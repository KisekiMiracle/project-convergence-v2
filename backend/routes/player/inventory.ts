import { app } from "~/index";
import { requireAuth } from "../auth/require";
import { db } from "~/utils/db";
import { itemDefinitions, userItems } from "~/db/schema";
import { getItemDefinitionIdByName } from "~/utils/query-inventory-items";
import { sql, eq } from "drizzle-orm";

export default function InventoryRoutes() {
  app.get("/api/player/inventory/add", requireAuth, async (req, res) => {
    const { itemName, amount } = req.query;
    if (!itemName)
      return res.status(400).send({
        success: false,
        message: "You need to provide an itemName query param.",
      });

    console.log(itemName, typeof amount !== "undefined" ? amount : 1);

    const definitionId = await getItemDefinitionIdByName(itemName as string);
    if (!definitionId) {
      return res
        .status(404)
        .send({ success: false, message: "Item not found." });
    }

    try {
      await db.transaction(async (tx) => {
        const finalAmount = typeof amount !== "undefined" ? Number(amount) : 1;

        await tx
          .insert(userItems)
          .values({
            ownerId: req.user!.userId,
            definitionId,
            amount: finalAmount,
          })
          .onConflictDoUpdate({
            target: [userItems.ownerId, userItems.definitionId],
            set: {
              amount: sql`${userItems.amount} + ${finalAmount}`,
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
  app.get("/api/player/inventory", requireAuth, async (req, res) => {
    try {
      const items = await db.transaction(async (tx) => {
        return await tx
          .select({
            id: userItems.id,
            amount: userItems.amount,
            name: itemDefinitions.name,
            description: itemDefinitions.description,
            category: itemDefinitions.category,
            icon: itemDefinitions.icon,
            metadata: itemDefinitions.metadata,
          })
          .from(userItems)
          .innerJoin(
            itemDefinitions,
            eq(userItems.definitionId, itemDefinitions.id),
          )
          .where(eq(userItems.ownerId, req.user!.userId));
      });

      return res.status(200).send({
        success: true,
        items,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: `We could not process that request. Reason: ${error}`,
      });
    }
  });
}
