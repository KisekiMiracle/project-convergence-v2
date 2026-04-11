import { Client } from "~/utils/db";
import { app } from "~/index";
import { sql } from "~/utils/template-strings";

export default function CharacterRoutes() {
  app.get("/api/character/setup", async (_req, res) => {
    try {
      await Client.query(sql`
        CREATE TABLE IF NOT EXISTS characters (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          author_id UUID NOT NULL, -- Link this to your users table
          
          -- Biography
          name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
          height INTEGER NOT NULL, -- stored in cm

          -- Progression
          level INTEGER DEFAULT 1,
          experience INTEGER DEFAULT 0,
          
          -- Vitality
          current_hp INTEGER DEFAULT 100,
          max_hp INTEGER DEFAULT 100,
          
          -- Combat Attributes
          physical_damage INTEGER DEFAULT 10,
          magical_damage INTEGER DEFAULT 0,
          armor INTEGER DEFAULT 5,
          magical_armor INTEGER DEFAULT 0,
          
          -- Skill Attributes
          finesse INTEGER DEFAULT 10,
          dexterity INTEGER DEFAULT 10,
          
          -- Special Stats (using NUMERIC for precise decimals)
          critical_rate NUMERIC(5, 2) DEFAULT 0.05, -- e.g., 5.00%

          -- Status
          status JSONB DEFAULT '[]'::jsonb[],
          skills UUID[] DEFAULT array[]::uuid[],
          equipped_skills JSONB DEFAULT '[]'::jsonb[],
          
          -- Meta
          current_room_id TEXT DEFAULT 'guilds_training_grounds',
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
