# PCEA Kileleshwa — System Integration Blueprint
## Connecting the Public Front Door to the Central Institutional Records Management System (RMS)

---

## 1. Executive Architecture: Two Worlds, One Codebase

The public website we built is the **front door**. It establishes the public face, welcomes worshippers, and provides zero-login forms. 

The internal system is the **institutional vault**: a church-owned, role-based records repository designed to survive 3-year term turnovers and eliminate 9 years of lost documentation.

Both systems coexist seamlessly in the existing **Vite + React + TypeScript + Supabase** codebase:

```
                            PCEA KILELESHWA WEB PLATFORM
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        ▼                                                                 ▼
   PUBLIC ZONE                                                      ADMIN / RMS ZONE
(No login required)                                              (Supabase Auth + RLS)
        │                                                                 │
  • / (Home)                                                       • /admin/login
  • /about (History, Beliefs, 22 Committees)                       • /admin/dashboard
  • /connect (All 9 public forms)                                  • /admin/committees/:id
  • /gallery (Photographic Archive)                                • /admin/lcc
  • /contact (Secretariat, Office hours)                           • /admin/finance (Restricted)
        │                                                          • /admin/records (Repository)
        │ (Public Submissions via RLS)                             • /admin/templates
        ▼                                                          • /admin/inbox (Triage forms)
┌─────────────────────────────────────────────────────────────┐    • /admin/users (Term assignments)
│                SUPABASE BACKEND (PostgreSQL + RLS)          │    • /admin/handover (Continuity)
│                                                             │◄───• /admin/audit (Immutable logs)
│ • Public Tables: prayer_requests, contact_messages, etc.    │
│ • RMS Tables: committees, meetings, reports, documents      │
│ • Storage Buckets: official-records, handover-archives      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure Evolution

We expand our current `src/` directory without disrupting the existing public pages or components:

```
c:\Users\Administrator\OneDrive\Desktop\pcea\
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── supabase_schema.sql             # SQL schema for all public & RMS tables
├── RECORDS_SYSTEM_INTEGRATION.md   # This architecture blueprint
└── src/
    ├── main.tsx                    # Vite entry point
    ├── App.tsx                     # Router (routes public + /admin/*)
    ├── index.css                   # Global CSS & editorial tokens
    │
    ├── types/
    │   ├── forms.ts                # Public forms payloads (already created)
    │   └── rms.ts                  # RMS types: Committees, Roles, Terms, Reports, Docs
    │
    ├── lib/
    │   ├── supabase.ts             # Supabase client & submission helpers
    │   ├── auth.ts                 # Auth session helper & role checking
    │   └── audit.ts                # Audit logging engine
    │
    ├── components/                 # Shared & Public components
    │   ├── Navbar.tsx              # Clean public navbar (already refined)
    │   ├── Footer.tsx              # Public footer with inline newsletter
    │   └── MotionSection.tsx       # Scroll reveal primitive
    │
    ├── pages/                      # Public Front Door Pages
    │   ├── HomePage.tsx            # Sanctuary hero, Sunday bento, numbers
    │   ├── AboutPage.tsx           # History, leadership, 22 committees
    │   ├── ConnectPage.tsx         # Unified single forms hub
    │   ├── GalleryPage.tsx         # Photographic archive & lightbox
    │   └── ContactPage.tsx         # Secretariat & map
    │
    └── admin/                      # ── INTERNAL RECORDS REPOSITORY (RMS) ──
        ├── components/
        │   ├── AdminLayout.tsx     # Sidebar, topbar, active user profile
        │   ├── AdminSidebar.tsx    # 9-section navigation mapping to core features
        │   ├── ProtectedRoute.tsx  # Auth guard & Role-Based Access Control (RBAC)
        │   └── TermIndicator.tsx   # Banner showing active official term (e.g. 2024-2027)
        │
        └── pages/
            ├── AdminLoginPage.tsx      # Secure official login (/admin/login)
            ├── DashboardPage.tsx       # Action center, deadlines, pending reports
            ├── CommitteeSpacePage.tsx  # Workspace for each of the 22 committees
            ├── LCCModulePage.tsx       # LCC governance, submitted reports, decisions
            ├── FinanceModulePage.tsx   # Restricted financial budgets & audit reports
            ├── RecordsRepositoryPage.tsx # Master document filing & search
            ├── TemplatesPage.tsx       # Standard agreed church templates
            ├── PublicInboxPage.tsx     # Review public prayer requests, RSVPs, etc.
            ├── UserAccessPage.tsx      # Role management & 3-year term bindings
            ├── HandoverPage.tsx        # Handover report filing & access transfer
            └── AuditLogPage.tsx        # Immutable record of every system action
