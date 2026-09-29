-- testhem opt-in public mark wall.
-- Run this migration once in Supabase SQL Editor after the online-room schema.
-- Names and marks are public only after the visitor submits the form and checks consent.

create table if not exists public.testhem_marks (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 24),
  mark text not null check (char_length(btrim(mark)) between 1 and 180),
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.testhem_marks add column if not exists consented_at timestamptz not null default now();

create index if not exists testhem_marks_created_at_idx
  on public.testhem_marks (created_at desc);
create index if not exists testhem_marks_visitor_created_at_idx
  on public.testhem_marks (visitor_id, created_at desc);

alter table public.testhem_marks enable row level security;
revoke all on public.testhem_marks from public, anon, authenticated;

create or replace function public.testhem_get_marks(p_limit integer default 40)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'marks', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', recent.id,
          'display_name', recent.display_name,
          'mark', recent.mark,
          'created_at', recent.created_at
        ) order by recent.created_at desc
      ),
      '[]'::jsonb
    )
  )
  from (
    select id, display_name, mark, created_at
    from public.testhem_marks
    order by created_at desc
    limit least(greatest(coalesce(p_limit, 40), 1), 60)
  ) as recent;
$$;

drop function if exists public.testhem_leave_mark(uuid, text, text, text);

create or replace function public.testhem_leave_mark(
  p_visitor_id uuid,
  p_display_name text,
  p_mark text,
  p_consent boolean,
  p_website text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := btrim(regexp_replace(coalesce(p_display_name, ''), '[[:cntrl:]]', ' ', 'g'));
  v_mark text := btrim(regexp_replace(coalesce(p_mark, ''), '[[:cntrl:]]', ' ', 'g'));
  v_recent_count integer;
  v_id uuid;
begin
  if p_consent is distinct from true then
    raise exception 'Public consent is required before a mark can be posted.';
  end if;
  -- Bot honeypot. Legitimate clients always send this as an empty string.
  if coalesce(btrim(p_website), '') <> '' then
    raise exception 'Unable to accept this mark.';
  end if;
  if p_visitor_id is null then raise exception 'Refresh the page and try again.'; end if;
  if char_length(v_name) < 1 or char_length(v_name) > 24 then
    raise exception 'Display names must be 1–24 characters.';
  end if;
  if char_length(v_mark) < 1 or char_length(v_mark) > 180 then
    raise exception 'Marks must be 1–180 characters.';
  end if;

  -- Lightweight abuse guard, not an identity system: five posts per browser token/hour.
  select count(*) into v_recent_count
  from public.testhem_marks
  where visitor_id = p_visitor_id
    and created_at > now() - interval '1 hour';
  if v_recent_count >= 5 then
    raise exception 'This browser has left its hourly limit. Please try again later.';
  end if;

  insert into public.testhem_marks(visitor_id, display_name, mark)
  values (p_visitor_id, v_name, v_mark)
  returning id into v_id;

  return jsonb_build_object('ok', true, 'id', v_id);
end;
$$;

revoke all on function public.testhem_get_marks(integer) from public, anon, authenticated;
revoke all on function public.testhem_leave_mark(uuid, text, text, boolean, text) from public, anon, authenticated;
grant execute on function public.testhem_get_marks(integer) to anon, authenticated;
grant execute on function public.testhem_leave_mark(uuid, text, text, boolean, text) to anon, authenticated;
