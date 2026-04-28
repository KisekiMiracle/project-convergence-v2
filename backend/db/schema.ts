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
  unique,
  boolean,
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

export const characterDefinitions = pgTable(
  "character_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Biography
    name: text("name").notNull(),
    lastName: text("last_name").notNull(),
    gender: text("gender").notNull(), // You can add a check constraint in raw SQL or validate in TS
    height: integer("height").notNull(),

    // Progression
    level: integer("level").default(1),
    experience: integer("experience").default(0),
    experienceToLvlUp: integer("experience_to_level_up").default(200),

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
      "0.00",
    ),

    // Equipment Slots
    weapon: uuid("weapon").references(() => itemDefinitions.id),

    // Status & Skills
    // Note: JSONB columns are typed as 'unknown' by default,
    // but you can cast them: jsonb("status").$type<StatusEffect[]>()
    status: jsonb("status").array().default([]), // e.g. { statusId, duration }
    skills: jsonb("skills").array().default([]), // e.g. { skillId, description, cost, cooldown }

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

// NOTE: (What the player owns)
export const userCharacters = pgTable(
  "user_characters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").references(() => users.id),
    definitionId: uuid("definition_id").references(
      () => characterDefinitions.id,
    ),
    // Equipment Slots
    equipSlot1: uuid("equip_slot_1").references(() => itemDefinitions.id),
    equipSlot2: uuid("equip_slot_2").references(() => itemDefinitions.id),
    equipSlot3: uuid("equip_slot_3").references(() => itemDefinitions.id),
    equipSlot4: uuid("equip_slot_4").references(() => itemDefinitions.id),
    equipSlot5: uuid("equip_slot_5").references(() => itemDefinitions.id),
    equipSlot6: uuid("equip_slot_6").references(() => itemDefinitions.id),
    // ---
    firstMetAt: timestamp("first_met_at", { withTimezone: true }).defaultNow(),
    // Optional: Only add columns here if the item is unique (e.g., enchanted gear)
    metadata: jsonb("metadata").default({}), // e.g. { type, rarity, enchantment }
  },
  (t) => ({
    unq: unique().on(t.ownerId, t.definitionId),
  }),
);
export type Character = InferSelectModel<typeof userCharacters>;

// NOTE: (Read-only for players)
export const itemDefinitions = pgTable("item_definitions", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  effect: text("effect").notNull(), // The formula
  scope: text("scope").notNull(),
  message: text("message").notNull(),
  category: text("category").notNull(), // 'consumable', 'key', 'equippable'
  slot: text("slot"), // 'unique', 'equippable' (null for consumables)
});

// NOTE: (What the player owns)
export const userItems = pgTable(
  "user_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").references(() => users.id),
    definitionId: uuid("definition_id").references(() => itemDefinitions.id),
    amount: integer("amount").default(1),
    // Optional: Only add columns here if the item is unique (e.g., enchanted gear)
    metadata: jsonb("metadata").default({}), // e.g. { type, rarity, enchantment }
  },
  (t) => ({
    unq: unique().on(t.ownerId, t.definitionId),
  }),
);
export type Inventory = InferSelectModel<typeof userItems>;

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
