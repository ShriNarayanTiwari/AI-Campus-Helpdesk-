export type PageId =
  | 'home'
  | 'assistant'
  | 'facilities'
  | 'clubs'
  | 'events'
  | 'academics'
  | 'services'
  | 'knowledge-base';

export type SourceType = 'official' | 'demo';

export type VerificationStatus = 'Verified source' | 'Prototype sample';

export type KnowledgeCategory =
  | 'Campus Facilities'
  | 'Library'
  | 'Hostels & Mess'
  | 'Transport'
  | 'Clubs & Societies'
  | 'Campus Events'
  | 'Academics'
  | 'Student Services'
  | 'Placements'
  | 'Campus Life'
  | 'Admissions & General'
  | 'Contacts & Portals'
  | 'Social & Community';

export type FreshnessStatus = 'verified-reference' | 'session-sensitive' | 'demo-static';

export type RefusalCategory =
  | 'personal-live'
  | 'exact-fee'
  | 'nonexistent-policy'
  | 'secret-internal'
  | 'low-confidence';

export type ChatErrorType =
  | 'quota'
  | 'auth'
  | 'timeout'
  | 'network'
  | 'server'
  | 'missing-key'
  | 'malformed'
  | 'aborted';

export interface KnowledgeRecord {
  id: string;
  title: string;
  category: KnowledgeCategory;
  subcategory: string;
  content: string;
  description: string;
  tags: string[];
  keywords: string[];
  sourceUrl: string;
  sourceName: string;
  sourceType: SourceType;
  verificationStatus: VerificationStatus;
  sourceLabel: VerificationStatus;
  lastReviewedDate: string;
  lastChecked: string;
  isPrototypeSample: boolean;
  freshnessStatus?: FreshnessStatus;
  freshnessNote?: string;
  isCustomDemo?: boolean;
}

export interface RetrievedMatch {
  record: KnowledgeRecord;
  score: number;
  matchedTerms: string[];
  matchReason: string;
}

export type QueryIntent =
  | 'greeting'
  | 'capabilities'
  | 'general-ai'
  | 'unverified-personal'
  | 'university-query';

export interface RagCitation {
  title: string;
  url: string;
  sourceName: string;
  sourceLabel: VerificationStatus;
  verificationStatus: VerificationStatus;
  sourceType: SourceType;
  lastChecked: string;
  freshnessStatus: FreshnessStatus;
  freshnessNote?: string;
}

export interface RagTrace {
  query: string;
  effectiveRetrievalQuery?: string;
  normalizedTokens: string[];
  expandedTerms: string[];
  intent: QueryIntent;
  refusalCategory?: RefusalCategory;
  shortCircuited?: boolean;
  lowConfidence?: boolean;
  demoExcludedCount?: number;
  retrieved: RetrievedMatch[];
  usedOfficialCount: number;
  usedDemoCount: number;
  citations: RagCitation[];
  model: string;
  mode: 'gemini-rag' | 'kb-fallback' | 'verified-refusal';
  fallbackReason?: string;
  errorType?: ChatErrorType;
  hallucinationGuardTriggered: boolean;
  promptInjectionDetected: boolean;
  groundedContextPreview: string;
  latencyMs: number;
}

export interface ChatMessage {
  evidenceIds?: string[];
  answerPath?: string;
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  ragTrace?: RagTrace;
  suggestedFollowUps?: string[];
  feedback?: 'helpful' | 'not-helpful' | null;
  retryQuery?: string;
  retryAllowDemo?: boolean;
  isError?: boolean;
  errorType?: ChatErrorType;
}

export interface SystemStatusInfo {
  online: boolean;
  geminiConfigured: boolean | null;
  model: string;
  lastAiMode: 'gemini-rag' | 'kb-fallback' | null;
  lastFallbackReason?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface FacilityItem {
  id: string;
  name: string;
  category: 'Library' | 'Hostels' | 'Mess & Dining' | 'Transport' | 'Sports' | 'Academic' | 'Medical & Safety' | 'Campus Services';
  summary: string;
  verifiedDetails: string[];
  demoDetails: string[];
  sourceUrl: string;
  sourceName: string;
  lastChecked: string;
  image?: string;
  suggestedQuestion: string;
}

export interface AccessSession {
  displayName: string;
  rollNumber?: string;
  mode: 'student' | 'guest';
}

export interface ClubItem {
  id: string;
  name: string;
  category: 'Technical' | 'Media & Creative' | 'Cultural & Arts' | 'Literary & Debate' | 'Sports & Fitness' | 'Departmental';
  description: string;
  sourceType: SourceType;
  sourceLabel: VerificationStatus;
  sourceUrl: string;
  sourceName: string;
  lastChecked: string;
  verifiedActivities: string[];
  demoSchedule: string;
  demoUpcomingActivity: string;
  demoVenueNote: string;
}

export interface ClubRegistration {
  clubId: string;
  clubName: string;
  studentName: string;
  courseYear: string;
  interestNote: string;
  registeredAt: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Technical' | 'Cultural' | 'Workshop' | 'Academic' | 'Sports' | 'Career';
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  venue: string;
  organizer: string;
  description: string;
  sourceType: SourceType;
  sourceLabel: VerificationStatus;
  sourceUrl: string;
  lastChecked: string;
}

export interface HelpdeskTicket {
  id: string;
  subject: string;
  category: 'Hostel & Mess' | 'Transport' | 'Academics & Campus Desk' | 'Library' | 'Student Welfare' | 'IT & Wi-Fi' | 'General';
  description: string;
  studentName: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Submitted' | 'In Review' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  isDemoPreloaded?: boolean;
}

export interface SocialChannel {
  id: string;
  name: string;
  handle: string;
  platform: 'Instagram' | 'YouTube';
  url: string;
  classification: 'Official' | 'Unofficial / Community';
  description: string;
  note: string;
}

export interface TimetableSlot {
  day: string;
  time: string;
  subject: string;
  code: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  room: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  sourceLabel: 'Prototype sample';
}

export interface FavoriteResource {
  id: string;
  title: string;
  type: 'facility' | 'club' | 'kb' | 'portal';
  targetPage: PageId;
  url?: string;
}

export interface RecentlyViewedItem {
  id: string;
  title: string;
  category: string;
  type: 'facility' | 'club' | 'kb' | 'event' | 'page';
  targetPage: PageId;
  viewedAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  programme: string;
  year: string;
  interests: string[];
  preferredCategories: KnowledgeCategory[];
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ToastItem {
  id: string;
  message: string;
  variant: 'info' | 'success' | 'warning';
}

export interface SuggestedPrompt {
  id: string;
  question: string;
  category: string;
  intentHint: 'Verified Source' | 'Clubs' | 'Events' | 'Prototype Sample' | 'Safety / Guardrail' | 'General AI';
}
