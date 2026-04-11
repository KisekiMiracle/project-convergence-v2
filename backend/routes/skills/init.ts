import { Client } from "~/utils/db";
import { app } from "~/index";

export default function CharacterRoutes() {
  app.get("/api/skills/setup", async (_req, res) => {
    try {
      // @ts-ignore
      await Client.query(sql`
        CREATE TABLE IF NOT EXISTS skill (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          author_id UUID NOT NULL, -- Link this to your users table
          
          -- Definition
          name TEXT NOT NULL,
          description TEXT NOT NULL,

          -- Params
          cost JSONB NOT NULL DEFAULT '[]',
          cooldown INTEGER NOT NULL DEFAULT 0,

          -- Effects
          ability_nodes JSONB NOT NULL DEFAULT '[]', -- { id, name, effect, params }
          effects JSONB NOT NULL DEFAULT '[]',
          
          -- Meta
          created_at TIMESTAMPTZ DEFAULT NOW(),
          last_online TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      return res.status(201).send({
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "We could not process that request.",
      });
    }
  });
}
