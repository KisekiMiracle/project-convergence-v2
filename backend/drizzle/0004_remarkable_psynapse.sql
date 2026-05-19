CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_characters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid,
	"definition_id" uuid,
	"equip_slot_1" uuid,
	"equip_slot_2" uuid,
	"equip_slot_3" uuid,
	"equip_slot_4" uuid,
	"equip_slot_5" uuid,
	"equip_slot_6" uuid,
	"first_met_at" timestamp with time zone DEFAULT now(),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "user_characters_owner_id_definition_id_unique" UNIQUE("owner_id","definition_id")
);
--> statement-breakpoint
ALTER TABLE "characters" RENAME TO "character_definitions";--> statement-breakpoint
ALTER TABLE "character_definitions" DROP CONSTRAINT "gender_check";--> statement-breakpoint
ALTER TABLE "character_definitions" DROP CONSTRAINT "characters_weapon_item_definitions_id_fk";
--> statement-breakpoint
ALTER TABLE "character_definitions" ADD COLUMN "experience_to_level_up" integer DEFAULT 200;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_characters" ADD CONSTRAINT "user_characters_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_characters" ADD CONSTRAINT "user_characters_definition_id_character_definitions_id_fk" FOREIGN KEY ("definition_id") REFERENCES "public"."character_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_characters" ADD CONSTRAINT "user_characters_equip_slot_1_item_definitions_id_fk" FOREIGN KEY ("equip_slot_1") REFERENCES "public"."item_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_characters" ADD CONSTRAINT "user_characters_equip_slot_2_item_definitions_id_fk" FOREIGN KEY ("equip_slot_2") REFERENCES "public"."item_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_characters" ADD CONSTRAINT "user_characters_equip_slot_3_item_definitions_id_fk" FOREIGN KEY ("equip_slot_3") REFERENCES "public"."item_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_characters" ADD CONSTRAINT "user_characters_equip_slot_4_item_definitions_id_fk" FOREIGN KEY ("equip_slot_4") REFERENCES "public"."item_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_characters" ADD CONSTRAINT "user_characters_equip_slot_5_item_definitions_id_fk" FOREIGN KEY ("equip_slot_5") REFERENCES "public"."item_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_characters" ADD CONSTRAINT "user_characters_equip_slot_6_item_definitions_id_fk" FOREIGN KEY ("equip_slot_6") REFERENCES "public"."item_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_definitions" ADD CONSTRAINT "character_definitions_weapon_item_definitions_id_fk" FOREIGN KEY ("weapon") REFERENCES "public"."item_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_definitions" ADD CONSTRAINT "gender_check" CHECK ("character_definitions"."gender" IN ('male', 'female'));