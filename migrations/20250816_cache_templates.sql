-- PLAN & LESSON TEMPLATES (shared across users)
create table if not exists public.plan_template (
  id uuid primary key default gen_random_uuid(),
  signature text not null,                        -- normalized key for reuse
  topic text not null,
  focus text,
  level text,                                     -- beginner/intermediate/etc
  minutes_per_day int,
  locale text default 'en',
  version int default 1,                          -- bump to force new template
  source text default 'rag',                      -- provenance hint
  plan_json jsonb not null,
  created_at timestamptz not null default now(),
  unique(signature, version)
);

create index if not exists plan_template_signature_idx
  on public.plan_template (signature);

create table if not exists public.lesson_template (
  id uuid primary key default gen_random_uuid(),
  plan_template_id uuid not null references public.plan_template(id) on delete cascade,
  day_index int not null,                         -- 0-based index for day in plan
  version int default 1,                          -- bump independent of plan if needed
  model text,                                     -- model that generated the lesson
  lesson_json jsonb not null,                     -- entire rendered lesson object
  created_at timestamptz not null default now(),
  unique(plan_template_id, day_index, version)
);

create index if not exists lesson_template_plan_day_idx
  on public.lesson_template (plan_template_id, day_index);

-- Link user goals -> plan_template
alter table public.learning_goals
  add column if not exists plan_template_id uuid references public.plan_template(id);

-- Optional: denormalized progress % cache (nullable)
alter table public.learning_goals
  add column if not exists progress_pct real;

-- Add missing profile columns for the caching system
alter table public.profiles
  add column if not exists level text default 'beginner',
  add column if not exists minutes_per_day int default 30,
  add column if not exists tz text default 'en';

-- SIGNATURE helper: store canonical text that we also compute in app
create or replace function public.normalize_goal_signature(
  p_topic text, p_focus text, p_level text, p_minutes_per_day int, p_locale text, p_version int
) returns text language sql immutable as $$
  select encode(
    digest(
      lower(coalesce(p_topic,'')) || '|' ||
      lower(coalesce(p_focus,'')) || '|' ||
      lower(coalesce(p_level,'')) || '|' ||
      coalesce(p_minutes_per_day,0)::text || '|' ||
      lower(coalesce(p_locale,'en')) || '|' ||
      coalesce(p_version,1)::text,
      'sha256'
    ),
    'hex'
  );
$$;

-- RLS: templates readable by any authenticated user; inserts by authenticated
alter table public.plan_template enable row level security;
alter table public.lesson_template enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='plan_template' and policyname='plan_template_read'
  ) then
    create policy plan_template_read on public.plan_template
      for select using (auth.uid() is not null);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='plan_template' and policyname='plan_template_write'
  ) then
    create policy plan_template_write on public.plan_template
      for insert with check (auth.uid() is not null);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='lesson_template' and policyname='lesson_template_read'
  ) then
    create policy plan_template_read on public.lesson_template
      for select using (auth.uid() is not null);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='lesson_template' and policyname='lesson_template_write'
  ) then
    create policy plan_template_write on public.lesson_template
      for insert with check (auth.uid() is not null);
  end if;
end $$;

-- Backfill existing goals as templates (idempotent)
insert into public.plan_template (signature, topic, focus, level, minutes_per_day, locale, version, plan_json)
select distinct
  public.normalize_goal_signature(g.topic, g.focus, p.level, p.minutes_per_day, coalesce(p.tz,'en'), coalesce(g.plan_version,1)) as signature,
  g.topic, g.focus, p.level, p.minutes_per_day, coalesce(p.tz,'en'), coalesce(g.plan_version,1),
  g.plan_json
from public.learning_goals g
join public.profiles p on p.id = g.user_id
where g.plan_json is not null
on conflict do nothing;

update public.learning_goals lg
set plan_template_id = pt.id
from public.plan_template pt
where lg.plan_template_id is null
  and pt.signature = public.normalize_goal_signature(lg.topic, lg.focus,
      (select level from public.profiles p where p.id = lg.user_id),
      (select minutes_per_day from public.profiles p where p.id = lg.user_id),
      (select tz from public.profiles p where p.id = lg.user_id),
      coalesce(lg.plan_version,1));

-- Notes:
-- * Templates contain NO user_id. They are shared, generic plan/lesson blueprints.
-- * Privacy-safe: only content; no PII.
-- * Bump plan_template.version to intentionally invalidate cache for a signature.
-- * lesson_template.version allows per-day regeneration without touching plan version.
