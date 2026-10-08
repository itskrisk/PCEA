import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  HeartHandshake,
  Users,
  CalendarCheck,
  MessageSquare,
  Sparkles,
  BookOpen,
  DollarSign,
  CheckCircle2,
  Copy,
  Check,
  Lock,
} from "lucide-react";
import { MotionSection } from "@/components/MotionSection";
import {
  submitPrayerRequest,
  submitFeedback,
  submitEventRsvp,
  submitMinistryInterest,
  submitTestimony,
  submitGivingPledge,
  submitSermonRequest,
} from "@/lib/supabase";
import {
  PrayerRequestPayload,
  FeedbackPayload,
  EventRsvpPayload,
  MinistryInterestPayload,
  TestimonyPayload,
  GivingPledgePayload,
  SermonRequestPayload,
} from "@/types/forms";

const COMMITTEES_LIST = [
  "Woman's Guild",
  "Presbyterian Men's Fellowship",
  "Youth Fellowship",
  "Boys' & Girls' Brigade",
  "Church School",
  "Evangelism & Mission",
  "Christian Education",
  "Justice, Peace & Reconciliation",
  "Health & Healing Ministry",
  "Social Responsibility & Benevolence",
  "Finance & Audit Committee",
  "Property & Facilities Committee",
  "Liturgy & Worship Committee",
  "Music Ministry",
  "Hospitality & Ushering",
  "Prayer & Intercession Ministry",
  "Pastoral Care & Counselling",
  "Communications & Media",
  "Stewardship & Fundraising",
  "Library & Archives",
  "Welfare & Bursary Fund",
  "Climate & Environment Ministry",
];

const UPCOMING_EVENTS = [
  "Annual Parish Family Retreat (Nov 2026)",
  "Keshea All-Night Prayer Watch (Last Friday of Month)",
  "Youth Mentorship & Career Summit",
  "Couples & Marriage Enrichment Dinner",
  "Free Community Health & Medical Camp",
  "New Members Induction Class",
];

type ActionTab =
  | "prayer"
  | "volunteer"
  | "giving"
  | "rsvp"
  | "feedback"
  | "testimony"
  | "sermon";

interface TabConfig {
  id: ActionTab;
  label: string;
  icon: React.ElementType;
}

const ACTION_TABS: TabConfig[] = [
  { id: "prayer", label: "Prayer Request", icon: HeartHandshake },
  { id: "volunteer", label: "Volunteer (22 Committees)", icon: Users },
  { id: "giving", label: "Stewardship & Giving", icon: DollarSign },
  { id: "rsvp", label: "Event Registration", icon: CalendarCheck },
  { id: "feedback", label: "Feedback & Suggestions", icon: MessageSquare },
  { id: "testimony", label: "Share a Story", icon: Sparkles },
  { id: "sermon", label: "Sermon Audio & Notes", icon: BookOpen },
];

