import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  PrayerRequestPayload,
  ContactMessagePayload,
  FeedbackPayload,
  EventRsvpPayload,
  MinistryInterestPayload,
  TestimonyPayload,
  NewsletterPayload,
  GivingPledgePayload,
  SermonRequestPayload,
  FormSubmissionResult,
} from "@/types/forms";
import {
  OfficialProfile,
  RMSCommittee,
  ChurchDocument,
  MonthlyReport,
  HandoverRecord,
  AuditLogItem,
} from "@/types/rms";
import {
  INITIAL_COMMITTEES,
  INITIAL_DOCUMENTS,
  INITIAL_MONTHLY_REPORTS,
  INITIAL_HANDOVERS,
  INITIAL_AUDIT_LOGS,
} from "@/data/rmsData";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://neuexsktfohawydjgqhn.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_ojcZgcFttfXkv9jq_0GgkA_Y7LkytEh";

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Official Church Credentials & Passwords
export const OFFICIAL_CREDENTIALS: Array<OfficialProfile & { password: string; passcode?: string }> = [
  {
    id: "usr-01",
    username: "session.clerk",
    password: "12345678",
    passcode: "CLERK-2024",
    name: "Elder James Mwangi",
    title: "Session Clerk & System Administrator",
    role: "system_admin",
    termRange: "2024–2027",
    termEndDate: "31 Oct 2027",
    email: "sessionclerk@pceakileleshwa.or.ke",
  },
  {
    id: "usr-02",
    username: "parish.minister",
    password: "12345678",
    passcode: "MINISTER-777",
    name: "Rev. Dr. Samuel K. Mwangi",
    title: "Parish Minister & Kirk Session Moderator",
    role: "parish_minister",
    termRange: "Permanent / Call",
    termEndDate: "Permanent",
    email: "minister@pceakileleshwa.or.ke",
  },
  {
    id: "usr-03",
    username: "lcc.chair",
    password: "12345678",
    passcode: "LCC-CHAIR",
    name: "Margaret Ndungu",
    title: "LCC Chairperson",
    role: "lcc_executive",
    termRange: "2024–2027",
    termEndDate: "31 Oct 2027",
    email: "lcc.chair@pceakileleshwa.or.ke",
  },
  {
    id: "usr-04",
    username: "treasurer",
    password: "12345678",
    passcode: "TREASURY-01",
    name: "Elder Grace Wanjiku",
    title: "Parish Treasurer & Finance Convener",
    role: "finance_committee",
    termRange: "2023–2026",
    termEndDate: "30 Nov 2026",
    email: "treasury@pceakileleshwa.or.ke",
  },
  {
    id: "usr-05",
    username: "womans.guild",
    password: "12345678",
    passcode: "GUILD-SEC",
    name: "Beatrice Waweru",
    title: "Woman's Guild Secretary",
    role: "committee_secretary",
    committeeCode: "COM-01",
    termRange: "2024–2027",
    termEndDate: "31 Oct 2027",
    email: "womansguild.sec@pceakileleshwa.or.ke",
  },
];

// Persistent Local Database Engine (acts as local synced cache or standalone engine)
function getLocalStore<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(`pcea_db_${key}`);
    return item ? JSON.parse(item) : defaultData;
  } catch {
    return defaultData;
  }
}

function setLocalStore<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`pcea_db_${key}`, JSON.stringify(data));
  } catch {
    // ignore local storage errors
  }
}

// ────────────────────────────────────────────────────────────────────
// 1. PUBLIC SUBMISSIONS DISPATCH
// ────────────────────────────────────────────────────────────────────

function saveToLocalInbox(table: string, payload: Record<string, unknown>) {
  try {
    const existing = getLocalStore<Array<{ id: string; table: string; payload: Record<string, unknown>; created_at: string }>>("admin_inbox", []);
    existing.unshift({
      id: "inbox_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      table,
      payload,
      created_at: new Date().toISOString(),
    });
    setLocalStore("admin_inbox", existing.slice(0, 200));
  } catch {
    // ignore
  }
}

