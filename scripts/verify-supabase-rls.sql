-- Deployment Step10-A2 RLS verification helper.
-- Replace USER_A_UUID and USER_B_UUID with test auth.users ids in a Preview Supabase project.
-- Do not use real asset data. Do not run with a Service Role client when validating RLS behavior.

select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
and tablename in ('portfolio_assets', 'portfolio_snapshots')
order by tablename;

select
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
and tablename in ('portfolio_assets', 'portfolio_snapshots')
order by tablename, cmd, policyname;

-- User A authenticated context.
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', 'USER_A_UUID', true);

insert into public.portfolio_assets (
  user_id,
  id,
  name,
  category,
  amount,
  monthly_contribution
) values (
  'USER_A_UUID',
  'rls-a-cash',
  'A-現金',
  'cash',
  100000,
  0
) on conflict (user_id, id) do update
set name = excluded.name;

-- Expected: rejected by RLS with_check.
insert into public.portfolio_assets (
  user_id,
  id,
  name,
  category,
  amount,
  monthly_contribution
) values (
  'USER_B_UUID',
  'rls-b-spoof',
  'B-なりすまし',
  'fund',
  200000,
  10000
);

rollback;

-- User B authenticated context.
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', 'USER_B_UUID', true);

insert into public.portfolio_assets (
  user_id,
  id,
  name,
  category,
  amount,
  monthly_contribution
) values (
  'USER_B_UUID',
  'rls-b-fund',
  'B-投信',
  'fund',
  200000,
  10000
) on conflict (user_id, id) do update
set name = excluded.name;

-- Expected: zero rows.
select *
from public.portfolio_assets
where user_id = 'USER_A_UUID';

-- Expected: zero rows updated.
update public.portfolio_assets
set amount = 999999
where user_id = 'USER_A_UUID';

-- Expected: rejected or zero rows because owner change violates with_check.
update public.portfolio_assets
set user_id = 'USER_A_UUID'
where user_id = 'USER_B_UUID'
and id = 'rls-b-fund';

-- Expected: zero rows deleted.
delete from public.portfolio_assets
where user_id = 'USER_A_UUID';

rollback;
