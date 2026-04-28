ALTER TABLE "characters" DROP CONSTRAINT "characters_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "critical_rate" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "status" SET DATA TYPE jsonb[];--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "status" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "skills" SET DATA TYPE jsonb[];--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "skills" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "weapon" uuid;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_weapon_item_definitions_id_fk" FOREIGN KEY ("weapon") REFERENCES "public"."item_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "owner_id";--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "equipped_skills";