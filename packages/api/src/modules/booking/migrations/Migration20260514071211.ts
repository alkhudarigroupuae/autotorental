import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260514071211 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "booking" ("id" text not null, "customer_id" text not null, "vehicle_id" text not null, "vendor_id" text not null, "status" text check ("status" in ('enquiry', 'quoted', 'confirmed', 'active', 'completed', 'cancelled', 'rejected')) not null default 'enquiry', "pickup_date" timestamptz not null, "return_date" timestamptz not null, "pickup_location" text null, "return_location" text null, "quoted_total" numeric not null default 0, "advance_amount" numeric not null default 0, "balance_amount" numeric not null default 0, "deposit_amount" numeric not null default 0, "addons" jsonb null, "payment_status" text check ("payment_status" in ('pending', 'advance_paid', 'balance_paid', 'refunded')) not null default 'pending', "channel" text check ("channel" in ('web', 'whatsapp')) not null default 'web', "notes" text null, "medusa_order_id" text null, "post_rental_charges" jsonb null, "metadata" jsonb null, "raw_quoted_total" jsonb not null default '{"value":"0","precision":20}', "raw_advance_amount" jsonb not null default '{"value":"0","precision":20}', "raw_balance_amount" jsonb not null default '{"value":"0","precision":20}', "raw_deposit_amount" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "booking_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_deleted_at" ON "booking" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "booking_addon" ("id" text not null, "booking_id" text not null, "type" text check ("type" in ('insurance_upgrade', 'additional_driver', 'child_seat', 'delivery')) not null, "label" text not null, "price" numeric not null default 0, "metadata" jsonb null, "raw_price" jsonb not null default '{"value":"0","precision":20}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "booking_addon_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_booking_addon_deleted_at" ON "booking_addon" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "booking" cascade;`);

    this.addSql(`drop table if exists "booking_addon" cascade;`);
  }

}
