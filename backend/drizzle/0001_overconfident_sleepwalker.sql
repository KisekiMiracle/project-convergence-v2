CREATE TABLE "item_definitions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"effect" text NOT NULL,
	"scope" text NOT NULL,
	"message" text NOT NULL,
	"category" text NOT NULL,
	"slot" text
);
--> statement-breakpoint
CREATE TABLE "user_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid,
	"definition_id" uuid,
	"amount" integer DEFAULT 1,
	"metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "characters" RENAME COLUMN "author_id" TO "owner_id";--> statement-breakpoint
ALTER TABLE "characters" DROP CONSTRAINT "characters_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_items" ADD CONSTRAINT "user_items_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_items" ADD CONSTRAINT "user_items_definition_id_item_definitions_id_fk" FOREIGN KEY ("definition_id") REFERENCES "public"."item_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;