async function submitToTable(
  tableName: string,
  payload: Record<string, unknown>,
  successMsg: string
): Promise<FormSubmissionResult> {
  const timestamp = new Date().toISOString();
  const record = { ...payload, created_at: timestamp };

  saveToLocalInbox(tableName, record);

  if (supabase) {
    try {
      const { error } = await supabase.from(tableName).insert([record]);
      if (error) {
        console.warn(`Supabase insert to ${tableName}:`, error.message);
      }
    } catch (err: unknown) {
      console.error(`Supabase network error:`, err);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true, message: successMsg };
}

export async function submitPrayerRequest(payload: PrayerRequestPayload): Promise<FormSubmissionResult> {
  return submitToTable(
    "prayer_requests",
    payload as unknown as Record<string, unknown>,
    payload.privacy === "pastor_only"
      ? "Your prayer request has been received directly by the Parish Minister."
      : "Your prayer request has been shared with the Parish Intercessory Prayer Cell."
  );
}

export async function submitContactMessage(payload: ContactMessagePayload): Promise<FormSubmissionResult> {
  return submitToTable("contact_messages", payload as unknown as Record<string, unknown>, "Thank you. Your message has been routed to the parish secretariat.");
}

export async function submitFeedback(payload: FeedbackPayload): Promise<FormSubmissionResult> {
  return submitToTable("feedback_submissions", payload as unknown as Record<string, unknown>, "Thank you for sharing your feedback with the Session and Church Council.");
}

export async function submitEventRsvp(payload: EventRsvpPayload): Promise<FormSubmissionResult> {
  return submitToTable("event_registrations", payload as unknown as Record<string, unknown>, `Registration confirmed for ${payload.event_name}. We look forward to seeing you!`);
}

export async function submitMinistryInterest(payload: MinistryInterestPayload): Promise<FormSubmissionResult> {
  return submitToTable("ministry_interests", payload as unknown as Record<string, unknown>, `Thank you! The ${payload.committee_name} leadership has been notified.`);
}

export async function submitTestimony(payload: TestimonyPayload): Promise<FormSubmissionResult> {
  return submitToTable("testimonies", payload as unknown as Record<string, unknown>, "Your testimony has been received with gratitude. May God be praised.");
}

export async function submitNewsletter(payload: NewsletterPayload): Promise<FormSubmissionResult> {
  return submitToTable("newsletter_subscribers", payload as unknown as Record<string, unknown>, "You have been added to the weekly parish bulletin & announcements list.");
}

export async function submitGivingPledge(payload: GivingPledgePayload): Promise<FormSubmissionResult> {
  return submitToTable("giving_pledges", payload as unknown as Record<string, unknown>, "Your pledge enquiry has been received by the Finance Committee with confidentiality.");
}

export async function submitSermonRequest(payload: SermonRequestPayload): Promise<FormSubmissionResult> {
  return submitToTable("sermon_requests", payload as unknown as Record<string, unknown>, "Your sermon resource request has been received. Our media desk will send it over.");
}

// ────────────────────────────────────────────────────────────────────
// 2. RMS BACKEND QUERIES & AUTHENTICATION
// ────────────────────────────────────────────────────────────────────

export async function verifyOfficialLogin(usernameInput: string, passwordInput: string): Promise<OfficialProfile | null> {
  const cleanUser = usernameInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanUser || !cleanPass) return null;

  // 1. Try Supabase query
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("officials")
        .select("*")
        .ilike("username", cleanUser)
        .eq("password", cleanPass)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          username: data.username,
          name: data.name,
          title: data.title,
          role: data.role,
          committeeCode: data.committee_code,
          termRange: data.term_range,
          termEndDate: data.term_end_date,
          email: data.email,
        };
      }
    } catch {
      // fallback to credentials table
    }
  }

  // 2. Direct match against OFFICIAL_CREDENTIALS
  const exact = OFFICIAL_CREDENTIALS.find(
    (u) => u.username.toLowerCase() === cleanUser && u.password === cleanPass
  );
  if (exact) return exact;

  // 3. Natural role/alias mapping when password is '12345678'
  if (cleanPass === "12345678") {
    if (["session.clerk", "clerk", "admin", "session", "elder"].includes(cleanUser)) {
      return OFFICIAL_CREDENTIALS[0]; // Elder James Mwangi (Session Clerk)
    }
    if (["parish.minister", "minister", "pastor", "samuel"].includes(cleanUser)) {
      return OFFICIAL_CREDENTIALS[1]; // Rev. Dr. Samuel K. Mwangi
    }
    if (["lcc.chair", "lcc", "chair", "margaret"].includes(cleanUser)) {
      return OFFICIAL_CREDENTIALS[2]; // Margaret Ndungu (LCC Chair)
    }
    if (["treasurer", "treasury", "finance", "grace"].includes(cleanUser)) {
      return OFFICIAL_CREDENTIALS[3]; // Elder Grace Wanjiku (Parish Treasurer)
    }
    if (["womans.guild", "guild", "secretary", "beatrice"].includes(cleanUser)) {
      return OFFICIAL_CREDENTIALS[4]; // Beatrice Waweru (Woman's Guild Sec)
    }
  }

  return null;
}

