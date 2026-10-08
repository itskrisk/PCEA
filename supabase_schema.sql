-- ====================================================================
-- PCEA KILELESHWA — UNIFIED SUPABASE SCHEMA (PUBLIC + INTERNAL RMS)
-- Run this in the Supabase SQL Editor to initialize the database.
-- ====================================================================

-- ────────────────────────────────────────────────────────────────────
-- 1. PUBLIC SUBMISSION TABLES (Front Door Forms)
-- ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  request TEXT NOT NULL,
  privacy TEXT NOT NULL CHECK (privacy IN ('pastor_only', 'prayer_cell')),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'in_prayer', 'archived')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.feedback_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  category TEXT NOT NULL CHECK (category IN ('service', 'committee', 'general', 'facilities')),
  feedback TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'reviewed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  event_name TEXT NOT NULL,
  attendees_count INT DEFAULT 1 NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ministry_interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  committee_name TEXT NOT NULL,
  skills_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'placed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.testimonies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  title TEXT,
  testimony TEXT NOT NULL,
  can_publish BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'archived')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.giving_pledges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  purpose TEXT NOT NULL,
  amount TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sermon_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL,
  sermon_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ────────────────────────────────────────────────────────────────────
-- 2. INSTITUTIONAL RECORDS MANAGEMENT SYSTEM (RMS) TABLES
-- ────────────────────────────────────────────────────────────────────

-- Authorized Officials with Passcodes & Term Bindings
CREATE TABLE IF NOT EXISTS public.officials (
  id TEXT PRIMARY KEY,
  passcode TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('system_admin', 'parish_minister', 'lcc_executive', 'finance_committee', 'committee_secretary')),
  committee_code TEXT,
  term_range TEXT NOT NULL,
  term_end_date TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- The 22 Committees
CREATE TABLE IF NOT EXISTS public.committees (
  code TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Fellowship', 'Mission', 'Worship', 'Governance')),
  chairperson TEXT NOT NULL,
  secretary TEXT NOT NULL,
  term_period TEXT NOT NULL,
  records_count INT DEFAULT 0,
  last_report_month TEXT,
  report_status TEXT DEFAULT 'pending',
  active_projects JSONB DEFAULT '[]'::jsonb
);

-- Official Church Documents Repository (2015-2026+)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  committee_code TEXT NOT NULL,
  committee_name TEXT NOT NULL,
  year INT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Minutes', 'Monthly Report', 'Annual Report', 'Finance', 'Policy', 'Handover')),
  file_name TEXT NOT NULL,
  file_size TEXT DEFAULT '1.2 MB',
  date_filed DATE DEFAULT CURRENT_DATE,
  filed_by TEXT NOT NULL,
  is_restricted BOOLEAN DEFAULT false,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Monthly Committee Reports to LCC
CREATE TABLE IF NOT EXISTS public.monthly_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  committee_code TEXT NOT NULL,
  committee_name TEXT NOT NULL,
  month_year TEXT NOT NULL,
  submitted_by TEXT NOT NULL,
  submission_date DATE DEFAULT CURRENT_DATE,
  attendance_avg INT DEFAULT 0,
  key_activities TEXT NOT NULL,
  challenges TEXT,
  budget_spent_kes NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Pending LCC Review' CHECK (status IN ('Reviewed by LCC', 'Pending LCC Review', 'Action Required')),
  lcc_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Triennial Handover Dossiers (3-Year Term Continuity)
CREATE TABLE IF NOT EXISTS public.handovers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  committee_code TEXT NOT NULL,
  committee_name TEXT NOT NULL,
  term_ending TEXT NOT NULL,
  outgoing_official TEXT NOT NULL,
  incoming_official TEXT NOT NULL,
  submission_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Pending Session Signoff' CHECK (status IN ('Completed & Signed', 'Pending Session Signoff', 'Draft')),
  inventory_summary TEXT NOT NULL,
  pending_tasks TEXT,
  records_transferred_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Immutable Audit Log
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_name TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL
);

-- ────────────────────────────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ────────────────────────────────────────────────────────────────────

ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giving_pledges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermon_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Anonymous public inserts for front door forms:
CREATE POLICY "Public insert prayer_requests" ON public.prayer_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert feedback_submissions" ON public.feedback_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert event_registrations" ON public.event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert ministry_interests" ON public.ministry_interests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert testimonies" ON public.testimonies FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert newsletter_subscribers" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert giving_pledges" ON public.giving_pledges FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert sermon_requests" ON public.sermon_requests FOR INSERT WITH CHECK (true);

-- Read access on public tables for church administrative dashboard:
CREATE POLICY "Allow read on prayer_requests" ON public.prayer_requests FOR SELECT USING (true);
CREATE POLICY "Allow update on prayer_requests" ON public.prayer_requests FOR UPDATE USING (true);
CREATE POLICY "Allow read on contact_messages" ON public.contact_messages FOR SELECT USING (true);
CREATE POLICY "Allow read on feedback_submissions" ON public.feedback_submissions FOR SELECT USING (true);
CREATE POLICY "Allow read on event_registrations" ON public.event_registrations FOR SELECT USING (true);
CREATE POLICY "Allow read on ministry_interests" ON public.ministry_interests FOR SELECT USING (true);
CREATE POLICY "Allow read on testimonies" ON public.testimonies FOR SELECT USING (true);
CREATE POLICY "Allow read on giving_pledges" ON public.giving_pledges FOR SELECT USING (true);

-- RMS Policies:
CREATE POLICY "Allow read on officials" ON public.officials FOR SELECT USING (true);
CREATE POLICY "Allow all on committees" ON public.committees FOR ALL USING (true);
CREATE POLICY "Allow all on documents" ON public.documents FOR ALL USING (true);
CREATE POLICY "Allow all on monthly_reports" ON public.monthly_reports FOR ALL USING (true);
CREATE POLICY "Allow all on handovers" ON public.handovers FOR ALL USING (true);
CREATE POLICY "Allow all on audit_logs" ON public.audit_logs FOR ALL USING (true);
