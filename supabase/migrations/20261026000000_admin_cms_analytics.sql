-- Admin dashboard, CMS and first-party analytics.
--
-- Additive and idempotent: it only creates new objects or adds nullable
-- columns, so it is safe to run more than once and never touches existing
-- rows. Rollback: supabase/rollbacks/20261026000000_admin_cms_analytics_down.sql
--
-- Every new table has RLS enabled with NO policies, and anon/authenticated
-- privileges are revoked: only the server (service role key) can read or
-- write them. Public visitors never talk to these tables directly.

-- ---------------------------------------------------------------------------
-- Contact submissions: optional new columns (existing rows are untouched)
-- ---------------------------------------------------------------------------
alter table public.contact_submissions
  add column if not exists subject text
    check (subject is null or char_length(subject) <= 200);
alter table public.contact_submissions
  add column if not exists read_at timestamptz;
alter table public.contact_submissions
  add column if not exists archived_at timestamptz;

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

-- ---------------------------------------------------------------------------
-- Projects / portfolio
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  name text not null check (char_length(name) between 1 and 120),
  tagline text check (tagline is null or char_length(tagline) <= 160),
  description text not null default '' check (char_length(description) <= 5000),
  category text check (category is null or char_length(category) <= 80),
  status text not null default 'in_development'
    check (status in ('live', 'in_development', 'planned', 'archived')),
  logo_url text check (logo_url is null or char_length(logo_url) <= 500),
  cover_url text check (cover_url is null or char_length(cover_url) <= 500),
  screenshots text[] not null default '{}',
  tech_stack text[] not null default '{}',
  website_url text check (website_url is null or char_length(website_url) <= 500),
  download_url text check (download_url is null or char_length(download_url) <= 500),
  featured boolean not null default false,
  display_order integer not null default 0,
  seo_title text check (seo_title is null or char_length(seo_title) <= 120),
  seo_description text check (seo_description is null or char_length(seo_description) <= 300),
  published boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_order_idx
  on public.projects (display_order, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Editable site content (one JSON document per section)
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  key text primary key check (key ~ '^[a-z_]{1,40}$'),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- ---------------------------------------------------------------------------
-- Analytics events (first-party, no IP addresses or personal data)
-- ---------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event_type text not null default 'pageview' check (event_type in ('pageview')),
  path text not null check (char_length(path) between 1 and 300),
  referrer_host text check (referrer_host is null or char_length(referrer_host) <= 255),
  utm_source text check (utm_source is null or char_length(utm_source) <= 100),
  utm_medium text check (utm_medium is null or char_length(utm_medium) <= 100),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 100),
  visitor_id uuid not null,
  session_id uuid not null,
  device text not null default 'unknown'
    check (device in ('mobile', 'tablet', 'desktop', 'unknown')),
  country text check (country is null or country ~ '^[A-Z]{2}$')
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);
create index if not exists analytics_events_visitor_idx
  on public.analytics_events (visitor_id, created_at);
create index if not exists analytics_events_session_idx
  on public.analytics_events (session_id, created_at);

-- ---------------------------------------------------------------------------
-- Audit log for sensitive admin actions
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  actor text not null check (char_length(actor) <= 320),
  action text not null check (char_length(action) <= 80),
  target_type text check (target_type is null or char_length(target_type) <= 40),
  target_id text check (target_id is null or char_length(target_id) <= 120),
  details jsonb not null default '{}'::jsonb
);

create index if not exists audit_log_created_at_idx
  on public.audit_log (created_at desc);

-- ---------------------------------------------------------------------------
-- Fixed-window rate limiting (keys are salted hashes, never raw IPs)
-- ---------------------------------------------------------------------------
create table if not exists public.rate_limits (
  key text not null check (char_length(key) <= 200),
  window_start timestamptz not null,
  hits integer not null default 0,
  primary key (key, window_start)
);

