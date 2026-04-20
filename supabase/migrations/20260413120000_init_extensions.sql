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

