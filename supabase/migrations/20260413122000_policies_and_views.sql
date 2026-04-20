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