```

---

## 3. The Access & Role Model: Anchored to Terms, Not People

### The Core Principle
An individual is never granted permanent personal access. Access is tied to an **active official role** within an **official 3-year term**. When the term expires, access transfers to the incoming official; **the records remain in the church vault**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ROLE HIERARCHY MATRIX                            │
├───────────────────┬──────────────┬───────────────┬──────────────────────────┤
│ Role              │ Scope        │ Permissions   │ Primary Modules          │
├───────────────────┼──────────────┼───────────────┼──────────────────────────┤
│ System Admin      │ Church-wide  │ Full / Config │ System, Audit, Users     │
│ Parish Minister   │ Church-wide  │ All + Pastoral│ All Modules + Private PR │
│ LCC Executive     │ Church-wide  │ Read/Approve  │ LCC, Reports, Decisions  │
│ Finance Committee │ Restricted   │ Finance Only  │ Finance, Budgets, Audits │
│ Committee Chair   │ 1 Committee  │ Lead & Sign   │ Committee Workspace      │
│ Committee Sec     │ 1 Committee  │ Minutes/File  │ Committee Workspace      │
│ Committee Member  │ 1 Committee  │ Read & Review │ Committee Workspace      │
└───────────────────┴──────────────┴───────────────┴──────────────────────────┘
```

---

## 4. The Data Model (Database Schema Extensions)

