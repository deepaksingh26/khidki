-- Combined migrations for Khidkee
-- Apply these in order in the Supabase SQL editor or run via psql/supabase CLI

-- ==========================================================
-- 1) init extensions and enum types
-- ==========================================================
create extension if not exists postgis;
create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'team_role') then
    create type public.team_role as enum ('admin', 'field_worker', 'view_only');
  end if;

  if not exists (select 1 from pg_type where typname = 'issue_priority') then
    create type public.issue_priority as enum ('low', 'medium', 'high', 'critical');
  end if;

  if not exists (select 1 from pg_type where typname = 'issue_status') then
    create type public.issue_status as enum ('open', 'in_progress', 'blocked', 'resolved');
  end if;

  if not exists (select 1 from pg_type where typname = 'alert_status') then
    create type public.alert_status as enum ('draft', 'triggered', 'closed');
  end if;
end
$$;


-- ==========================================================
-- 2) schema (tables, functions, triggers, indexes)
-- ==========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.set_contact_location_geography()
returns trigger
language plpgsql
as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.location = st_setsrid(st_makepoint(new.longitude, new.latitude), 4326)::geography;
  end if;
  return new;
end;
$$;

create or replace function public.set_visit_geography()
returns trigger
language plpgsql
as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.location = st_setsrid(st_makepoint(new.longitude, new.latitude), 4326)::geography;
  end if;
  return new;
end;
$$;

create or replace function public.set_alert_geography()
returns trigger
language plpgsql
as $$
begin
  if new.latitude is not null and new.longitude is not null then
    new.location = st_setsrid(st_makepoint(new.longitude, new.latitude), 4326)::geography;
  end if;
  return new;
end;
$$;

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  role public.team_role not null default 'field_worker',
  display_name text not null,
  phone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_hi text,
  phone text,
  whatsapp text,
  village text not null,
  panchayat text not null,
  block text not null,
  district text not null,
  tags text[] not null default '{}',
  notes text,
  photo_url text,
  last_visit_at timestamptz,
  visit_count integer not null default 0,
  added_by uuid,
  archived_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_locations (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  label text not null default 'Primary',
  latitude double precision not null,
  longitude double precision not null,
  location geography(point, 4326),
  accuracy_m numeric(10, 2),
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts(id) on delete set null,
  title text not null,
  type text not null,
  priority public.issue_priority not null default 'medium',
  status public.issue_status not null default 'open',
  description text,
  action_taken text,
  next_followup_at timestamptz,
  assigned_to uuid,
  resolved_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  archived_at timestamptz
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts(id) on delete set null,
  visited_by uuid,
  visited_at timestamptz not null default timezone('utc', now()),
  village text not null,
  panchayat text not null,
  duration_mins integer,
  outcome text,
  notes text,
  latitude double precision,
  longitude double precision,
  location geography(point, 4326),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  archived_at timestamptz
);

