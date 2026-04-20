import {
  pgTable,
  uuid,
  text,
  integer,
  varchar,
  numeric,
  jsonb,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql, type InferSelectModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});
export type Users = InferSelectModel<typeof users>;

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("displayname"),
  // Drizzle handles the array syntax correctly for you!
  badges: varchar("badges")
    .array()
    .default(sql`array[]::varchar[]`),
  createdAt: timestamp("created_at").defaultNow(),
});
export type Profile = InferSelectModel<typeof profiles>;

export const characters = pgTable(
  "characters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Biography
    name: text("name").notNull(),
    lastName: text("last_name").notNull(),
    gender: text("gender").notNull(), // You can add a check constraint in raw SQL or validate in TS
    height: integer("height").notNull(),

    // Progression
    level: integer("level").default(1),
    experience: integer("experience").default(0),

    // Vitality
    currentHp: integer("current_hp").default(100),
    maxHp: integer("max_hp").default(100),
    currentMp: integer("current_mp").default(0),
    maxMp: integer("max_mp").default(0),

    // Combat Attributes
    physicalDamage: integer("physical_damage").default(10),
    magicalDamage: integer("magical_damage").default(0),
    armor: integer("armor").default(5),
    magicalArmor: integer("magical_armor").default(0),

    // Skill Attributes
    finesse: integer("finesse").default(10),
    dexterity: integer("dexterity").default(10),

    // Special Stats
    // numeric(precision, scale) -> numeric(5, 2)
    criticalRate: numeric("critical_rate", { precision: 5, scale: 2 }).default(
      "0.05",
    ),

    // Status & Skills
    // Note: JSONB columns are typed as 'unknown' by default,
    // but you can cast them: jsonb("status").$type<StatusEffect[]>()
    status: jsonb("status").default([]),
    skills: uuid("skills").array().default([]),
    equippedSkills: jsonb("equipped_skills").default([]),

    // Meta
    currentRoomId: text("current_room_id").default("guilds_training_grounds"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    lastOnline: timestamp("last_online", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    genderCheck: check(
      "gender_check",
      sql`${table.gender} IN ('male', 'female')`,
    ),
  }),
);
export type Character = InferSelectModel<typeof characters>;
