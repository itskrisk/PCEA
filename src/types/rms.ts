export type UserRole =
  | "system_admin"
  | "parish_minister"
  | "lcc_executive"
  | "finance_committee"
  | "committee_secretary";

export interface OfficialProfile {
  id: string;
  username: string;
  name: string;
  title: string;
  role: UserRole;
  committeeCode?: string;
  termRange: string;
  termEndDate: string;
  email: string;
}

export interface RMSCommittee {
  code: string; // e.g. 'COM-01'
  number: string;
  name: string;
  category: "Fellowship" | "Mission" | "Worship" | "Governance";
  chairperson: string;
  secretary: string;
  termPeriod: string;
  recordsCount: number;
  lastReportMonth: string;
  reportStatus: "submitted" | "pending" | "reviewed";
  activeProjects: string[];
}

export interface ChurchDocument {
  id: string;
  title: string;
  committeeCode: string;
  committeeName: string;
  year: number;
  category: "Minutes" | "Monthly Report" | "Annual Report" | "Finance" | "Policy" | "Handover";
  fileName: string; // e.g. 2026_COM01_MINUTES_AGM.pdf
  fileSize: string;
  dateFiled: string;
  filedBy: string;
  isRestricted?: boolean;
}

export interface MonthlyReport {
  id: string;
  committeeCode: string;
  committeeName: string;
  monthYear: string;
  submittedBy: string;
  submissionDate: string;
  attendanceAvg: number;
  keyActivities: string;
  challenges: string;
  budgetSpentKES: number;
  status: "Reviewed by LCC" | "Pending LCC Review" | "Action Required";
  lccNotes?: string;
}

export interface HandoverRecord {
  id: string;
  committeeCode: string;
  committeeName: string;
  termEnding: string;
  outgoingOfficial: string;
  incomingOfficial: string;
  submissionDate: string;
  status: "Completed & Signed" | "Pending Session Signoff" | "Draft";
  inventorySummary: string;
  pendingTasks: string;
  recordsTransferredCount: number;
}

export interface MeetingMinute {
  id: string;
  committeeCode: string;
  title: string;
  meetingDate: string;
  attendeesCount: number;
  presidedBy: string;
  keyDecisions: string[];
  actionItems: { task: string; assignee: string; due: string }[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: "UPLOAD" | "ARCHIVE" | "HANDOVER_TRANSFER" | "REPORT_SUBMIT" | "LCC_APPROVAL" | "ACCESS_CHANGE";
  details: string;
}
