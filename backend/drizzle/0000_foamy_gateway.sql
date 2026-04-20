CREATE TABLE "characters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"name" text NOT NULL,
	"last_name" text NOT NULL,
	"gender" text NOT NULL,
	"height" integer NOT NULL,
	"level" integer DEFAULT 1,
	"experience" integer DEFAULT 0,
	"current_hp" integer DEFAULT 100,
	"max_hp" integer DEFAULT 100,
	"current_mp" integer DEFAULT 0,
	"max_mp" integer DEFAULT 0,
	"physical_damage" integer DEFAULT 10,
	"magical_damage" integer DEFAULT 0,
	"armor" integer DEFAULT 5,
	"magical_armor" integer DEFAULT 0,
	"finesse" integer DEFAULT 10,
	"dexterity" integer DEFAULT 10,
	"critical_rate" numeric(5, 2) DEFAULT '0.05',
	"status" jsonb DEFAULT '[]'::jsonb,
	"skills" uuid[] DEFAULT '{}',
	"equipped_skills" jsonb DEFAULT '[]'::jsonb,
	"current_room_id" text DEFAULT 'guilds_training_grounds',
	"created_at" timestamp with time zone DEFAULT now(),
	"last_online" timestamp with time zone DEFAULT now(),
	CONSTRAINT "gender_check" CHECK ("characters"."gender" IN ('male', 'female'))
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"displayname" text,
	"badges" varchar[] DEFAULT array[]::varchar[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;