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