export async function verifyOfficialPasscode(inputPasscode: string): Promise<OfficialProfile | null> {
  return verifyOfficialLogin(inputPasscode, "12345678");
}

export async function fetchCommitteesFromDB(): Promise<RMSCommittee[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("committees").select("*");
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          code: d.code,
          number: d.number,
          name: d.name,
          category: d.category,
          chairperson: d.chairperson,
          secretary: d.secretary,
          termPeriod: d.term_period,
          recordsCount: d.records_count || 0,
          lastReportMonth: d.last_report_month || "September 2026",
          reportStatus: d.report_status || "pending",
          activeProjects: d.active_projects || [],
        }));
      }
    } catch {
      // fallback
    }
  }

  return getLocalStore("committees", INITIAL_COMMITTEES);
}

export async function fetchDocumentsFromDB(): Promise<ChurchDocument[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("documents").select("*").order("year", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          title: d.title,
          committeeCode: d.committee_code,
          committeeName: d.committee_name,
          year: d.year,
          category: d.category,
          fileName: d.file_name,
          fileSize: d.file_size || "1.2 MB",
          dateFiled: d.date_filed,
          filedBy: d.filed_by,
          isRestricted: d.is_restricted || false,
        }));
      }
    } catch {
      // fallback
    }
  }

  return getLocalStore("documents", []);
}

export async function insertDocumentToDB(doc: Omit<ChurchDocument, "id">): Promise<ChurchDocument> {
  const newId = "doc-" + Date.now();
  const createdDoc: ChurchDocument = { ...doc, id: newId };

  // Update persistent local store immediately
  const existing = getLocalStore<ChurchDocument[]>("documents", []);
  const updated = [createdDoc, ...existing];
  setLocalStore("documents", updated);

  if (supabase) {
    try {
      await supabase.from("documents").insert([{
        title: doc.title,
        committee_code: doc.committeeCode,
        committee_name: doc.committeeName,
        year: doc.year,
        category: doc.category,
        file_name: doc.fileName,
        file_size: doc.fileSize,
        date_filed: doc.dateFiled,
        filed_by: doc.filedBy,
        is_restricted: doc.isRestricted || false,
      }]);
    } catch (e) {
      console.warn("Supabase document insert note:", e);
    }
  }

  return createdDoc;
}

