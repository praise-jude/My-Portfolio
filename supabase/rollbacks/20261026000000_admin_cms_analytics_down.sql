-- Rollback for 20261026000000_admin_cms_analytics.sql
--
-- WARNING: this permanently deletes every project, content edit, analytics
-- event and audit entry created after the upgrade. Export anything you need
-- first (Admin → Analytics → Export CSV, or Supabase → Table editor → Export).
--
-- The original contact_submissions table and its rows are kept. The three
-- optional columns added to it are left in place by default because dropping
-- them deletes the subject / read / archived data; uncomment to remove them.

drop function if exists public.analytics_totals();
drop function if exists public.track_pageview(text, text, text, text, text, text, uuid, uuid, text, text);
drop function if exists public.rate_limit_hit(text, integer, integer);

drop table if exists public.rate_limits;
drop table if exists public.audit_log;
drop table if exists public.analytics_events;
drop table if exists public.site_content;

drop trigger if exists projects_set_updated_at on public.projects;
drop table if exists public.projects;
drop function if exists public.set_updated_at();

drop index if exists public.contact_submissions_created_at_idx;
-- alter table public.contact_submissions drop column if exists subject;
-- alter table public.contact_submissions drop column if exists read_at;
-- alter table public.contact_submissions drop column if exists archived_at;