create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  interaction_type text not null,
  interacted_by uuid,
  interacted_at timestamptz not null default timezone('utc', now()),
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  created_by uuid,
  crisis_type text not null,
  latitude double precision not null,
  longitude double precision not null,
  location geography(point, 4326),
  radius_km numeric(10, 2) not null default 2,
  status public.alert_status not null default 'triggered',
  triggered_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.alert_recipients (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references public.alerts(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  distance_m numeric(10, 2),
  notified_at timestamptz,
  response text,
  responded_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text,
  phone text,
  email text,
  district text,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists contacts_archived_idx on public.contacts (archived_at);
create index if not exists contacts_panchayat_idx on public.contacts (panchayat);
create index if not exists contacts_last_visit_idx on public.contacts (last_visit_at desc);
create index if not exists contacts_tags_idx on public.contacts using gin (tags);

create index if not exists contact_locations_contact_id_idx on public.contact_locations (contact_id);
create index if not exists contact_locations_primary_idx on public.contact_locations (contact_id, is_primary desc);
create index if not exists contact_locations_geo_idx on public.contact_locations using gist (location);

create index if not exists issues_contact_id_idx on public.issues (contact_id);
create index if not exists issues_status_idx on public.issues (status);
create index if not exists issues_priority_idx on public.issues (priority);
create index if not exists issues_followup_idx on public.issues (next_followup_at);

create index if not exists visits_contact_id_idx on public.visits (contact_id);
create index if not exists visits_visited_at_idx on public.visits (visited_at desc);
create index if not exists visits_geo_idx on public.visits using gist (location);
create index if not exists visits_archived_idx on public.visits (archived_at);

create index if not exists interactions_contact_id_idx on public.interactions (contact_id);
create index if not exists interactions_at_idx on public.interactions (interacted_at desc);

create index if not exists alerts_status_idx on public.alerts (status);
create index if not exists alerts_triggered_idx on public.alerts (triggered_at desc);
create index if not exists alerts_geo_idx on public.alerts using gist (location);

create index if not exists alert_recipients_alert_id_idx on public.alert_recipients (alert_id);
create index if not exists team_members_user_id_idx on public.team_members (user_id);

-- triggers

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
before update on public.contacts
for each row
execute function public.set_updated_at();

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
before update on public.team_members
for each row
execute function public.set_updated_at();

drop trigger if exists contact_locations_set_updated_at on public.contact_locations;
create trigger contact_locations_set_updated_at
before update on public.contact_locations
for each row
execute function public.set_updated_at();

drop trigger if exists issues_set_updated_at on public.issues;
create trigger issues_set_updated_at
before update on public.issues
for each row
execute function public.set_updated_at();

drop trigger if exists visits_set_updated_at on public.visits;
create trigger visits_set_updated_at
before update on public.visits
for each row
execute function public.set_updated_at();

drop trigger if exists contact_locations_set_geo on public.contact_locations;
create trigger contact_locations_set_geo
before insert or update on public.contact_locations
for each row
execute function public.set_contact_location_geography();

drop trigger if exists visits_set_geo on public.visits;
create trigger visits_set_geo
before insert or update on public.visits
for each row
execute function public.set_visit_geography();

drop trigger if exists alerts_set_geo on public.alerts;
create trigger alerts_set_geo
before insert or update on public.alerts
for each row
execute function public.set_alert_geography();


-- ==========================================================
-- 3) policies, views and helper functions
-- ==========================================================

create or replace function public.is_team_member(actor uuid default auth.uid())
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.team_members
    where user_id = actor
  );
$$;

create or replace function public.current_team_role(actor uuid default auth.uid())
returns public.team_role
language sql
stable
as $$
  select coalesce(
    (
      select role
      from public.team_members
      where user_id = actor
      limit 1
    ),
    'view_only'::public.team_role
  );
$$;

create or replace function public.is_admin(actor uuid default auth.uid())
returns boolean
language sql
stable
as $$
  select public.current_team_role(actor) = 'admin'::public.team_role;
$$;

create or replace function public.visit_gap_level(last_seen timestamptz)
returns text
language sql
stable
as $$
  select case
    when last_seen is null then 'critical'
    when timezone('utc', now()) - last_seen >= interval '60 days' then 'critical'
    when timezone('utc', now()) - last_seen >= interval '30 days' then 'high_priority'
    when timezone('utc', now()) - last_seen >= interval '15 days' then 'attention_needed'
    when timezone('utc', now()) - last_seen >= interval '7 days' then 'gentle_reminder'
    else 'on_track'
  end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  starting_role public.team_role := 'field_worker';
  derived_name text;
begin
  if not exists (select 1 from public.team_members limit 1) then
    starting_role := 'admin';
  end if;

  derived_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    split_part(new.email, '@', 1),
    new.phone,
    'Field worker'
  );

  insert into public.team_members (user_id, role, display_name, phone)
  values (new.id, starting_role, derived_name, new.phone)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