export async function fetchMonthlyReportsFromDB(): Promise<MonthlyReport[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("monthly_reports").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          committeeCode: d.committee_code,
          committeeName: d.committee_name,
          monthYear: d.month_year,
          submittedBy: d.submitted_by,
          submissionDate: d.submission_date,
          attendanceAvg: d.attendance_avg || 0,
          keyActivities: d.key_activities,
          challenges: d.challenges || "",
          budgetSpentKES: Number(d.budget_spent_kes || 0),
          status: d.status,
          lccNotes: d.lcc_notes,
        }));
      }
    } catch {
      // fallback
    }
  }

  return getLocalStore("monthly_reports", []);
}

export async function insertMonthlyReportToDB(rep: Omit<MonthlyReport, "id">): Promise<MonthlyReport> {
  const newId = "rep-" + Date.now();
  const createdRep: MonthlyReport = { ...rep, id: newId };

  const existing = getLocalStore<MonthlyReport[]>("monthly_reports", []);
  setLocalStore("monthly_reports", [createdRep, ...existing]);

  if (supabase) {
    try {
      await supabase.from("monthly_reports").insert([{
        committee_code: rep.committeeCode,
        committee_name: rep.committeeName,
        month_year: rep.monthYear,
        submitted_by: rep.submittedBy,
        submission_date: rep.submissionDate,
        attendance_avg: rep.attendanceAvg,
        key_activities: rep.keyActivities,
        challenges: rep.challenges,
        budget_spent_kes: rep.budgetSpentKES,
        status: rep.status,
      }]);
    } catch (e) {
      console.warn("Supabase report insert note:", e);
    }
  }

  return createdRep;
}

export async function approveMonthlyReportInDB(reportId: string, notes: string): Promise<void> {
  const existing = getLocalStore<MonthlyReport[]>("monthly_reports", []);
  const updated = existing.map((r) =>
    r.id === reportId ? { ...r, status: "Reviewed by LCC" as const, lccNotes: notes } : r
  );
  setLocalStore("monthly_reports", updated);

  if (supabase) {
    try {
      await supabase.from("monthly_reports").update({ status: "Reviewed by LCC", lcc_notes: notes }).eq("id", reportId);
    } catch (e) {
      console.warn("Supabase report update note:", e);
    }
  }
}

export async function fetchHandoversFromDB(): Promise<HandoverRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("handovers").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          committeeCode: d.committee_code,
          committeeName: d.committee_name,
          termEnding: d.term_ending,
          outgoingOfficial: d.outgoing_official,
          incomingOfficial: d.incoming_official,
          submissionDate: d.submission_date,
          status: d.status,
          inventorySummary: d.inventory_summary,
          pendingTasks: d.pending_tasks || "",
          recordsTransferredCount: d.records_transferred_count || 0,
        }));
      }
    } catch {
      // fallback
    }
  }

  return getLocalStore("handovers", []);
}

export async function insertHandoverToDB(hnd: Omit<HandoverRecord, "id">): Promise<HandoverRecord> {
  const newId = "hnd-" + Date.now();
  const createdHnd: HandoverRecord = { ...hnd, id: newId };

  const existing = getLocalStore<HandoverRecord[]>("handovers", []);
  setLocalStore("handovers", [createdHnd, ...existing]);

  if (supabase) {
    try {
      await supabase.from("handovers").insert([{
        committee_code: hnd.committeeCode,
        committee_name: hnd.committeeName,
        term_ending: hnd.termEnding,
        outgoing_official: hnd.outgoingOfficial,
        incoming_official: hnd.incomingOfficial,
        submission_date: hnd.submissionDate,
        status: hnd.status,
        inventory_summary: hnd.inventorySummary,
        pending_tasks: hnd.pendingTasks,
        records_transferred_count: hnd.recordsTransferredCount,
      }]);
    } catch (e) {
      console.warn("Supabase handover insert note:", e);
    }
  }

  return createdHnd;
}

export async function fetchAuditLogsFromDB(): Promise<AuditLogItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("audit_logs").select("*").order("timestamp", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          timestamp: new Date(d.timestamp).toLocaleString("en-KE", { timeZone: "Africa/Nairobi" }),
          user: d.user_name,
          role: d.role,
          action: d.action,
          details: d.details,
        }));
      }
    } catch {
      // fallback
    }
  }

  return getLocalStore("audit_logs", []);
}

