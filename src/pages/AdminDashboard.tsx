import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  FileText,
  Users,
  Calendar,
  Lock,
  Download,
  AlertCircle,
  FolderLock,
  Send,
  Eye,
  FilePlus,
  Heart,
  KeyRound,
  LogOut,
  RefreshCw,
  Clock,
  CheckCircle,
  HelpCircle,
  User,
} from "lucide-react";

import pceaLogo from "@/images/pcealogo.png";
import {
  OfficialProfile,
  RMSCommittee,
  ChurchDocument,
  MonthlyReport,
  HandoverRecord,
} from "@/types/rms";
import {
  verifyOfficialLogin,
  verifyOfficialPasscode,
  fetchCommitteesFromDB,
  fetchDocumentsFromDB,
  insertDocumentToDB,
  fetchMonthlyReportsFromDB,
  insertMonthlyReportToDB,
  approveMonthlyReportInDB,
  fetchHandoversFromDB,
  insertHandoverToDB,
  fetchLivePublicInbox,
  recordAuditEvent,
} from "@/lib/supabase";

export function AdminDashboard() {
  // ── Authentication State ──────────────────────────────────────────
  const [activeOfficial, setActiveOfficial] = useState<OfficialProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem("pcea_active_official");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // ── Database State ────────────────────────────────────────────────
  const [committees, setCommittees] = useState<RMSCommittee[]>([]);
  const [documents, setDocuments] = useState<ChurchDocument[]>([]);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [handovers, setHandovers] = useState<HandoverRecord[]>([]);
  const [publicInbox, setPublicInbox] = useState<
    Array<{ id: string; table: string; payload: Record<string, unknown>; created_at: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── UI Filter & Modal State ───────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<ChurchDocument | null>(null);

  // Form states
  const [newDoc, setNewDoc] = useState({
    title: "",
    committeeCode: "LCC",
    year: 2026,
    category: "Minutes" as ChurchDocument["category"],
  });

  const [newReport, setNewReport] = useState({
    committeeCode: "COM-01",
    monthYear: "October 2026",
    activities: "",
    challenges: "",
    budgetSpent: 25000,
  });

  const [newHandover, setNewHandover] = useState({
    committeeCode: "COM-01",
    incomingOfficial: "",
    inventorySummary: "",
    pendingTasks: "",
  });

  // Load all live database records
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [coms, docs, reps, hnds, inbox] = await Promise.all([
        fetchCommitteesFromDB(),
        fetchDocumentsFromDB(),
        fetchMonthlyReportsFromDB(),
        fetchHandoversFromDB(),
        fetchLivePublicInbox(),
      ]);
      setCommittees(coms);
      setDocuments(docs);
      setMonthlyReports(reps);
      setHandovers(hnds);
      setPublicInbox(inbox);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Official authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setAuthLoading(true);
    setAuthError(null);

    const verified = await verifyOfficialLogin(username, password);
    setAuthLoading(false);

    if (verified) {
      setActiveOfficial(verified);
      sessionStorage.setItem("pcea_active_official", JSON.stringify(verified));
      recordAuditEvent(verified.name, verified.title, "ACCESS_CHANGE", "Signed in to church records.");
    } else {
      setAuthError("Invalid username or password. Please verify your credentials or contact the Session Clerk.");
    }
  };

  const handleLogout = () => {
    if (activeOfficial) {
      recordAuditEvent(activeOfficial.name, activeOfficial.title, "ACCESS_CHANGE", "Signed out of church records.");
    }
    setActiveOfficial(null);
    sessionStorage.removeItem("pcea_active_official");
    setUsername("");
    setPassword("");
  };

  // Permissions
  const canAccessFinance =
    activeOfficial?.role === "system_admin" ||
    activeOfficial?.role === "finance_committee" ||
    activeOfficial?.role === "parish_minister";

  const canApproveReports =
    activeOfficial?.role === "system_admin" ||
    activeOfficial?.role === "lcc_executive" ||
    activeOfficial?.role === "parish_minister";

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.committeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchYear = selectedYear === "All" || doc.year.toString() === selectedYear;
      const matchCategory = selectedCategory === "All" || doc.category === selectedCategory;

      if (doc.isRestricted && !canAccessFinance) return false;

      return matchSearch && matchYear && matchCategory;
    });
  }, [documents, searchQuery, selectedYear, selectedCategory, canAccessFinance]);

  // Upload Document
  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title.trim() || !activeOfficial) return;

    const targetCom = committees.find((c) => c.code === newDoc.committeeCode);
    const sanitizedTitle = newDoc.title.toUpperCase().replace(/\s+/g, "_").slice(0, 20);
    const fileName = `${newDoc.year}_${newDoc.committeeCode}_${newDoc.category.toUpperCase().replace(/\s+/g, "_")}_${sanitizedTitle}.pdf`;

    const saved = await insertDocumentToDB({
      title: newDoc.title,
      committeeCode: newDoc.committeeCode,
      committeeName: targetCom?.name || "Church Administration",
      year: Number(newDoc.year),
      category: newDoc.category,
      fileName,
      fileSize: "1.2 MB",
      dateFiled: new Date().toISOString().split("T")[0],
      filedBy: activeOfficial.name,
      isRestricted: newDoc.category === "Finance",
    });

    await recordAuditEvent(activeOfficial.name, activeOfficial.title, "UPLOAD", `Filed document: ${fileName}`);
    setDocuments((prev) => [saved, ...prev]);
    setShowUploadModal(false);
    setNewDoc({ title: "", committeeCode: "LCC", year: 2026, category: "Minutes" });
  };

  // Submit Monthly Report
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOfficial) return;

    const targetCom = committees.find((c) => c.code === newReport.committeeCode);
    const saved = await insertMonthlyReportToDB({
      committeeCode: newReport.committeeCode,
      committeeName: targetCom?.name || "Parish Committee",
      monthYear: newReport.monthYear,
      submittedBy: activeOfficial.name,
      submissionDate: new Date().toISOString().split("T")[0],
      attendanceAvg: 60,
      keyActivities: newReport.activities || "Scheduled monthly meetings and fellowship held.",
      challenges: newReport.challenges || "None noted.",
      budgetSpentKES: Number(newReport.budgetSpent),
      status: "Pending LCC Review",
    });

    await recordAuditEvent(activeOfficial.name, activeOfficial.title, "REPORT_SUBMIT", `Submitted monthly report for ${saved.committeeName}.`);
    setMonthlyReports((prev) => [saved, ...prev]);
    setShowReportModal(false);
    setNewReport({ committeeCode: "COM-01", monthYear: "October 2026", activities: "", challenges: "", budgetSpent: 25000 });
  };

  // Review Report
  const handleApproveReport = async (report: MonthlyReport) => {
    if (!activeOfficial) return;
    const note = `Reviewed and approved at LCC meeting by ${activeOfficial.name}`;
    await approveMonthlyReportInDB(report.id, note);
    await recordAuditEvent(activeOfficial.name, activeOfficial.title, "LCC_APPROVAL", `Approved ${report.committeeName} monthly report.`);
    setMonthlyReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, status: "Reviewed by LCC", lccNotes: note } : r))
    );
  };

  // Submit Handover
  const handleHandoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOfficial) return;

    const targetCom = committees.find((c) => c.code === newHandover.committeeCode);
    const saved = await insertHandoverToDB({
      committeeCode: newHandover.committeeCode,
      committeeName: targetCom?.name || "Committee",
      termEnding: "2024–2027",
      outgoingOfficial: activeOfficial.name,
      incomingOfficial: newHandover.incomingOfficial || "Incoming Office Bearer",
      submissionDate: new Date().toISOString().split("T")[0],
      status: "Completed & Signed",
      inventorySummary: newHandover.inventorySummary || "All minutes, records, physical assets handed over.",
      pendingTasks: newHandover.pendingTasks || "None noted.",
      recordsTransferredCount: targetCom?.recordsCount || 30,
    });

    await recordAuditEvent(activeOfficial.name, activeOfficial.title, "HANDOVER_TRANSFER", `Submitted handover for ${saved.committeeName}.`);
    setHandovers((prev) => [saved, ...prev]);
    setShowHandoverModal(false);
  };

  // ──────────────────────────────────────────────────────────────────
  // 1. SIMPLE, AUTHENTIC USERNAME & PASSWORD LOGIN
  // ──────────────────────────────────────────────────────────────────
  if (!activeOfficial) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#1c1b18] flex flex-col justify-center items-center px-4 py-16">
        <div className="max-w-md w-full bg-white border border-[#e8e4dc] p-8 sm:p-10 space-y-7 shadow-xs">
          
          {/* Logo only */}
          <div className="flex justify-center">
            <img
              src={pceaLogo}
              alt="PCEA Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="text-center space-y-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1c1b18]">
              Church Records
            </h1>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8a877e]">
              PCEA Kileleshwa
            </p>
          </div>

          <p className="text-xs text-[#57554f] leading-relaxed text-center font-sans">
            Sign in with your official account credentials to access governance records, committee reports, and archival minutes.
          </p>

          {authError && (
            <div className="p-3 bg-[#781d19]/8 border border-[#781d19]/20 text-[#781d19] text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-[#57554f] mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a877e]" />
                <input
                  id="username"
                  type="text"
                  required
                  autoCapitalize="none"
                  autoComplete="username"
                  placeholder="e.g. session.clerk"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#e8e4dc] bg-[#faf8f5] focus:outline-none focus:border-[#1c1b18] text-[#1c1b18]"
                  style={{ borderRadius: "2px" }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-[#57554f] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a877e]" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#e8e4dc] bg-[#faf8f5] focus:outline-none focus:border-[#1c1b18] text-[#1c1b18]"
                  style={{ borderRadius: "2px" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 mt-2 bg-[#1c1b18] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#383631] transition-colors disabled:opacity-50"
              style={{ borderRadius: "2px" }}
            >
              {authLoading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <p className="text-[11px] text-[#8a877e] text-center pt-2 border-t border-[#e8e4dc]">
            Church records belong to PCEA Kileleshwa and remain with the church across changes in office bearers.
          </p>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────
  // 2. CLEAN BENTO GRID DASHBOARD
  // ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1b18] pb-24 font-sans">
      
      {/* ── CLEAN HEADER (No public button, logo only) ──────────────── */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e4dc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Logo only */}
          <div className="flex items-center gap-4">
            <img
              src={pceaLogo}
              alt="PCEA Logo"
              className="h-14 w-auto object-contain"
            />
            <div className="hidden sm:block h-6 w-px bg-[#e8e4dc]" />
            <div className="hidden sm:block">
              <p className="font-serif text-lg leading-none text-[#1c1b18]">PCEA Kileleshwa</p>
              <p className="text-[10px] font-mono text-[#8a877e] uppercase tracking-wider mt-0.5">Church Records Archive</p>
            </div>
          </div>

          {/* Right: Officer details & Sign Out */}
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="font-serif text-sm text-[#1c1b18]">{activeOfficial.name}</p>
              <p className="text-[10px] font-mono text-[#781d19]">{activeOfficial.title}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider border border-[#e8e4dc] hover:border-[#1c1b18] text-[#57554f] hover:text-[#1c1b18] transition-colors"
              style={{ borderRadius: "2px" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT: HUMAN BENTO GRID ─────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 space-y-8">

        {/* ── BENTO ROW 1: OVERVIEW & AT A GLANCE ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Card 1: Overview Summary (Span 8) */}
          <div className="lg:col-span-8 bg-white border border-[#e8e4dc] p-8 flex flex-col justify-between space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#781d19] font-medium">
                  Church Records Management
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#1c1b18] font-normal leading-tight">
                  Official Records &amp; Archives
                </h1>
                <p className="text-sm text-[#57554f] max-w-xl leading-relaxed pt-1">
                  A central home for PCEA Kileleshwa documents. Minutes, monthly committee reports, 
                  and historical records remain safe here regardless of changes in church leadership.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 shrink-0 pt-1">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2.5 bg-[#1c1b18] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#383631] transition-colors"
                  style={{ borderRadius: "2px" }}
                >
                  + Add Document
                </button>
                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2.5 border border-[#1c1b18] text-[#1c1b18] text-xs font-mono uppercase tracking-wider hover:bg-[#faf8f5] transition-colors"
                  style={{ borderRadius: "2px" }}
                >
                  Submit Monthly Report
                </button>
              </div>
            </div>

            {/* Simple Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#e8e4dc]">
              <div>
                <p className="font-serif text-3xl text-[#1c1b18]">{documents.length}</p>
                <p className="text-xs text-[#8a877e] mt-0.5">Documents on Record</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[#1c1b18]">{committees.length}</p>
                <p className="text-xs text-[#8a877e] mt-0.5">Active Committees</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[#781d19]">
                  {monthlyReports.filter((r) => r.status === "Pending LCC Review").length}
                </p>
                <p className="text-xs text-[#8a877e] mt-0.5">Pending LCC Review</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[#2b4c38]">{publicInbox.length}</p>
                <p className="text-xs text-[#8a877e] mt-0.5">Public Messages &amp; Prayers</p>
              </div>
            </div>
          </div>

          {/* Card 2: 3-Year Term Continuity Principle (Span 4) */}
          <div className="lg:col-span-4 bg-[#f3efe6] border border-[#e4dfd4] p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19] font-medium">
                Core Church Rule
              </p>
              <h2 className="font-serif text-2xl text-[#1c1b18] leading-snug">
                Records Belong to the Church.
              </h2>
              <p className="text-xs text-[#57554f] leading-relaxed">
                Officials serve for three years and hand over. To prevent records from getting lost on personal 
                phones or laptops, every official document is preserved here so the next leadership team 
                can continue seamlessly.
              </p>
            </div>

            <div className="pt-3 border-t border-[#dcd7cb] flex items-center justify-between text-xs font-mono">
              <span className="text-[#8a877e]">Current Term: 2024–2027</span>
              <button
                type="button"
                onClick={() => setShowHandoverModal(true)}
                className="text-[#1c1b18] font-medium underline hover:text-[#781d19]"
              >
                Handover Form &rarr;
              </button>
            </div>
          </div>

        </div>

        {/* ── BENTO ROW 2: SEARCHABLE DOCUMENTS ARCHIVE ─────────────── */}
        <div className="bg-white border border-[#e8e4dc] p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#781d19] font-medium mb-1">
                Central Repository
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1b18]">
                Find Any Church Record
              </h2>
              <p className="text-xs text-[#57554f] mt-1">
                Browse official records from the church's founding in 2015 to the present day.
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a877e]" />
                <input
                  type="text"
                  placeholder="Search by title, committee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#e8e4dc] bg-[#faf8f5] focus:outline-none focus:border-[#1c1b18]"
                  style={{ borderRadius: "2px" }}
                />
              </div>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 text-xs border border-[#e8e4dc] bg-[#faf8f5] text-[#1c1b18] focus:outline-none"
                style={{ borderRadius: "2px" }}
              >
                <option value="All">All Years</option>
                {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
                  <option key={y} value={y.toString()}>{y}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs border border-[#e8e4dc] bg-[#faf8f5] text-[#1c1b18] focus:outline-none"
                style={{ borderRadius: "2px" }}
              >
                <option value="All">All Categories</option>
                <option value="Minutes">Meeting Minutes</option>
                <option value="Monthly Report">Monthly Reports</option>
                <option value="Annual Report">Annual Reports</option>
                <option value="Policy">Policies &amp; Charters</option>
                <option value="Handover">Handover Reports</option>
                {canAccessFinance && <option value="Finance">Financial Records</option>}
              </select>
            </div>
          </div>

          {/* Documents Table */}
          <div className="overflow-x-auto border border-[#e8e4dc]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8f5] border-b border-[#e8e4dc] text-[10px] font-mono uppercase tracking-wider text-[#8a877e]">
                <tr>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Committee / Body</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Filed By</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e4dc]">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#1c1b18]">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#781d19] shrink-0" />
                        <div>
                          <p className="text-sm font-serif text-[#1c1b18]">{doc.title}</p>
                          <p className="text-[10px] text-[#8a877e] font-mono">{doc.fileName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#57554f]">
                      {doc.committeeName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px]">
                      <span className="px-2 py-0.5 bg-[#f3efe6] text-[#1c1b18] border border-[#e4dfd4]">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#1c1b18]">{doc.year}</td>
                    <td className="py-3.5 px-4 text-[#8a877e]">{doc.filedBy}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedDocPreview(doc)}
                        className="text-xs font-mono uppercase tracking-wider text-[#1c1b18] hover:text-[#781d19] underline"
                      >
                        View &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredDocuments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#8a877e] text-xs">
                      No documents found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── BENTO ROW 3: MONTHLY COMMITTEE REPORTS (Span 8) + 22 COMMITTEES (Span 4) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Card 3: Monthly Committee Reports & LCC (Span 8) */}
          <div className="lg:col-span-8 bg-white border border-[#e8e4dc] p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#781d19] font-medium mb-1">
                  LCC Reporting
                </p>
                <h2 className="font-serif text-2xl text-[#1c1b18]">
                  Monthly Committee Performance Reports
                </h2>
                <p className="text-xs text-[#57554f] mt-1">
                  Submitted each month by committee chairs for review by the Local Church Council (LCC).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider border border-[#1c1b18] text-[#1c1b18] hover:bg-[#faf8f5]"
                style={{ borderRadius: "2px" }}
              >
                + Submit Report
              </button>
            </div>

            {/* Reports List */}
            <div className="space-y-3">
              {monthlyReports.map((rep) => (
                <div key={rep.id} className="p-4 border border-[#e8e4dc] bg-[#faf8f5] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-serif text-base text-[#1c1b18]">{rep.committeeName}</p>
                      <p className="text-[10px] font-mono text-[#8a877e]">
                        {rep.monthYear} &bull; Submitted by {rep.submittedBy}
                      </p>
                    </div>

                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 border ${
                      rep.status === "Reviewed by LCC"
                        ? "bg-[#2b4c38]/10 text-[#2b4c38] border-[#2b4c38]/20"
                        : "bg-[#c2902b]/10 text-[#c2902b] border-[#c2902b]/20 font-semibold"
                    }`}>
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#57554f] leading-relaxed">
                    {rep.keyActivities}
                  </p>

                  {rep.challenges && (
                    <p className="text-xs text-[#781d19] italic">
                      Matters requiring attention: {rep.challenges}
                    </p>
                  )}

                  <div className="pt-2 border-t border-[#e8e4dc] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#8a877e]">Amount Spent: KES {rep.budgetSpentKES.toLocaleString()}</span>

                    {canApproveReports && rep.status !== "Reviewed by LCC" ? (
                      <button
                        type="button"
                        onClick={() => handleApproveReport(rep)}
                        className="text-[#2b4c38] font-bold hover:underline"
                      >
                        Approve Report &rarr;
                      </button>
                    ) : (
                      <span className="text-[#2b4c38]">{rep.lccNotes || "Report on file"}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: The 22 Committees Overview (Span 4) */}
          <div className="lg:col-span-4 bg-white border border-[#e8e4dc] p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#781d19] font-medium">
                Parish Structure
              </p>
              <h2 className="font-serif text-2xl text-[#1c1b18]">
                The 22 Committees
              </h2>
              <p className="text-xs text-[#57554f] leading-relaxed">
                Every committee has its own leadership roster and records space across 3-year terms.
              </p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1 text-xs">
              {committees.map((c) => (
                <div key={c.code} className="p-3 border border-[#e8e4dc] bg-[#faf8f5] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-medium text-sm text-[#1c1b18]">{c.name}</span>
                    <span className="text-[9px] font-mono text-[#8a877e]">{c.code}</span>
                  </div>
                  <p className="text-[11px] text-[#57554f]">
                    Chair: {c.chairperson} &bull; Sec: {c.secretary}
                  </p>
                  <p className="text-[10px] font-mono text-[#8a877e]">
                    Term: {c.termPeriod} &bull; {c.recordsCount} records filed
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono text-[#8a877e] pt-2 border-t border-[#e8e4dc]">
              All 22 committee workspaces mapped into the central repository.
            </p>
          </div>

        </div>

        {/* ── BENTO ROW 4: PUBLIC SITE INBOX (Span 8) + RESTRICTED FINANCE (Span 4) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Card 5: Public Messages & Prayer Requests (Span 8) */}
          <div className="lg:col-span-8 bg-white border border-[#e8e4dc] p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#781d19] font-medium mb-1">
                  Front Door Messages
                </p>
                <h2 className="font-serif text-2xl text-[#1c1b18]">
                  Public Inquiries &amp; Prayer Petitions
                </h2>
                <p className="text-xs text-[#57554f] mt-1">
                  Incoming submissions from the church website. Real-time feed from Supabase.
                </p>
              </div>

              <span className="px-2.5 py-1 text-[10px] font-mono uppercase text-[#2b4c38] bg-[#2b4c38]/10 font-medium">
                Live Feed ({publicInbox.length})
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {publicInbox.map((item) => (
                <div key={item.id} className="p-4 border border-[#e8e4dc] bg-[#faf8f5] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#781d19]">
                      {item.table.replace("_", " ")}
                    </span>
                    <span className="text-[10px] font-mono text-[#8a877e]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {item.payload.name && (
                    <p className="font-serif text-sm font-medium text-[#1c1b18]">
                      From: {String(item.payload.name)}
                    </p>
                  )}

                  {item.payload.request && (
                    <p className="text-xs text-[#57554f] italic leading-relaxed">
                      &ldquo;{String(item.payload.request)}&rdquo;
                    </p>
                  )}

                  {item.payload.committee_name && (
                    <p className="text-xs text-[#2b4c38] font-mono">
                      Target Ministry: {String(item.payload.committee_name)}
                    </p>
                  )}

                  {item.payload.message && (
                    <p className="text-xs text-[#57554f] leading-relaxed">
                      &ldquo;{String(item.payload.message)}&rdquo;
                    </p>
                  )}

                  {item.payload.privacy === "pastor_only" && (
                    <span className="inline-block mt-1 text-[9px] font-mono uppercase bg-[#1c1b18] text-white px-2 py-0.5">
                      Confidential &bull; Pastor Only
                    </span>
                  )}
                </div>
              ))}

              {publicInbox.length === 0 && (
                <div className="py-12 text-center text-[#8a877e] text-xs">
                  No public messages or prayer requests in the database yet.
                </div>
              )}
            </div>
          </div>

          {/* Card 6: Church Finances (Span 4) */}
          <div className="lg:col-span-4 bg-white border border-[#e8e4dc] p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#781d19] font-medium">
                Finance &amp; Treasury
              </p>
              <h2 className="font-serif text-2xl text-[#1c1b18]">
                Parish Accounts
              </h2>
              <p className="text-xs text-[#57554f] leading-relaxed">
                Restricted to the Finance Committee, Treasurer, and Session Clerk.
              </p>
            </div>

            {canAccessFinance ? (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-[#faf8f5] border border-[#e8e4dc]">
                  <p className="text-[10px] font-mono uppercase text-[#8a877e]">Operational Budget 2026</p>
                  <p className="font-serif text-xl text-[#1c1b18] mt-0.5">KES 18,400,000</p>
                  <p className="text-[10px] text-[#2b4c38] mt-0.5">Approved at AGM</p>
                </div>
                <div className="p-3.5 bg-[#faf8f5] border border-[#e8e4dc]">
                  <p className="text-[10px] font-mono uppercase text-[#8a877e]">Sanctuary Extension Fund</p>
                  <p className="font-serif text-xl text-[#c2902b] mt-0.5">KES 6,850,000</p>
                  <p className="text-[10px] text-[#8a877e] mt-0.5">Special Project Account</p>
                </div>
                <div className="pt-2 text-[11px] font-mono text-[#8a877e]">
                  Audited statements for 2024 and 2025 on file.
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-[#faf8f5] border border-[#e8e4dc] p-4 space-y-2">
                <FolderLock className="w-6 h-6 text-[#781d19] mx-auto" />
                <p className="font-serif text-base text-[#1c1b18]">Restricted</p>
                <p className="text-[11px] text-[#57554f] leading-relaxed">
                  Only the Parish Treasurer and Session Clerk have access to financial ledgers.
                </p>
              </div>
            )}

            <div className="pt-2 text-[10px] font-mono text-[#8a877e] border-t border-[#e8e4dc]">
              Financial accountability under Kirk Session oversight.
            </div>
          </div>

        </div>

      </main>

      {/* ── MODAL: ADD DOCUMENT ─────────────────────────────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white max-w-lg w-full p-8 border border-[#e8e4dc] space-y-5 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19]">New File</p>
                <h3 className="font-serif text-2xl text-[#1c1b18]">Add Church Document</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-xs font-mono text-[#8a877e] hover:text-[#1c1b18]"
              >
                &times; Close
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual General Meeting Minutes"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5] focus:outline-none focus:border-[#1c1b18]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Committee / Body *</label>
                  <select
                    value={newDoc.committeeCode}
                    onChange={(e) => setNewDoc({ ...newDoc, committeeCode: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5]"
                  >
                    <option value="LCC">LCC (Church-Wide)</option>
                    {committees.map((c) => (
                      <option key={c.code} value={c.code}>{c.code} &bull; {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Year *</label>
                  <select
                    value={newDoc.year}
                    onChange={(e) => setNewDoc({ ...newDoc, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5]"
                  >
                    {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Document Type *</label>
                <select
                  value={newDoc.category}
                  onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as ChurchDocument["category"] })}
                  className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5]"
                >
                  <option value="Minutes">Meeting Minutes</option>
                  <option value="Monthly Report">Monthly Report</option>
                  <option value="Annual Report">Annual Report</option>
                  <option value="Policy">Policy / Constitution</option>
                  <option value="Handover">Handover Report</option>
                  {canAccessFinance && <option value="Finance">Financial Document</option>}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-[#e8e4dc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1c1b18] text-white hover:bg-[#383631]"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: SUBMIT MONTHLY REPORT ───────────────────────────── */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white max-w-lg w-full p-8 border border-[#e8e4dc] space-y-5 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19]">Monthly Submission</p>
                <h3 className="font-serif text-2xl text-[#1c1b18]">Submit Committee Report</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-xs font-mono text-[#8a877e] hover:text-[#1c1b18]"
              >
                &times; Close
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Committee *</label>
                  <select
                    value={newReport.committeeCode}
                    onChange={(e) => setNewReport({ ...newReport, committeeCode: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5]"
                  >
                    {committees.map((c) => (
                      <option key={c.code} value={c.code}>{c.code} &bull; {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Month &amp; Year *</label>
                  <input
                    type="text"
                    value={newReport.monthYear}
                    onChange={(e) => setNewReport({ ...newReport, monthYear: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Activities Carried Out *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize meetings, events, or outreach conducted this month..."
                  value={newReport.activities}
                  onChange={(e) => setNewReport({ ...newReport, activities: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5] resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Challenges or Matters for LCC Attention</label>
                <textarea
                  rows={2}
                  placeholder="Any issues or support required from the church leadership..."
                  value={newReport.challenges}
                  onChange={(e) => setNewReport({ ...newReport, challenges: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5] resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Amount Spent (KES)</label>
                <input
                  type="number"
                  value={newReport.budgetSpent}
                  onChange={(e) => setNewReport({ ...newReport, budgetSpent: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-[#e8e4dc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1c1b18] text-white hover:bg-[#383631]"
                >
                  Submit to LCC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: 3-YEAR HANDOVER FORM ────────────────────────────── */}
      {showHandoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white max-w-lg w-full p-8 border border-[#e8e4dc] space-y-5 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19]">Leadership Transition</p>
                <h3 className="font-serif text-2xl text-[#1c1b18]">Committee Handover Report</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHandoverModal(false)}
                className="text-xs font-mono text-[#8a877e] hover:text-[#1c1b18]"
              >
                &times; Close
              </button>
            </div>

            <p className="text-xs text-[#57554f] leading-relaxed">
              When a three-year term concludes, this report ensures all physical property, records, and 
              pending work are handed over cleanly to the incoming team.
            </p>

            <form onSubmit={handleHandoverSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Committee *</label>
                <select
                  value={newHandover.committeeCode}
                  onChange={(e) => setNewHandover({ ...newHandover, committeeCode: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5]"
                >
                  {committees.map((c) => (
                    <option key={c.code} value={c.code}>{c.code} &bull; {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Incoming Official Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Name of newly elected official..."
                  value={newHandover.incomingOfficial}
                  onChange={(e) => setNewHandover({ ...newHandover, incomingOfficial: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Assets &amp; Property Handed Over *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Keys, equipment, uniform tunics, books..."
                  value={newHandover.inventorySummary}
                  onChange={(e) => setNewHandover({ ...newHandover, inventorySummary: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5] resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8a877e] mb-1">Ongoing Projects &amp; Pending Matters</label>
                <textarea
                  rows={2}
                  placeholder="Tasks currently underway that the incoming team should follow up on..."
                  value={newHandover.pendingTasks}
                  onChange={(e) => setNewHandover({ ...newHandover, pendingTasks: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e8e4dc] bg-[#faf8f5] resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setShowHandoverModal(false)}
                  className="px-4 py-2 border border-[#e8e4dc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1c1b18] text-white hover:bg-[#383631]"
                >
                  Submit Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DOCUMENT VIEW ────────────────────────────────────── */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white max-w-lg w-full p-8 border border-[#e8e4dc] space-y-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#781d19]">
                  {selectedDocPreview.committeeName} &bull; {selectedDocPreview.category}
                </p>
                <h3 className="font-serif text-2xl text-[#1c1b18] mt-1">{selectedDocPreview.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="text-xs font-mono text-[#8a877e] hover:text-[#1c1b18]"
              >
                &times; Close
              </button>
            </div>

            <div className="p-4 bg-[#faf8f5] border border-[#e8e4dc] space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-[#e8e4dc] pb-1.5">
                <span className="text-[#8a877e]">File Name:</span>
                <span className="text-[#1c1b18] font-medium">{selectedDocPreview.fileName}</span>
              </div>
              <div className="flex justify-between border-b border-[#e8e4dc] pb-1.5">
                <span className="text-[#8a877e]">Year:</span>
                <span className="text-[#1c1b18]">{selectedDocPreview.year}</span>
              </div>
              <div className="flex justify-between border-b border-[#e8e4dc] pb-1.5">
                <span className="text-[#8a877e]">Filed By:</span>
                <span className="text-[#1c1b18]">{selectedDocPreview.filedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a877e]">Date Filed:</span>
                <span className="text-[#1c1b18]">{selectedDocPreview.dateFiled}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs font-mono pt-2">
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-2 border border-[#e8e4dc]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => alert(`Opening ${selectedDocPreview.fileName}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1c1b18] text-white hover:bg-[#383631]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
