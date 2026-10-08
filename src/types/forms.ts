export interface PrayerRequestPayload {
  name: string;
  contact?: string; // email or phone
  request: string;
  privacy: "pastor_only" | "prayer_cell";
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FeedbackPayload {
  name?: string;
  category: "service" | "committee" | "general" | "facilities";
  feedback: string;
}

export interface EventRsvpPayload {
  name: string;
  contact: string;
  event_name: string;
  attendees_count: number;
  notes?: string;
}

export interface MinistryInterestPayload {
  name: string;
  contact: string;
  committee_name: string;
  skills_notes?: string;
}

export interface TestimonyPayload {
  name?: string;
  is_anonymous: boolean;
  title?: string;
  testimony: string;
  can_publish: boolean;
}

export interface NewsletterPayload {
  email: string;
}

export interface GivingPledgePayload {
  name: string;
  contact: string;
  purpose: "tithes" | "building_extension" | "benevolence" | "youth_brigade" | "general";
  amount?: string;
  notes?: string;
}

export interface SermonRequestPayload {
  name: string;
  email: string;
  request_type: "weekly_subscription" | "past_sermon" | "study_guide";
  sermon_reference?: string;
}

export type FormSubmissionResult = {
  success: boolean;
  message: string;
  error?: string;
};
