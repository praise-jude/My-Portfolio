# Admin dashboard, CMS & analytics

This site has a private admin area at **`/admin`** for editing content, managing
the project portfolio, reading contact messages, and viewing first-party
visitor analytics. Everything runs on the existing stack: Next.js on Vercel and
Supabase (Postgres + Auth). No new services are required.

## 1. One-time setup

### 1.1 Make sure the Supabase project is running

Free-tier Supabase projects pause after a period of inactivity. If the site's
contact form fails, or `/admin/settings` shows the database as unreachable,
open the project in the [Supabase dashboard](https://supabase.com/dashboard)
and click **Restore project**.

### 1.2 Apply the database migration

Open **Supabase → SQL Editor → New query**, paste the whole of
`supabase/migrations/20261026000000_admin_cms_analytics.sql`, and click **Run**.

The migration is additive and idempotent. It:

- adds optional `subject`, `read_at`, and `archived_at` columns to `contact_submissions` (existing rows are untouched);
- creates `projects`, `site_content`, `analytics_events`, `audit_log`, and `rate_limits`;
- creates the `rate_limit_hit`, `track_pageview`, and `analytics_totals` functions;
- enables RLS on every new table, with no public policies, so only the server's secret key can access them;
- seeds the nine portfolio projects. A slug that already exists is skipped.

It never drops or rewrites existing data, so it's safe to run again.

(Alternatively, with the Supabase CLI linked to the project: `supabase db push`.)

### 1.3 Create the administrator account

There is no public sign-up for admins. Do the following:

1. In **Supabase → Authentication → Sign In / Providers → Email**, turn **off**
   "Allow new users to sign up". This is recommended: the allowlist below already
   blocks other accounts, and this removes the sign-up surface entirely.
2. In **Authentication → Users → Add user → Create new user**, enter your email
   and a strong, unique password, and tick **Auto Confirm User**.
3. Add that email to `ADMIN_EMAILS` (step 1.4).

An account gets admin access only if **both** of these are true:

- its email is in `ADMIN_EMAILS`;
- Supabase has confirmed the email.

The check runs on the server for every admin page, server action, and API.

To add a second admin, create their user in step 2 and append their email:
`ADMIN_EMAILS=you@example.com,partner@example.com`. To remove access, delete the
email from the list and redeploy (or delete the user in Supabase).

### 1.4 Environment variables

Set these in **Vercel → Project → Settings → Environment Variables**
(Production and Preview), and in `.env.local` for local development.
`.env.example` lists them all.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes (existing) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes (existing) | Publishable key, used for auth and contact inserts |
| `SUPABASE_SECRET_KEY` | **yes** | Server-only key for admin data, CMS, and analytics. Never prefix with `NEXT_PUBLIC_`. |
| `ADMIN_EMAILS` | **yes** (new) | Comma-separated admin allowlist |
| `HASH_SALT` | recommended (new) | Random secret for hashing IPs used as rate-limit keys |
| `SITE_TIMEZONE` | optional (new) | Timezone for "today" and the charts. Default `Africa/Lagos`. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | optional | Email notifications for new messages |

After changing variables in Vercel, redeploy so they take effect.

## 2. Using the dashboard

| Section | What it does |
| --- | --- |
| **Dashboard** | Summary cards, a traffic chart, top pages, sources, devices, countries, latest messages, recent admin activity |
| **Projects** | Create, edit, preview, publish/unpublish, feature, reorder, archive, restore, and permanently delete archived projects. Includes search, sort, and pagination. |
| **Pages & Content** | Hero, About, Work With Me, interests, skills, journey, contact details, social links. "Reset to default" restores the built-in text. |
| **Messages** | Contact form inbox with search; mark read or unread, archive (nothing is deleted), reply by email |
| **Analytics** | Date filters (today, 7, 30, 90 days, custom), landing pages, and CSV export |
| **SEO Settings** | Site title, description, and keywords, with a search-result preview |
| **Audit Log** | Sign-ins, failed sign-ins, and every change, with a filter by action |
| **Settings & Status** | Exclude this browser from analytics; environment and database health checks |

Saving anything regenerates the public pages immediately. Public pages also
refresh on their own at least every 5 minutes.

If the database is unreachable, the public site keeps working. It falls back to
the built-in content in `lib/content/defaults.ts` and `lib/projects/defaults.ts`.

### Images

Image fields take either an `https://` URL or a path to a file in `/public`
(for example, put `profile.jpg` in `/public` and enter `/profile.jpg`). Files in
`/public` are optimized automatically. Remote URLs are shown as-is, so the image
optimizer never fetches arbitrary third-party hosts.

## 3. Visitor analytics: how counting works

Tracking is first-party. There's no third-party script. `components/analytics/tracker.tsx`
sends one small beacon to `/api/track` per page view, including in-site navigation.

- **Page view:** one stored event. Repeat loads of the same path within 3 seconds are
  ignored, which also absorbs React Strict Mode's double effects in development.
- **Unique visitor:** a random UUID kept in the browser's `localStorage` (`jo_vid`). It's
  an estimate: one person on two browsers counts twice, and clearing site data starts a
  new visitor.
- **Session:** a random UUID (`jo_sid`) that expires after **30 minutes without a page
  view**.
- **Source and landing page:** taken from the first event of each session. The source is
  the campaign `utm_source` if present, otherwise the referring domain, otherwise
  "Direct / none". Self-referrals are dropped.
- **Device:** mobile, tablet, or desktop, derived from the User-Agent on the server.
  **Country** comes from Vercel's `x-vercel-ip-country` header. Both are counted once
  per visitor.
- **Active now:** distinct visitors with a page view in the last 5 minutes. It's an
  approximation, because there's no heartbeat.

**Not counted:**

- `/admin` and `/api` paths (rejected by both the tracker and the server);
- your own browser, via the `jo_no_track` cookie, set automatically when you sign in,
  or manually in Settings;
- bots, crawlers, and headless browsers;
- visitors whose browser sends Do Not Track or Global Privacy Control, or who opt out
  on `/privacy`.

**Privacy:** no IP addresses are stored. A salted, daily-rotating hash of the IP is used
only as a rate-limit key (60 events per minute per network) and is never written to
`analytics_events`. Payloads over 2 KB, cross-site requests, and malformed paths are
rejected.

There is **no historical data** from before the tracker was installed.

### How to verify the visitor counter

1. Open `/admin/settings` and check that every database row is green.
2. Open the public site in a **private/incognito window** (no admin cookie) and visit 3 pages.
3. In `/admin/settings`, "Last page view received" now shows the current time. In
   `/admin` (Today), page views are +3, visitors +1, and sessions +1.
4. Visit the site again in your normal, signed-in browser. The counts don't change.
5. Optional direct check in the Supabase SQL editor:
   `select path, device, country, created_at from analytics_events order by id desc limit 10;`

### GDPR note

The site sets no tracking cookies, and identifiers are anonymous. However, EU
ePrivacy rules can treat `localStorage` identifiers like cookies. If you
specifically target visitors in the EU or UK, consider adding a consent banner,
or drop the visitor ID and count sessions only.

## 4. Development & checks

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm test             # vitest: ingestion, auth, aggregation, validation
npm run build
```

## 5. Deployment

The site deploys on Vercel (project `jude-omini-ewah`) from this repository.

1. Apply the migration (1.2), create the admin user (1.3), and set the environment
   variables in Vercel (1.4).
2. Merge `feature/admin-dashboard-upgrade` into `main` and push. Vercel builds and
   deploys automatically. Alternatively, push the branch first to get a preview
   deployment and test it there.
3. Visit `https://www.jude-omini-ewah.com.ng/admin`, sign in, and work through
   section 3 ("How to verify the visitor counter").

DNS and hosting are unchanged.

## 6. Rollback

- **Code:** in Vercel → Deployments, pick the last deployment before the upgrade and
  click **Instant Rollback**. In git, the pre-upgrade state is the branch
  `backup/pre-admin-upgrade-2026-10-26` and the tag `pre-admin-upgrade-2026-10-26`
  (`git revert` the merge, or reset `main` to the tag).
- **Database:** the old code ignores the new tables and columns, so after a code
  rollback the database can stay as it is. To remove them completely, run
  `supabase/rollbacks/20261026000000_admin_cms_analytics_down.sql`. **This deletes all
  projects, content edits, analytics, and audit entries created since the upgrade**, so
  export what you need first. The original contact messages are kept.
- **Next.js upgrade (16.2.12 → 16.4.3):** it's isolated in its own commit, but rolling
  it back re-exposes the published security advisories, so it isn't recommended.