create or replace function public.find_nearby_contacts(
  input_lat double precision,
  input_lng double precision,
  input_radius_km double precision default 5,
  input_tag text default null
)
returns table (
  contact_id uuid,
  name text,
  name_hi text,
  village text,
  panchayat text,
  phone text,
  tags text[],
  latitude double precision,
  longitude double precision,
  distance_m double precision,
  gap_level text
)
language sql
stable
as $$
  with current_point as (
    select st_setsrid(st_makepoint(input_lng, input_lat), 4326)::geography as geom
  )
  select
    c.id as contact_id,
    c.name,
    c.name_hi,
    c.village,
    c.panchayat,
    c.phone,
    c.tags,
    cl.latitude,
    cl.longitude,
    st_distance(cl.location, cp.geom) as distance_m,
    public.visit_gap_level(c.last_visit_at) as gap_level
  from public.contacts c
  join lateral (
    select *
    from public.contact_locations
    where contact_id = c.id
      and is_primary = true
    order by created_at asc
    limit 1
  ) cl on true
  cross join current_point cp
  where c.archived_at is null
    and st_dwithin(cl.location, cp.geom, input_radius_km * 1000)
    and (input_tag is null or input_tag = any(c.tags))
  order by distance_m asc;
$$;

create or replace view public.dashboard_priority as
select
  c.id,
  c.name,
  c.name_hi,
  c.village,
  c.panchayat,
  c.block,
  c.district,
  c.tags,
  c.last_visit_at,
  c.visit_count,
  public.visit_gap_level(c.last_visit_at) as gap_level,
  coalesce(issue_counts.open_issue_count, 0) as open_issue_count,
  coalesce(issue_counts.critical_issue_count, 0) as critical_issue_count
from public.contacts c
left join (
  select
    contact_id,
    count(*) filter (where archived_at is null and status <> 'resolved') as open_issue_count,
    count(*) filter (where archived_at is null and priority = 'critical' and status <> 'resolved') as critical_issue_count
  from public.issues
  group by contact_id
) issue_counts on issue_counts.contact_id = c.id
where c.archived_at is null;

create or replace view public.panchayat_visit_summary as
with last_contact_touch as (
  select
    panchayat,
    max(last_visit_at) as last_contact_visit_at,
    count(*) filter (where archived_at is null) as total_contacts,
    count(*) filter (
      where archived_at is null
      and public.visit_gap_level(last_visit_at) in ('attention_needed', 'high_priority', 'critical')
    ) as contacts_needing_attention
  from public.contacts
  group by panchayat
),
visit_rollup as (
  select
    panchayat,
    max(visited_at) as last_logged_visit_at,
    count(*) filter (where archived_at is null) as visit_count
  from public.visits
  group by panchayat
),
issue_rollup as (
  select
    c.panchayat,
    count(*) filter (where i.archived_at is null and i.status <> 'resolved') as open_issues
  from public.contacts c
  left join public.issues i on i.contact_id = c.id
  where c.archived_at is null
  group by c.panchayat
)
select
  lct.panchayat,
  lct.total_contacts,
  lct.contacts_needing_attention,
  coalesce(vr.visit_count, 0) as visit_count,
  greatest(coalesce(vr.last_logged_visit_at, '1970-01-01'::timestamptz), coalesce(lct.last_contact_visit_at, '1970-01-01'::timestamptz)) as last_activity_at,
  coalesce(ir.open_issues, 0) as open_issues
from last_contact_touch lct
left join visit_rollup vr on vr.panchayat = lct.panchayat
left join issue_rollup ir on ir.panchayat = lct.panchayat;

create or replace view public.suggested_area_scores as
select
  pvs.panchayat,
  pvs.total_contacts,
  pvs.contacts_needing_attention,
  pvs.open_issues,
  pvs.last_activity_at,
  (
    least(
      extract(epoch from (timezone('utc', now()) - coalesce(pvs.last_activity_at, '1970-01-01'::timestamptz))) / 86400,
      90
    ) * 0.45
  ) +
  (pvs.contacts_needing_attention * 3.5) +
  (pvs.open_issues * 4.5) as score
