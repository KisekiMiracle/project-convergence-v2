import { Client } from "~/utils/db";
import { app } from "~/index";

export default function CharacterRoutes() {
  app.get("/api/player/setup", async (_req, res) => {
    try {
      // @ts-ignore
      await Client.query(sql`
        CREATE TABLE IF NOT EXISTS players (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          
          -- Biography
          name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
          height INTEGER NOT NULL, -- stored in cm
          
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
