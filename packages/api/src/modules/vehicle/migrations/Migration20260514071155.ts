import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260514071155 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "vehicle" ("id" text not null, "seller_id" text not null, "medusa_product_id" text null, "make" text not null, "model_name" text not null, "year" integer not null, "category_id" text null, "transmission" text check ("transmission" in ('automatic', 'manual')) not null default 'automatic', "fuel_type" text check ("fuel_type" in ('petrol', 'diesel', 'hybrid', 'electric')) not null default 'petrol', "seats" integer not null default 5, "doors" integer not null default 4, "color" text null, "plate_number" text null, "vin" text null, "plate_region" text null, "description" text null, "photos" jsonb null, "specs" jsonb null, "features" jsonb null, "entry_method" text check ("entry_method" in ('auto_vin', 'auto_plate', 'manual')) not null default 'manual', "status" text check ("status" in ('draft', 'published', 'unpublished')) not null default 'draft', "city" text null, "lat" real null, "lng" real null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vehicle_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vehicle_deleted_at" ON "vehicle" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "vehicle_category" ("id" text not null, "name" text not null, "name_ar" text null, "description" text null, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vehicle_category_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vehicle_category_deleted_at" ON "vehicle_category" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "vehicle_feature" ("id" text not null, "name" text not null, "name_ar" text null, "icon" text null, "category" text check ("category" in ('comfort', 'safety', 'tech', 'audio', 'other')) not null default 'other', "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vehicle_feature_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vehicle_feature_deleted_at" ON "vehicle_feature" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "vehicle" cascade;`);

    this.addSql(`drop table if exists "vehicle_category" cascade;`);

    this.addSql(`drop table if exists "vehicle_feature" cascade;`);
  }

}