from public.panchayat_visit_summary pvs;

alter table public.team_members enable row level security;
alter table public.contacts enable row level security;
alter table public.contact_locations enable row level security;
alter table public.issues enable row level security;
alter table public.visits enable row level security;
alter table public.interactions enable row level security;
alter table public.alerts enable row level security;
alter table public.alert_recipients enable row level security;
alter table public.access_requests enable row level security;
alter table public.contact_messages enable row level security;

create policy "team_members_can_read_team"
on public.team_members
for select
to authenticated
using (public.is_team_member());

create policy "admins_manage_team"
on public.team_members
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "team_can_read_contacts"
on public.contacts
for select
to authenticated
using (public.is_team_member() and archived_at is null);

create policy "team_can_insert_contacts"
on public.contacts
for insert
to authenticated
with check (public.is_team_member());

create policy "team_can_update_contacts"
on public.contacts
for update
to authenticated
using (public.is_team_member())
with check (public.is_team_member());

create policy "team_can_read_contact_locations"
on public.contact_locations
for select
to authenticated
using (
  public.is_team_member()
  and exists (
    select 1 from public.contacts c
    where c.id = contact_id
      and c.archived_at is null
  )
);

create policy "team_can_manage_contact_locations"
on public.contact_locations
for all
to authenticated
using (public.is_team_member())
with check (public.is_team_member());

create policy "team_can_read_issues"
on public.issues
for select
to authenticated
using (public.is_team_member() and archived_at is null);

create policy "team_can_manage_issues"
on public.issues
for all
to authenticated
using (public.is_team_member())
with check (public.is_team_member());

create policy "team_can_read_visits"
on public.visits
for select
to authenticated
using (public.is_team_member() and archived_at is null);

create policy "team_can_manage_visits"
on public.visits
for all
to authenticated
using (public.is_team_member())
with check (public.is_team_member());

create policy "team_can_read_interactions"
on public.interactions
for select
to authenticated
using (public.is_team_member());

create policy "team_can_manage_interactions"
on public.interactions
for all
to authenticated
using (public.is_team_member())
with check (public.is_team_member());

create policy "team_can_read_alerts"
on public.alerts
for select
to authenticated
using (public.is_team_member());

create policy "team_can_manage_alerts"
on public.alerts
for all
to authenticated
using (public.is_team_member())
with check (public.is_team_member());

create policy "team_can_read_alert_recipients"
on public.alert_recipients
for select
to authenticated
using (public.is_team_member());

create policy "team_can_manage_alert_recipients"
on public.alert_recipients
for all
to authenticated
using (public.is_team_member())
with check (public.is_team_member());

create policy "public_can_create_access_requests"
on public.access_requests
for insert
to anon, authenticated
with check (true);

create policy "admins_can_read_access_requests"
on public.access_requests
for select
to authenticated
using (public.is_admin());

create policy "public_can_create_contact_messages"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

create policy "admins_can_read_contact_messages"
on public.contact_messages
for select
to authenticated
using (public.is_admin());


-- ==========================================================
-- 4) optional seed data
-- ==========================================================