export function ConnectPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = (searchParams.get("tab") as ActionTab) || "prayer";
  const initialCommittee = searchParams.get("committee") || "";

  const [activeTab, setActiveTab] = useState<ActionTab>(
    ACTION_TABS.some((t) => t.id === tabParam) ? tabParam : "prayer"
  );
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const current = searchParams.get("tab") as ActionTab;
    if (current && ACTION_TABS.some((t) => t.id === current)) {
      setActiveTab(current);
    }
  }, [searchParams]);

  const switchTab = (tab: ActionTab) => {
    setActiveTab(tab);
    setStatusMessage(null);
    setSearchParams({ tab });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // State payloads
  const [prayerData, setPrayerData] = useState<PrayerRequestPayload>({
    name: "",
    contact: "",
    request: "",
    privacy: "prayer_cell",
  });

  const [volunteerData, setVolunteerData] = useState<MinistryInterestPayload>({
    name: "",
    contact: "",
    committee_name: initialCommittee || COMMITTEES_LIST[0],
    skills_notes: "",
  });

  const [givingData, setGivingData] = useState<GivingPledgePayload>({
    name: "",
    contact: "",
    purpose: "tithes",
    amount: "",
    notes: "",
  });

  const [rsvpData, setRsvpData] = useState<EventRsvpPayload>({
    name: "",
    contact: "",
    event_name: UPCOMING_EVENTS[0],
    attendees_count: 1,
    notes: "",
  });

  const [feedbackData, setFeedbackData] = useState<FeedbackPayload>({
    name: "",
    category: "service",
    feedback: "",
  });

  const [testimonyData, setTestimonyData] = useState<TestimonyPayload>({
    name: "",
    is_anonymous: false,
    title: "",
    testimony: "",
    can_publish: true,
  });

  const [sermonData, setSermonData] = useState<SermonRequestPayload>({
    name: "",
    email: "",
    request_type: "weekly_subscription",
    sermon_reference: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    let res;
    if (activeTab === "prayer") {
      res = await submitPrayerRequest(prayerData);
      if (res.success) setPrayerData({ name: "", contact: "", request: "", privacy: "prayer_cell" });
    } else if (activeTab === "volunteer") {
      res = await submitMinistryInterest(volunteerData);
      if (res.success) setVolunteerData({ name: "", contact: "", committee_name: COMMITTEES_LIST[0], skills_notes: "" });
    } else if (activeTab === "giving") {
      res = await submitGivingPledge(givingData);
      if (res.success) setGivingData({ name: "", contact: "", purpose: "tithes", amount: "", notes: "" });
    } else if (activeTab === "rsvp") {
      res = await submitEventRsvp(rsvpData);
      if (res.success) setRsvpData({ name: "", contact: "", event_name: UPCOMING_EVENTS[0], attendees_count: 1, notes: "" });
    } else if (activeTab === "feedback") {
      res = await submitFeedback(feedbackData);
      if (res.success) setFeedbackData({ name: "", category: "service", feedback: "" });
    } else if (activeTab === "testimony") {
      res = await submitTestimony(testimonyData);
      if (res.success) setTestimonyData({ name: "", is_anonymous: false, title: "", testimony: "", can_publish: true });
    } else if (activeTab === "sermon") {
      res = await submitSermonRequest(sermonData);
      if (res.success) setSermonData({ name: "", email: "", request_type: "weekly_subscription", sermon_reference: "" });
    }

    setSubmitting(false);
    if (res?.success) {
      setStatusMessage(res.message);
    }
  };

  const inputBase =
    "w-full px-4 py-3.5 text-sm border border-[#e8e4dc] bg-white text-[#1c1b18] placeholder-[#8a877e] focus:outline-none focus:border-[#1c1b18] transition-colors";
  const labelBase = "block text-[10px] font-mono uppercase tracking-widest text-[#8a877e] mb-2";

  return (
    <div className="w-full">
      {/* ── EDITORIAL HEADER ────────────────────────────────────────── */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-8">
        <div className="border-b border-[#e8e4dc] pb-10">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#781d19] font-medium mb-3">
            Parish Connect &amp; Submissions
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1c1b18] font-normal leading-[1.05]">
              Participate in Parish Life.
            </h1>
            <p className="text-sm text-[#57554f] max-w-lg leading-relaxed font-sans">
              All church petitions and registrations in one place. No accounts or logins required—your 
              submission routes directly to the Parish Minister and Kirk Session.
            </p>
          </div>
        </div>
      </MotionSection>

      {/* ── STREAMLINED HORIZONTAL ACTION NAVIGATOR ────────────────── */}
      <MotionSection className="max-w-7xl mx-auto px-6 lg:px-12 pb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#e8e4dc]">
          {ACTION_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchTab(tab.id)}
                className={`px-4 py-3 text-xs font-mono uppercase tracking-[0.16em] whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
                  isActive
                    ? "border-[#1c1b18] text-[#1c1b18] font-medium"
                    : "border-transparent text-[#6e6b62] hover:text-[#1c1b18]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </MotionSection>

      {/* ── FOCUSED FORM STAGE ─────────────────────────────────────── */}
      <MotionSection className="max-w-4xl mx-auto px-6 lg:px-12 pb-24">
        <div className="editorial-card p-8 sm:p-14">
          
          {statusMessage ? (
            <div className="py-16 text-center space-y-5">
              <div className="w-14 h-14 mx-auto bg-[#2b4c38]/10 flex items-center justify-center rounded-full">
                <CheckCircle2 className="w-7 h-7 text-[#2b4c38]" />
              </div>
              <h2 className="font-serif text-3xl text-[#1c1b18]">
                Submission Received
              </h2>
              <p className="text-[#57554f] text-sm leading-relaxed max-w-md mx-auto">
                {statusMessage}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStatusMessage(null)}
                  className="text-xs font-mono uppercase tracking-widest text-[#1c1b18] underline underline-offset-4 hover:text-[#781d19]"
                >
                  Submit Another Entry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* ────────────────── 1. PRAYER REQUEST ────────────────── */}
              {activeTab === "prayer" && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#781d19]">
                      <Lock className="w-4 h-4" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Confidential Petition</span>
                    </div>
                    <h2 className="font-serif text-3xl text-[#1c1b18]">Submit a Prayer Request</h2>
                    <p className="text-sm text-[#57554f] leading-relaxed">
                      Handled with reverence. Every petition is brought before the Lord either in private pastoral 
                      confidence or by our consecrated Tuesday prayer cell.
                    </p>
                  </div>

                  <div className="h-px bg-[#e8e4dc]" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelBase}>Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full name"
                        value={prayerData.name}
                        onChange={(e) => setPrayerData({ ...prayerData, name: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Contact (Phone / Email — Optional)</label>
                      <input
                        type="text"
                        placeholder="For pastoral follow-up"
                        value={prayerData.contact}
                        onChange={(e) => setPrayerData({ ...prayerData, contact: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Confidentiality Option *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label
                        className={`p-4 border cursor-pointer transition-colors ${
                          prayerData.privacy === "prayer_cell"
                            ? "border-[#1c1b18] bg-[#faf8f5]"
                            : "border-[#e8e4dc] hover:border-[#b5b0a7]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="prayer-privacy"
                            checked={prayerData.privacy === "prayer_cell"}
                            onChange={() => setPrayerData({ ...prayerData, privacy: "prayer_cell" })}
                            className="accent-[#1c1b18]"
                          />
                          <span className="font-serif text-base text-[#1c1b18]">Parish Prayer Cell</span>
                        </div>
                        <p className="text-[11px] text-[#57554f] mt-1.5 leading-relaxed">
                          Shared with the Committee #16 Intercessory team for weekly corporate prayer.
                        </p>
                      </label>

                      <label
                        className={`p-4 border cursor-pointer transition-colors ${
                          prayerData.privacy === "pastor_only"
                            ? "border-[#1c1b18] bg-[#faf8f5]"
                            : "border-[#e8e4dc] hover:border-[#b5b0a7]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="prayer-privacy"
                            checked={prayerData.privacy === "pastor_only"}
                            onChange={() => setPrayerData({ ...prayerData, privacy: "pastor_only" })}
                            className="accent-[#1c1b18]"
                          />
                          <span className="font-serif text-base text-[#1c1b18]">Private: Pastor Only</span>
                        </div>
                        <p className="text-[11px] text-[#57554f] mt-1.5 leading-relaxed">
                          Kept strictly confidential with the Parish Minister alone.
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Your Petition or Thanksgiving *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Share your burden or prayer request..."
                      value={prayerData.request}
                      onChange={(e) => setPrayerData({ ...prayerData, request: e.target.value })}
                      className={inputBase + " resize-none"}
                    />
                  </div>
                </>
              )}

              {/* ─────────────── 2. VOLUNTEER & MINISTRY ─────────────── */}
              {activeTab === "volunteer" && (
                <>
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19]">
                      22 Parish Committees
                    </p>
                    <h2 className="font-serif text-3xl text-[#1c1b18]">Volunteer / Ministry Sign-up</h2>
                    <p className="text-sm text-[#57554f] leading-relaxed">
                      Every committee in PCEA Kileleshwa is staffed by members who offer their time and 
                      talents. Select where you feel called to serve.
                    </p>
                  </div>

                  <div className="h-px bg-[#e8e4dc]" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelBase}>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={volunteerData.name}
                        onChange={(e) => setVolunteerData({ ...volunteerData, name: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Phone or Email *</label>
                      <input
                        type="text"
                        required
                        placeholder="+254 700 000 000"
                        value={volunteerData.contact}
                        onChange={(e) => setVolunteerData({ ...volunteerData, contact: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Select Committee or Ministry *</label>
                    <select
                      value={volunteerData.committee_name}
                      onChange={(e) => setVolunteerData({ ...volunteerData, committee_name: e.target.value })}
                      className={inputBase}
                    >
                      {COMMITTEES_LIST.map((comm, idx) => (
                        <option key={comm} value={comm}>
                          {String(idx + 1).padStart(2, "0")}. {comm}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelBase}>Skills, Background, or Availability</label>
                    <textarea
                      rows={4}
                      placeholder="e.g. Music / instruments, Sunday school teaching, finance, IT / audio editing, medical..."
                      value={volunteerData.skills_notes}
                      onChange={(e) => setVolunteerData({ ...volunteerData, skills_notes: e.target.value })}
                      className={inputBase + " resize-none"}
                    />
                  </div>
                </>
              )}

              {/* ──────────────── 3. GIVING & PLEDGES ──────────────── */}
              {activeTab === "giving" && (
                <>
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19]">
                      Parish Accounts &amp; Pledges
                    </p>
                    <h2 className="font-serif text-3xl text-[#1c1b18]">Stewardship &amp; Giving</h2>
                    <p className="text-sm text-[#57554f] leading-relaxed">
                      You can give directly via official parish channels below, or record an intended 
                      project pledge or standing order enquiry with the treasury.
                    </p>
                  </div>

                  {/* Clean Account Info Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-5 border border-[#e8e4dc] bg-[#faf8f5] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[#781d19] uppercase tracking-wider font-semibold">M-Pesa Paybill</span>
                        <button
                          type="button"
                          onClick={() => handleCopy("247247", "paybill")}
                          className="flex items-center gap-1 font-mono text-[10px] text-[#8a877e] hover:text-[#1c1b18]"
                        >
                          {copiedKey === "paybill" ? <Check className="w-3 h-3 text-[#2b4c38]" /> : <Copy className="w-3 h-3" />}
                          Copy
                        </button>
                      </div>
                      <p className="font-mono text-xl font-medium text-[#1c1b18]">247247</p>
                      <p className="text-xs text-[#57554f]">Account: <span className="font-mono text-[#1c1b18]">PCEA Kileleshwa</span></p>
                    </div>

                    <div className="p-5 border border-[#e8e4dc] bg-[#faf8f5] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[#c2902b] uppercase tracking-wider font-semibold">Bank Electronic Transfer</span>
                        <button
                          type="button"
                          onClick={() => handleCopy("0100000000000", "bank")}
                          className="flex items-center gap-1 font-mono text-[10px] text-[#8a877e] hover:text-[#1c1b18]"
                        >
                          {copiedKey === "bank" ? <Check className="w-3 h-3 text-[#2b4c38]" /> : <Copy className="w-3 h-3" />}
                          Copy
                        </button>
                      </div>
                      <p className="font-serif text-base text-[#1c1b18]">Equity Bank Kenya</p>
                      <p className="text-xs text-[#57554f]">A/C No: <span className="font-mono text-[#1c1b18]">0100000000000</span></p>
                    </div>
                  </div>

                  <div className="h-px bg-[#e8e4dc]" />

                  {/* Optional Pledge Form */}
                  <div className="space-y-6">
                    <p className="text-xs font-mono uppercase tracking-wider text-[#8a877e]">
                      Submit a Pledge or Standing Order Enquiry
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className={labelBase}>Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={givingData.name}
                          onChange={(e) => setGivingData({ ...givingData, name: e.target.value })}
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label className={labelBase}>Phone or Email *</label>
                        <input
                          type="text"
                          required
                          placeholder="+254 700 000 000"
                          value={givingData.contact}
                          onChange={(e) => setGivingData({ ...givingData, contact: e.target.value })}
                          className={inputBase}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className={labelBase}>Purpose / Appeal *</label>
                        <select
                          value={givingData.purpose}
                          onChange={(e) => setGivingData({ ...givingData, purpose: e.target.value as GivingPledgePayload["purpose"] })}
                          className={inputBase}
                        >
                          <option value="tithes">Tithe &amp; General Offering</option>
                          <option value="building_extension">Sanctuary Extension Fund</option>
                          <option value="benevolence">Benevolence (Needy Families)</option>
                          <option value="youth_brigade">Youth &amp; Boys/Girls Brigade</option>
                          <option value="general">Other Special Appeal</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelBase}>Intended Amount (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. KES 15,000 or Monthly Pledge"
                          value={givingData.amount}
                          onChange={(e) => setGivingData({ ...givingData, amount: e.target.value })}
                          className={inputBase}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelBase}>Notes / Standing Order Request</label>
                      <textarea
                        rows={3}
                        placeholder="Inquire about bank standing order instructions or giving receipts..."
                        value={givingData.notes}
                        onChange={(e) => setGivingData({ ...givingData, notes: e.target.value })}
                        className={inputBase + " resize-none"}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ──────────────── 4. EVENT RSVP ──────────────── */}
              {activeTab === "rsvp" && (
                <>
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19]">
                      Parish Calendar
                    </p>
                    <h2 className="font-serif text-3xl text-[#1c1b18]">Event RSVP &amp; Registration</h2>
                    <p className="text-sm text-[#57554f] leading-relaxed">
                      Register your attendance for upcoming parish retreats, fellowship dinners, and seminars.
                    </p>
                  </div>

                  <div className="h-px bg-[#e8e4dc]" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelBase}>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={rsvpData.name}
                        onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Contact (Phone / Email) *</label>
                      <input
                        type="text"
                        required
                        placeholder="+254 700 000 000"
                        value={rsvpData.contact}
                        onChange={(e) => setRsvpData({ ...rsvpData, contact: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <label className={labelBase}>Upcoming Event *</label>
                      <select
                        value={rsvpData.event_name}
                        onChange={(e) => setRsvpData({ ...rsvpData, event_name: e.target.value })}
                        className={inputBase}
                      >
                        {UPCOMING_EVENTS.map((evt) => (
                          <option key={evt} value={evt}>{evt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelBase}>Number of Attendees *</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        required
                        value={rsvpData.attendees_count}
                        onChange={(e) => setRsvpData({ ...rsvpData, attendees_count: parseInt(e.target.value) || 1 })}
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Dietary / Accessibility Notes</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Attending with young children..."
                      value={rsvpData.notes}
                      onChange={(e) => setRsvpData({ ...rsvpData, notes: e.target.value })}
                      className={inputBase + " resize-none"}
                    />
                  </div>
                </>
              )}

              {/* ────────────── 5. FEEDBACK & SUGGESTIONS ────────────── */}
              {activeTab === "feedback" && (
                <>
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19]">
                      Member Voice
                    </p>
                    <h2 className="font-serif text-3xl text-[#1c1b18]">Feedback &amp; Suggestions</h2>
                    <p className="text-sm text-[#57554f] leading-relaxed">
                      Help our Kirk Session and Local Church Council serve the congregation with greater wisdom.
                    </p>
                  </div>

                  <div className="h-px bg-[#e8e4dc]" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelBase}>Name (Optional)</label>
                      <input
                        type="text"
                        placeholder="Leave blank to remain anonymous"
                        value={feedbackData.name}
                        onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Area of Feedback *</label>
                      <select
                        value={feedbackData.category}
                        onChange={(e) => setFeedbackData({ ...feedbackData, category: e.target.value as FeedbackPayload["category"] })}
                        className={inputBase}
                      >
                        <option value="service">Sunday Morning Worship &amp; Liturgy</option>
                        <option value="committee">Committee Ministry &amp; Activities</option>
                        <option value="facilities">Church Facilities &amp; Parking</option>
                        <option value="general">General Church Experience</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Your Thoughts or Recommendations *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Share what has encouraged you or how we can improve..."
                      value={feedbackData.feedback}
                      onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                      className={inputBase + " resize-none"}
                    />
                  </div>
                </>
              )}

              {/* ──────────────── 6. TESTIMONY / STORY ──────────────── */}
              {activeTab === "testimony" && (
                <>
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19]">
                      Encouragement
                    </p>
                    <h2 className="font-serif text-3xl text-[#1c1b18]">Share a Testimony</h2>
                    <p className="text-sm text-[#57554f] leading-relaxed">
                      Has the Lord encouraged, healed, or guided you through PCEA Kileleshwa? Share your story 
                      for the edification of the body.
                    </p>
                  </div>

                  <div className="h-px bg-[#e8e4dc]" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelBase}>Your Name</label>
                      <input
                        type="text"
                        disabled={testimonyData.is_anonymous}
                        placeholder={testimonyData.is_anonymous ? "Anonymous" : "Your name"}
                        value={testimonyData.name}
                        onChange={(e) => setTestimonyData({ ...testimonyData, name: e.target.value })}
                        className={inputBase}
                      />
                      <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs text-[#57554f]">
                        <input
                          type="checkbox"
                          checked={testimonyData.is_anonymous}
                          onChange={(e) => setTestimonyData({ ...testimonyData, is_anonymous: e.target.checked })}
                          className="accent-[#1c1b18]"
                        />
                        <span>Submit anonymously</span>
                      </label>
                    </div>
                    <div>
                      <label className={labelBase}>Theme / Headline</label>
                      <input
                        type="text"
                        placeholder="e.g. God's faithfulness during transition"
                        value={testimonyData.title}
                        onChange={(e) => setTestimonyData({ ...testimonyData, title: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Your Story *</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Write your testimony..."
                      value={testimonyData.testimony}
                      onChange={(e) => setTestimonyData({ ...testimonyData, testimony: e.target.value })}
                      className={inputBase + " resize-none"}
                    />
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#57554f]">
                    <input
                      type="checkbox"
                      checked={testimonyData.can_publish}
                      onChange={(e) => setTestimonyData({ ...testimonyData, can_publish: e.target.checked })}
                      className="accent-[#1c1b18] mt-0.5"
                    />
                    <span>Permission granted to share in church bulletin, archives, or pastoral publications.</span>
                  </label>
                </>
              )}

              {/* ────────────── 7. SERMON AUDIO & NOTES ────────────── */}
              {activeTab === "sermon" && (
                <>
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19]">
                      Teaching Resources
                    </p>
                    <h2 className="font-serif text-3xl text-[#1c1b18]">Sermon &amp; Study Requests</h2>
                    <p className="text-sm text-[#57554f] leading-relaxed">
                      Subscribe to weekly pulpit audio recordings and study guides by email, or request past sermon series.
                    </p>
                  </div>

                  <div className="h-px bg-[#e8e4dc]" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelBase}>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={sermonData.name}
                        onChange={(e) => setSermonData({ ...sermonData, name: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className={labelBase}>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={sermonData.email}
                        onChange={(e) => setSermonData({ ...sermonData, email: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Resource Type *</label>
                    <select
                      value={sermonData.request_type}
                      onChange={(e) => setSermonData({ ...sermonData, request_type: e.target.value as SermonRequestPayload["request_type"] })}
                      className={inputBase}
                    >
                      <option value="weekly_subscription">Weekly Sunday Audio &amp; Study Notes (Email)</option>
                      <option value="past_sermon">Specific Past Sunday Sermon Request</option>
                      <option value="study_guide">Catechism &amp; Discipleship Study Material</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelBase}>Sermon Date or Passage (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Sermon on Colossians 3, September 2026"
                      value={sermonData.sermon_reference}
                      onChange={(e) => setSermonData({ ...sermonData, sermon_reference: e.target.value })}
                      className={inputBase}
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#e8e4dc]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 bg-[#1c1b18] text-white text-xs font-mono uppercase tracking-[0.16em] hover:bg-[#333] transition-colors disabled:opacity-50"
                  style={{ borderRadius: "2px" }}
                >
                  {submitting ? "Submitting..." : "Submit to Secretariat"}
                </button>
                <p className="text-[10px] font-mono text-[#8a877e]">
                  Secure submission &bull; No login required
                </p>
              </div>

            </form>
          )}

        </div>
      </MotionSection>
    </div>
  );
}
