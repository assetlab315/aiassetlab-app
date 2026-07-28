-- AI Asset Lab Deployment Step10-A1
-- Portfolio cloud sync foundation. Apply manually from the Supabase Dashboard or CLI
-- after reviewing the target project. Service Role keys are not required by the app.

create table if not exists public.portfolio_assets (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  name text not null,
  category text not null,
  amount numeric(14, 0) not null,
  monthly_contribution numeric(14, 0) not null default 0,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id),
  constraint portfolio_assets_category_check
    check (category in ('cash', 'stock', 'fund', 'crypto', 'pension', 'other')),
  constraint portfolio_assets_amount_check check (amount >= 0),
  constraint portfolio_assets_monthly_contribution_check check (monthly_contribution >= 0)
);

comment on table public.portfolio_assets is
  'Per-user portfolio assets for AI Asset Lab. Asset id is text to preserve existing localStorage ids.';
comment on column public.portfolio_assets.amount is
  'JPY integer amount stored as numeric to avoid JavaScript floating-point persistence issues.';
comment on column public.portfolio_assets.monthly_contribution is
  'JPY integer monthly contribution stored as numeric.';

create index if not exists portfolio_assets_user_id_idx
  on public.portfolio_assets (user_id);
create index if not exists portfolio_assets_user_updated_at_idx
  on public.portfolio_assets (user_id, updated_at desc);

create or replace function public.set_portfolio_assets_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolio_assets_set_updated_at on public.portfolio_assets;
create trigger portfolio_assets_set_updated_at
before update on public.portfolio_assets
for each row
execute function public.set_portfolio_assets_updated_at();

alter table public.portfolio_assets enable row level security;

drop policy if exists "portfolio_assets_select_own" on public.portfolio_assets;
create policy "portfolio_assets_select_own"
on public.portfolio_assets
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "portfolio_assets_insert_own" on public.portfolio_assets;
create policy "portfolio_assets_insert_own"
on public.portfolio_assets
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "portfolio_assets_update_own" on public.portfolio_assets;
create policy "portfolio_assets_update_own"
on public.portfolio_assets
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "portfolio_assets_delete_own" on public.portfolio_assets;
create policy "portfolio_assets_delete_own"
on public.portfolio_assets
for delete
to authenticated
using (auth.uid() = user_id);

create table if not exists public.portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fingerprint text not null,
  snapshot_data jsonb not null,
  created_at timestamptz not null default now(),
  constraint portfolio_snapshots_unique_fingerprint unique (user_id, fingerprint),
  constraint portfolio_snapshots_version_check
    check ((snapshot_data->>'version') = '1'),
  constraint portfolio_snapshots_total_assets_check
    check (((snapshot_data->>'totalAssets')::numeric) > 0)
);

comment on table public.portfolio_snapshots is
  'Per-user portfolio snapshots. The app keeps at most five records and prevents duplicate fingerprints.';
comment on column public.portfolio_snapshots.snapshot_data is
  'Typed PortfolioSnapshot JSON. Application logic validates and trims to five records in Step10-A1.';

create index if not exists portfolio_snapshots_user_id_idx
  on public.portfolio_snapshots (user_id);
create index if not exists portfolio_snapshots_user_created_at_idx
  on public.portfolio_snapshots (user_id, created_at desc);

alter table public.portfolio_snapshots enable row level security;

drop policy if exists "portfolio_snapshots_select_own" on public.portfolio_snapshots;
create policy "portfolio_snapshots_select_own"
on public.portfolio_snapshots
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "portfolio_snapshots_insert_own" on public.portfolio_snapshots;
create policy "portfolio_snapshots_insert_own"
on public.portfolio_snapshots
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "portfolio_snapshots_update_own" on public.portfolio_snapshots;
create policy "portfolio_snapshots_update_own"
on public.portfolio_snapshots
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "portfolio_snapshots_delete_own" on public.portfolio_snapshots;
create policy "portfolio_snapshots_delete_own"
on public.portfolio_snapshots
for delete
to authenticated
using (auth.uid() = user_id);