insert into public.team_members (id, user_id, role, display_name, phone)
values
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'admin', 'Rekha Kumari', '+91 98765 40001'),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'field_worker', 'Arif Ansari', '+91 98765 40002'),
  ('10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'view_only', 'Neelam Devi', '+91 98765 40003')
on conflict (user_id) do nothing;

insert into public.contacts (
  id, name, name_hi, phone, whatsapp, village, panchayat, block, district, tags, notes, photo_url, last_visit_at, visit_count, added_by
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    'Ramesh Paswan',
    'रमेश पासवान',
    '+91 91234 50001',
    '+91 91234 50001',
    'Mahua Tola',
    'Basantpur',
    'Mahua',
    'Vaishali',
    array['farmer', 'flood-watch'],
    'Keeps track of the low-lying fields near the canal. Usually the first to notice water rise.',
    null,
    timezone('utc', now()) - interval '34 days',
    11,
    '20000000-0000-0000-0000-000000000002'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'Sunita Devi',
    'सुनीता देवी',
    '+91 91234 50002',
    '+91 91234 50002',
    'Chandpur Basti',
    'Basantpur',
    'Mahua',
    'Vaishali',
    array['self-help-group', 'women-leader'],
    'Runs the women’s group circle and often gathers concerns before meetings.',
    null,
    timezone('utc', now()) - interval '19 days',
    14,
    '20000000-0000-0000-0000-000000000002'
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Md. Aslam',
    'मो. असलम',
    '+91 91234 50003',
    '+91 91234 50003',
    'Naya Gaon',
    'Rampur Khajuria',
    'Mahua',
    'Vaishali',
    array['youth-volunteer', 'bike-access'],
    'Can reach scattered hamlets quickly. Useful in urgent follow-up.',
    null,
    timezone('utc', now()) - interval '8 days',
    9,
    '20000000-0000-0000-0000-000000000002'
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    'Pushpa Kumari',
    'पुष्पा कुमारी',
    '+91 91234 50004',
    '+91 91234 50004',
    'Bishunpur',
    'Rampur Khajuria',
    'Mahua',
    'Vaishali',
    array['anganwadi', 'nutrition'],
    'Tracks nutrition follow-up for mothers with infants.',
    null,
    timezone('utc', now()) - interval '67 days',
    5,
    '20000000-0000-0000-0000-000000000001'
  ),
  (
    '30000000-0000-0000-0000-000000000005',
    'Bhola Yadav',
    'भोला यादव',
    '+91 91234 50005',
    null,
    'Jalalpur',
    'Sahariya',
    'Mahua',
    'Vaishali',
    array['panchayat-member', 'water'],
    'Usually available in the evening after field work.',
    null,
    timezone('utc', now()) - interval '12 days',
    17,
    '20000000-0000-0000-0000-000000000001'
  ),
  (
    '30000000-0000-0000-0000-000000000006',
    'Kiran Bano',
    'किरण बानो',
    '+91 91234 50006',
    '+91 91234 50006',
    'Sikandarpur',
    'Sahariya',
    'Mahua',
    'Vaishali',
    array['health', 'volunteer'],
    'Often helps with medical referrals and escort support.',
    null,
    timezone('utc', now()) - interval '4 days',
    8,
    '20000000-0000-0000-0000-000000000002'
  ),
  (
    '30000000-0000-0000-0000-000000000007',
    'Anil Kumar',
    'अनिल कुमार',
    '+91 91234 50007',
    '+91 91234 50007',
    'Betia East',
    'Chandpura',
    'Mahua',
    'Vaishali',
    array['tractor-owner', 'logistics'],
    'Provides transport during flood response if fuel is arranged.',
    null,
    timezone('utc', now()) - interval '42 days',
    6,
    '20000000-0000-0000-0000-000000000001'
  ),
  (
    '30000000-0000-0000-0000-000000000008',
    'Mamta Ji',
    'ममता जी',
    '+91 91234 50008',
    '+91 91234 50008',
    'Khaira Tola',
    'Chandpura',
    'Mahua',
    'Vaishali',
    array['school-committee', 'adolescent-girls'],
    'Leads the local adolescent girls learning circle.',
    null,
    timezone('utc', now()) - interval '26 days',
    10,
    '20000000-0000-0000-0000-000000000002'
  )
on conflict (id) do nothing;

insert into public.contact_locations (id, contact_id, label, latitude, longitude, accuracy_m, is_primary)
values
  ('31000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Home', 25.7198, 85.4024, 18, true),
  ('31000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'Meeting Point', 25.7239, 85.4090, 24, true),
  ('31000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', 'Naya Gaon Centre', 25.7314, 85.4162, 12, true),
  ('31000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', 'Anganwadi Kendra', 25.7353, 85.4288, 15, true),
  ('31000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', 'Ward Chowk', 25.7095, 85.3927, 17, true),
  ('31000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000006', 'Clinic Turn', 25.7047, 85.4014, 20, true),
  ('31000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000007', 'Tractor Shed', 25.7418, 85.4382, 28, true),
  ('31000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000008', 'School Gate', 25.7473, 85.4474, 19, true)
on conflict (id) do nothing;

insert into public.issues (
  id, contact_id, title, type, priority, status, description, action_taken, next_followup_at, assigned_to, created_by, created_at
)
values
  (
    '32000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Canal water entered lower field edge',
    'flood-risk',
    'high',
    'in_progress',
    'Bund repair is needed before the next heavy rain.',
    'Shared with panchayat member and marked for field check.',
    timezone('utc', now()) + interval '2 days',
    '20000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    timezone('utc', now()) - interval '3 days'
  ),
  (
    '32000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002',
    'Self-help group meeting space locked',
    'community-space',
    'medium',
    'open',
    'Women’s group could not meet this week because the room key was not available.',
    'No action yet.',
    timezone('utc', now()) + interval '5 days',
    '20000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    timezone('utc', now()) - interval '6 days'
  ),
  (
    '32000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000004',
    'Nutrition supplies delayed for two weeks',
    'nutrition',
    'critical',
    'blocked',
    'Children under three have missed the latest supply cycle.',
    'Called block office. Waiting for dispatch date.',
    timezone('utc', now()) + interval '1 day',
    '20000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    timezone('utc', now()) - interval '1 day'
  ),
  (
    '32000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000005',
    'Handpump repair request pending',
    'water',
    'high',
    'open',
    'Main handpump near ward chowk is still not repaired.',
    'Awaiting mechanic visit.',
    timezone('utc', now()) + interval '4 days',
    '20000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    timezone('utc', now()) - interval '8 days'
  ),
  (
    '32000000-0000-0000-0000-000000000005',
    '30000000-0000-0000-0000-000000000006',
    'Medical escort needed for antenatal check-up',
    'medical-support',
    'medium',
    'in_progress',
    'Family needs help getting to the community health centre.',
    'Volunteer support lined up for Thursday morning.',
    timezone('utc', now()) + interval '1 day',
    '20000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    timezone('utc', now()) - interval '2 days'
  ),
  (
    '32000000-0000-0000-0000-000000000006',
    '30000000-0000-0000-0000-000000000008',
    'Learning circle attendance dropped sharply',
    'education',
    'medium',
    'open',
    'Several girls have stopped coming after sunset because of lighting concerns.',
    'Need to speak with guardians and school committee.',
    timezone('utc', now()) + interval '6 days',
    '20000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000002',
    timezone('utc', now()) - interval '4 days'
  )
on conflict (id) do nothing;

insert into public.visits (
  id, contact_id, visited_by, visited_at, village, panchayat, duration_mins, outcome, notes, latitude, longitude
)
values
  ('33000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '4 days', 'Sikandarpur', 'Sahariya', 45, 'Escort plan agreed', 'Family confirmed they can leave by 8:30 AM.', 25.7047, 85.4014),
  ('33000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '8 days', 'Naya Gaon', 'Rampur Khajuria', 30, 'Volunteer route updated', 'Aslam shared two alternate lanes for rainy days.', 25.7314, 85.4162),
  ('33000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', timezone('utc', now()) - interval '12 days', 'Jalalpur', 'Sahariya', 35, 'Repair need confirmed', 'Handpump handle is still broken.', 25.7095, 85.3927),
  ('33000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '19 days', 'Chandpur Basti', 'Basantpur', 40, 'Group concerns collected', 'Women asked for safer evening meeting space.', 25.7239, 85.4090),
  ('33000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '26 days', 'Khaira Tola', 'Chandpura', 50, 'Attendance issue surfaced', 'Parents mentioned fear of dark road after evening class.', 25.7473, 85.4474),
  ('33000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '34 days', 'Mahua Tola', 'Basantpur', 55, 'Field risk mapped', 'Ramesh marked the section where water first enters.', 25.7198, 85.4024),
  ('33000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000001', timezone('utc', now()) - interval '42 days', 'Betia East', 'Chandpura', 20, 'Transport support discussed', 'Fuel support needed if transport is activated.', 25.7418, 85.4382),
  ('33000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', timezone('utc', now()) - interval '67 days', 'Bishunpur', 'Rampur Khajuria', 60, 'Stock gap escalated', 'Children may miss the next cycle too if delivery is delayed.', 25.7353, 85.4288),
  ('33000000-0000-0000-0000-000000000009', null, '20000000-0000-0000-0000-000000000001', timezone('utc', now()) - interval '3 days', 'Mahua Tola', 'Basantpur', 70, 'Area walk complete', 'Visited the canal edge and met two families without scheduled check-ins.', 25.7189, 85.4019),
  ('33000000-0000-0000-0000-000000000010', null, '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '10 days', 'Sikandarpur', 'Sahariya', 65, 'Health route reviewed', 'Volunteer path is usable even after rainfall.', 25.7052, 85.4009)
on conflict (id) do nothing;

insert into public.interactions (id, contact_id, interaction_type, interacted_by, interacted_at, notes)
values
  ('34000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'call', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '5 days', 'Checked on rainwater movement near the canal.'),
  ('34000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'meeting', '20000000-0000-0000-0000-000000000002', timezone('utc', now()) - interval '19 days', 'Women’s group shared meeting space concern.'),
  ('34000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000004', 'call', '20000000-0000-0000-0000-000000000001', timezone('utc', now()) - interval '2 days', 'Followed up on nutrition stock delay.')
on conflict (id) do nothing;

insert into public.alerts (id, created_by, crisis_type, latitude, longitude, radius_km, status, triggered_at)
values
  ('35000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Flood', 25.7204, 85.4031, 3, 'closed', timezone('utc', now()) - interval '28 days'),
  ('35000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Medical Emergency', 25.7050, 85.4012, 2, 'triggered', timezone('utc', now()) - interval '14 hours')
on conflict (id) do nothing;

insert into public.alert_recipients (id, alert_id, contact_id, distance_m, notified_at, response, responded_at)
values
  ('36000000-0000-0000-0000-000000000001', '35000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 140, timezone('utc', now()) - interval '28 days', 'Reached by phone and moved grain sacks to higher room.', timezone('utc', now()) - interval '28 days' + interval '25 minutes'),
  ('36000000-0000-0000-0000-000000000002', '35000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 860, timezone('utc', now()) - interval '28 days', 'Helped share warning across Naya Gaon.', timezone('utc', now()) - interval '28 days' + interval '32 minutes'),
  ('36000000-0000-0000-0000-000000000003', '35000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000006', 52, timezone('utc', now()) - interval '14 hours', 'Accompanied family to clinic.', timezone('utc', now()) - interval '13 hours 30 minutes'),
  ('36000000-0000-0000-0000-000000000004', '35000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000005', 1020, timezone('utc', now()) - interval '14 hours', 'Kept road access open for vehicle.', timezone('utc', now()) - interval '13 hours 10 minutes')
on conflict (id) do nothing;

insert into public.access_requests (id, name, organization, phone, email, district, notes)
values
  ('37000000-0000-0000-0000-000000000001', 'Priyanka Singh', 'Jeevika cluster team', '+91 93456 70001', 'priyanka@example.org', 'Muzaffarpur', 'Looking for a pilot with four field staff.')
on conflict (id) do nothing;

insert into public.contact_messages (id, name, email, phone, message)
values
  ('38000000-0000-0000-0000-000000000001', 'Akhilesh Kumar', 'akhilesh@example.org', '+91 93456 70002', 'We are mapping village visits manually and want to understand whether Khidkee can fit our block-level team.')
on conflict (id) do nothing;