Building upon [`supabase_schema.sql`](file:///c:/Users/Administrator/OneDrive/Desktop/pcea/supabase_schema.sql), the following tables power the institutional repository:

### 1. `roles` & `user_profiles`
Links Supabase authenticated users (`auth.users`) to church identities.
- `id` (UUID, references auth.users)
- `full_name`, `phone`, `email`
- `is_active` (boolean)

### 2. `committees` (The 22 Ministry Arms)
Pre-seeded with all 22 official committees (Woman's Guild, Men's Fellowship, Youth, etc.).
- `id` (UUID), `code` (e.g. 'COM-01' through 'COM-22')
- `name` (TEXT), `category` ('Fellowship' | 'Mission' | 'Worship' | 'Governance')
- `current_chair_id`, `current_secretary_id`

### 3. `committee_terms` (The Continuity Engine)
Enforces the 3-year turnover cycle.
- `id` (UUID)
- `committee_id` (UUID, references committees)
- `user_id` (UUID, references user_profiles)
- `role` ('chairperson' | 'secretary' | 'treasurer' | 'member')
- `term_start_date` (DATE), `term_end_date` (DATE)
- `status` ('active' | 'completed' | 'transferred')

### 4. `documents` (The Central Repository)
Permanent home for every official file. Never deleted.
- `id` (UUID)
- `committee_id` (UUID, NULL for church-wide LCC records)
- `year` (INT, e.g. 2026)
- `category` ('minutes' | 'monthly_report' | 'annual_report' | 'correspondence' | 'finance')
- `title` (TEXT)
- `file_url` (TEXT, Supabase Storage path)
- `file_name` (TEXT, strictly adhering to naming convention)
- `version` (INT DEFAULT 1)
- `uploaded_by` (UUID)
- `is_archived` (BOOLEAN DEFAULT false)
- `created_at` (TIMESTAMPTZ)

### 5. `meetings` & `minutes`
- `id` (UUID), `committee_id` (UUID), `meeting_date` (TIMESTAMPTZ)
- `agenda` (JSONB)
- `minutes_body` (TEXT)
- `action_points` (JSONB: who, what, deadline)
- `status` ('draft' | 'approved_by_chair' | 'filed')

### 6. `monthly_reports` (The Reporting Loop)
Standardized monthly report submitted from Committee to LCC.
- `id` (UUID), `committee_id` (UUID), `month` (INT), `year` (INT)
- `activities_summary` (TEXT), `challenges` (TEXT), `planned_activities` (TEXT)
- `financial_summary` (NUMERIC)
- `status` ('draft' | 'submitted_to_lcc' | 'reviewed' | 'action_required')
- `submitted_at` (TIMESTAMPTZ)

### 7. `handover_reports` (The 3-Year Transfer Shield)
Mandatory report filed by outgoing officials before access moves.
- `id` (UUID), `committee_id` (UUID), `term_year_end` (INT)
- `outgoing_official_id` (UUID), `incoming_official_id` (UUID)
- `assets_inventory` (TEXT), `key_achievements` (TEXT), `pending_matters` (TEXT)
- `attached_files` (TEXT[])
- `signed_off_by_session_clerk` (BOOLEAN DEFAULT false)

### 8. `audit_logs` (Immutable Non-Deletion Log)
- `id` (UUID), `user_id` (UUID), `action` ('UPLOAD' | 'EDIT' | 'ARCHIVE' | 'HANDOVER' | 'LOGIN')
- `entity_type` ('document' | 'report' | 'user_term')
- `entity_id` (UUID)
- `details` (JSONB)
- `created_at` (TIMESTAMPTZ)

---

## 5. The Three Core Loops: How It Works in Code

### Loop 1: The Governance Loop (Report → LCC Review → Decision)
```
1. Committee Secretary logs in at /admin/login
2. Opens /admin/committees/COM-01/reports/new
3. Loads pre-filled "Standard Monthly Report Template"
4. Fills activities, numbers, challenges and clicks "Submit to LCC"
5. Notification dispatched to LCC Executive
6. LCC members log in, see combined dashboard of all 22 monthly reports
7. Decisions/recommendations recorded directly in LCC minutes table
```

### Loop 2: The Permanent Records Loop (Upload → Categorized Filing → Permanent Search)
```
1. Official uploads a document (e.g. Woman's Guild AGM Minutes)
2. System auto-enforces naming: [YEAR]_[COM-CODE]_[CATEGORY]_[TITLE].pdf
   Example: 2026_COM01_MINUTES_AGM_2026.pdf
3. File saved to Supabase Storage: /records/2026/COM-01/minutes/
4. Record entered into `documents` table with searchable metadata
5. Document is immediately accessible to authorized successors forever
```

### Loop 3: The Continuity Loop (Term Ends → Handover → Access Shifts → Records Retained)
```
1. System detects term approaching completion (e.g., Month 34 of 36)
2. Generates automated alert: "Handover Report Required for 2024-2027 Term"
3. Outgoing Chairperson fills the standardized Handover Form
4. Session Clerk / LCC Admin reviews and approves the handover record
5. Admin assigns incoming Chairperson to the new Term record
6. Outgoing account transitions to "alumni/read-only" or deactivated
7. Incoming Chairperson logs in and instantly has access to all 9+ years of archives
```

---

## 6. Integrating the Public Front Door with the Admin Inbox

Every one of the 9 public forms built on the front door flows directly into the admin system:

```
PUBLIC FRONT DOOR (/connect)                 ADMIN INBOX (/admin/inbox)
─────────────────────────────────────────────────────────────────────────────
• Prayer Request (Pastor Only)    ──► Routed exclusively to Parish Minister
• Prayer Request (Prayer Cell)    ──► Routed to Committee #16 (Prayer Ministry)
• Volunteer / Ministry Interest   ──► Routed to the specific Committee Chair (1-22)
• Event Registration / RSVP       ──► Routed to Event Organizing Secretary
• Feedback & Suggestions          ──► Routed to LCC Executive Review Queue
• Testimony & Story Submission    ──► Routed to Committee #18 (Communications)
• Giving & Pledge Enquiry         ──► Routed strictly to Finance Committee & Treasurer
• Sermon & Teaching Request       ──► Routed to Media / Library Desk
• Weekly Newsletter Signup        ──► Added to Broadcast Distribution List
```

---

## 7. Phased Implementation Roadmap

### Phase 1: Authentication & Role Guard (Foundation)
- Add Supabase Auth email/password login at `/admin/login`.
- Build `ProtectedRoute.tsx` and role-checking helpers in `src/lib/auth.ts`.
- Create `AdminLayout.tsx` with high-contrast, clean editorial sidebar navigation.

### Phase 2: The Central Records Repository (The Core Problem)
- Build `/admin/records`: Document upload with strict naming convention enforcement.
- Integrated search by Year (2015–2026+), Committee (1–22), and Document Category.
- Direct integration with Supabase Storage buckets.

### Phase 3: Committee Workspaces & Reporting (The Governance Loop)
- Implement `/admin/committees/:id`: Dedicated workspace for each of the 22 committees.
- Built-in standardized document templates: Monthly Report, Agenda, Minutes.
- Committee submission pipeline linking to `/admin/lcc`.

### Phase 4: The Handover Module (The 3-Year Turnover Shield)
- Implement `/admin/handover`: Digital handover checklist and inventory report.
- Automated term-expiry notifications.
- One-click access transfer: incoming official assigned, outgoing access retired, records unmoved.

### Phase 5: Finance & Security Hardening
- Implement restricted `/admin/finance` module visible only to Finance Committee & Ministers.
- Full immutable `/admin/audit` logging every file view, upload, and permission shift.
- Periodic automated database and document storage backup.

---

## 8. Summary: What Success Looks Like

If an elder who served in 2018 logs out, and a new elder elected in 2027 logs in, and within **two clicks** can locate the 2018 AGM minutes, the building fund audit, and the complete pastoral history without asking anyone on WhatsApp:

**The system has done its job.**
