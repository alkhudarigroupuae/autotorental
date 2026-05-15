import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260514071203 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "rental_rate" ("id" text not null, "vehicle_id" text not null, "daily_rate" numeric not null, "weekly_rate" numeric null, "monthly_rate" numeric null, "weekly_mileage_limit" integer null, "monthly_mileage_limit" integer null, "extra_km_charge" numeric null, "currency" text not null default 'AED', "metadata" jsonb null, "raw_daily_rate" jsonb not null, "raw_weekly_rate" jsonb null, "raw_monthly_rate" jsonb null, "raw_extra_km_charge" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rental_rate_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_rate_deleted_at" ON "rental_rate" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "rental_terms" ("id" text not null, "vehicle_id" text not null, "min_driver_age" integer not null default 21, "min_license_age_months" integer not null default 0, "security_deposit" numeric not null default 0, "is_zero_deposit" boolean not null default false, "insurance_level" text check ("insurance_level" in ('basic', 'full')) not null default 'basic', "fuel_policy" text check ("fuel_policy" in ('same_to_same', 'full_to_full')) not null default 'same_to_same', "min_rental_days" integer not null default 1, "delivery_available" boolean not null default false, "delivery_fee" numeric null, "additional_driver_fee" numeric null, "child_seat_fee" numeric null, "metadata" jsonb null, "raw_security_deposit" jsonb not null default '{"value":"0","precision":20}', "raw_delivery_fee" jsonb null, "raw_additional_driver_fee" jsonb null, "raw_child_seat_fee" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rental_terms_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_rental_terms_deleted_at" ON "rental_terms" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "vehicle_availability" ("id" text not null, "vehicle_id" text not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "booking_id" text null, "block_reason" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vehicle_availability_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vehicle_availability_deleted_at" ON "vehicle_availability" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "rental_rate" cascade;`);

    this.addSql(`drop table if exists "rental_terms" cascade;`);

    this.addSql(`drop table if exists "vehicle_availability" cascade;`);
  }

}