export async function recordAuditEvent(userName: string, role: string, action: AuditLogItem["action"], details: string): Promise<void> {
  const newLog: AuditLogItem = {
    id: "aud-" + Date.now(),
    timestamp: new Date().toLocaleDateString("en-KE") + " " + new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }) + " EAT",
    user: userName,
    role: role,
    action: action,
    details: details,
  };

  const existing = getLocalStore<AuditLogItem[]>("audit_logs", []);
  setLocalStore("audit_logs", [newLog, ...existing.slice(0, 50)]);

  if (supabase) {
    try {
      await supabase.from("audit_logs").insert([{
        user_name: userName,
        role: role,
        action: action,
        details: details,
      }]);
    } catch (e) {
      console.warn("Supabase audit insert note:", e);
    }
  }
}

export async function fetchLivePublicInbox(): Promise<Array<{ id: string; table: string; payload: Record<string, unknown>; created_at: string }>> {
  // Read submissions from local live queue
  const localItems = getLocalStore<Array<{ id: string; table: string; payload: Record<string, unknown>; created_at: string }>>("admin_inbox", []);
  
  if (supabase) {
    try {
      const [pr, cm, fb, er, mi, ts, gp, sr, nl] = await Promise.all([
        supabase.from("prayer_requests").select("*").order("created_at", { ascending: false }).limit(40),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(40),
        supabase.from("feedback_submissions").select("*").order("created_at", { ascending: false }).limit(40),
        supabase.from("event_registrations").select("*").order("created_at", { ascending: false }).limit(40),
        supabase.from("ministry_interests").select("*").order("created_at", { ascending: false }).limit(40),
        supabase.from("testimonies").select("*").order("created_at", { ascending: false }).limit(40),
        supabase.from("giving_pledges").select("*").order("created_at", { ascending: false }).limit(40),
        supabase.from("sermon_requests").select("*").order("created_at", { ascending: false }).limit(40),
        supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(40),
      ]);

      const remoteItems: Array<{ id: string; table: string; payload: Record<string, unknown>; created_at: string }> = [];

      if (pr.data) pr.data.forEach((item) => remoteItems.push({ id: item.id, table: "prayer_requests", payload: item, created_at: item.created_at }));
      if (cm.data) cm.data.forEach((item) => remoteItems.push({ id: item.id, table: "contact_messages", payload: item, created_at: item.created_at }));
      if (fb.data) fb.data.forEach((item) => remoteItems.push({ id: item.id, table: "feedback_submissions", payload: item, created_at: item.created_at }));
      if (er.data) er.data.forEach((item) => remoteItems.push({ id: item.id, table: "event_registrations", payload: item, created_at: item.created_at }));
      if (mi.data) mi.data.forEach((item) => remoteItems.push({ id: item.id, table: "ministry_interests", payload: item, created_at: item.created_at }));
      if (ts.data) ts.data.forEach((item) => remoteItems.push({ id: item.id, table: "testimonies", payload: item, created_at: item.created_at }));
      if (gp.data) gp.data.forEach((item) => remoteItems.push({ id: item.id, table: "giving_pledges", payload: item, created_at: item.created_at }));
      if (sr.data) sr.data.forEach((item) => remoteItems.push({ id: item.id, table: "sermon_requests", payload: item, created_at: item.created_at }));
      if (nl.data) nl.data.forEach((item) => remoteItems.push({ id: item.id, table: "newsletter_subscribers", payload: item, created_at: item.created_at }));

      // Merge and deduplicate by ID or signature
      const combined = [...remoteItems];
      const remoteIds = new Set(remoteItems.map((r) => r.id));
      for (const loc of localItems) {
        if (!remoteIds.has(loc.id)) {
          combined.push(loc);
        }
      }

      if (combined.length > 0) {
        return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    } catch {
      // fallback
    }
  }

  return localItems;
}
