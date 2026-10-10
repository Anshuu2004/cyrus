CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"target_id" text NOT NULL,
	"target_title" text,
	"status" text DEFAULT 'drafting' NOT NULL,
	"notes" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_meta" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hackathons" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"org" text NOT NULL,
	"org_logo" text,
	"theme" text,
	"status" text NOT NULL,
	"deadline" date,
	"estimated" boolean DEFAULT false NOT NULL,
	"participants" text,
	"prize" text,
	"format" text,
	"eligibility" text,
	"perks" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"color" text,
	"art" text,
	"url" text,
	"details" jsonb NOT NULL,
	"snapshot" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_repos" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_login" text NOT NULL,
	"repo" text NOT NULL,
	"description" text,
	"lang" text,
	"stars" integer DEFAULT 0 NOT NULL,
	"forks" integer DEFAULT 0 NOT NULL,
	"issues" integer DEFAULT 0 NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgs" (
	"login" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"domain" text,
	"level" text,
	"tagline" text,
	"topics" text[] DEFAULT '{}' NOT NULL,
	"repo_count" integer DEFAULT 0 NOT NULL,
	"stars" integer DEFAULT 0 NOT NULL,
	"issues" integer DEFAULT 0 NOT NULL,
	"followers" integer,
	"joined" text,
	"location" text,
	"snapshot" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"program" text NOT NULL,
	"uid" text NOT NULL,
	"year" integer NOT NULL,
	"term" text,
	"title" text NOT NULL,
	"org" text NOT NULL,
	"status" text,
	"tech" text[] DEFAULT '{}' NOT NULL,
	"topics" text[] DEFAULT '{}' NOT NULL,
	"blurb" text,
	"mentors" text,
	"url" text
);
--> statement-breakpoint
CREATE TABLE "repos" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"cat" text NOT NULL,
	"stars" integer DEFAULT 0 NOT NULL,
	"forks" integer DEFAULT 0 NOT NULL,
	"issues" integer DEFAULT 0 NOT NULL,
	"lang" text,
	"license" text,
	"updated" date,
	"homepage" text,
	"url" text NOT NULL,
	"description" text,
	"topics" text[] DEFAULT '{}' NOT NULL,
	"domain" text[],
	"models" text[],
	"format" text,
	"frameworks" text[],
	"snapshot" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"provider" text NOT NULL,
	"brand" text NOT NULL,
	"category" text NOT NULL,
	"level" text NOT NULL,
	"time" text,
	"url" text NOT NULL,
	"description" text NOT NULL,
	"why" text,
	"use" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"free" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"item_type" text NOT NULL,
	"item_id" text NOT NULL,
	"title" text,
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"name" text,
	"email" text,
	"payload" jsonb NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"provider_id" text NOT NULL,
	"login" text,
	"name" text NOT NULL,
	"email" text,
	"picture" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_repos" ADD CONSTRAINT "org_repos_org_login_orgs_login_fk" FOREIGN KEY ("org_login") REFERENCES "public"."orgs"("login") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "app_unique_idx" ON "applications" USING btree ("user_id","kind","target_id");--> statement-breakpoint
CREATE INDEX "app_user_idx" ON "applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "hackathons_status_idx" ON "hackathons" USING btree ("status","deadline");--> statement-breakpoint
CREATE INDEX "org_repos_org_idx" ON "org_repos" USING btree ("org_login","stars");--> statement-breakpoint
CREATE INDEX "orgs_stars_idx" ON "orgs" USING btree ("stars");--> statement-breakpoint
CREATE UNIQUE INDEX "program_projects_uid_idx" ON "program_projects" USING btree ("program","uid");--> statement-breakpoint
CREATE INDEX "program_projects_org_idx" ON "program_projects" USING btree ("org","year");--> statement-breakpoint
CREATE UNIQUE INDEX "repos_name_idx" ON "repos" USING btree ("full_name");--> statement-breakpoint
CREATE INDEX "repos_cat_stars_idx" ON "repos" USING btree ("cat","stars");--> statement-breakpoint
CREATE UNIQUE INDEX "saved_unique_idx" ON "saved_items" USING btree ("user_id","item_type","item_id");--> statement-breakpoint
CREATE INDEX "saved_user_idx" ON "saved_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "submissions_kind_idx" ON "submissions" USING btree ("kind","status");--> statement-breakpoint
CREATE UNIQUE INDEX "users_provider_idx" ON "users" USING btree ("provider","provider_id");