create or replace function public.rate_limit_hit(
  p_key text,
  p_window_seconds integer,
  p_max integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window timestamptz;
  v_hits integer;
begin
  v_window := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into public.rate_limits (key, window_start, hits)
  values (p_key, v_window, 1)
  on conflict (key, window_start)
    do update set hits = public.rate_limits.hits + 1
  returning hits into v_hits;

  -- Opportunistic cleanup keeps the table small without a cron job.
  if random() < 0.01 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return v_hits <= p_max;
end;
$$;

-- Rate limit + insert in a single round trip from the ingestion endpoint.
create or replace function public.track_pageview(
  p_rate_key text,
  p_path text,
  p_referrer_host text,
  p_utm_source text,
  p_utm_medium text,
  p_utm_campaign text,
  p_visitor_id uuid,
  p_session_id uuid,
  p_device text,
  p_country text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.rate_limit_hit(p_rate_key, 60, 60) then
    return false;
  end if;

  insert into public.analytics_events (
    path, referrer_host, utm_source, utm_medium, utm_campaign,
    visitor_id, session_id, device, country
  ) values (
    p_path, p_referrer_host, p_utm_source, p_utm_medium, p_utm_campaign,
    p_visitor_id, p_session_id, p_device, p_country
  );

  return true;
end;
$$;

create or replace function public.analytics_totals()
returns table (pageviews bigint, visitors bigint, sessions bigint)
language sql
stable
security definer
set search_path = public
as $$
  select count(*), count(distinct visitor_id), count(distinct session_id)
  from public.analytics_events;
$$;

-- ---------------------------------------------------------------------------
-- Lock everything down to the service role
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.site_content enable row level security;
alter table public.analytics_events enable row level security;
alter table public.audit_log enable row level security;
alter table public.rate_limits enable row level security;

revoke all on public.projects, public.site_content, public.analytics_events,
  public.audit_log, public.rate_limits from anon, authenticated;

revoke all on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.track_pageview(text, text, text, text, text, text, uuid, uuid, text, text) from public, anon, authenticated;
revoke all on function public.analytics_totals() from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, integer, integer) to service_role;
grant execute on function public.track_pageview(text, text, text, text, text, text, uuid, uuid, text, text) to service_role;
grant execute on function public.analytics_totals() to service_role;

-- ---------------------------------------------------------------------------
-- Seed the portfolio (skipped for any slug that already exists).
-- Statuses and URLs are conservative defaults — edit them in /admin/projects.
-- ---------------------------------------------------------------------------
insert into public.projects
  (slug, name, tagline, description, category, status, website_url, featured, display_order)
values
  ('inventra', 'Inventra', 'Retail Operations Platform',
   'Inventory management, stock control, sales, business operations, and reporting for businesses — real-time stock, supplier orders, and profit analytics in one workspace.',
   'Business Management', 'in_development', null, true, 1),
  ('fraudshield-ai', 'FraudShield AI', 'AI-Powered Trust & Risk Platform',
   'A fraud detection and anomaly-monitoring platform that scores transaction risk in real time, supports case management, and helps digital businesses act on suspicious activity.',
   'Security & AI', 'in_development', null, true, 2),
  ('forex-ai', 'Forex AI', 'AI Market Intelligence Platform',
   'An AI-assisted forex analysis and trading automation project that monitors markets, reasons across multiple timeframes, and only surfaces a signal when the setup lines up.',
   'Financial Technology', 'in_development', null, true, 3),
  ('royalman-digital-concepts', 'Royalman Digital Concepts', 'Digital business & technology brand',
   'My digital business and technology brand — the home for the products, services, and platforms I build.',
   'Brand', 'in_development', null, false, 4),
  ('royalman-cloud', 'Royalman Cloud', 'Domains, hosting & cloud',
   'A self-hosted infrastructure and hosting platform for domains, hosting, and cloud services.',
   'Cloud Infrastructure', 'in_development', 'https://royalmancloud.com', false, 5),
  ('wealthora', 'Wealthora', 'Digital wealth platform',
   'A digital wealth platform concept.',
   'Financial Technology', 'planned', null, false, 6),
  ('wealthorabet', 'WealthoraBet', 'Betting & digital services',
   'A betting and digital services platform.',
   'Digital Services', 'in_development', null, false, 7),
  ('vidora-ai', 'Vidora AI', 'AI video creation',
   'An AI video creation project.',
   'Artificial Intelligence', 'in_development', null, false, 8),
  ('royal-vpn', 'Royal-VPN', 'VPN product',
   'A VPN product.',
   'Security', 'in_development', null, false, 9)
on conflict (slug) do nothing;
