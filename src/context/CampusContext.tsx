import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  PRELOADED_DEMO_TICKETS,
  PRESENTATION_TOUR_STEPS,
} from '../data/campusDirectory';
import { records as SEED_KNOWLEDGE_BASE } from '../data/cedar';
import type {
  ChatMessage,
  ChatSession,
  ClubRegistration,
  FavoriteResource,
  HelpdeskTicket,
  KnowledgeCategory,
  KnowledgeRecord,
  PageId,
  RecentlyViewedItem,
  StudentProfile,
  SystemStatusInfo,
  ToastItem,
} from '../types/campus';

const STORAGE_KEYS = {
  theme: 'gla_campus_ai_theme',
  sessions: 'cedar_sessions_v1',
  clubRegs: 'cedar_club_regs_v1',
  eventRegs: 'cedar_event_regs_v1',
  tickets: 'cedar_tickets_v1',
  customKb: 'cedar_custom_kb_v1',
  deletedDemoIds: 'cedar_deleted_demo_ids_v1',
  favorites: 'cedar_favorites_v1',
  recentQuestions: 'cedar_recent_questions_v1',
  userProfile: 'gla_campus_ai_profile_v1',
  savedProfiles: 'gla_campus_ai_saved_profiles_v1',
  recentlyViewed: 'cedar_recently_viewed_v1',
};

export const INITIAL_GREETING =
  "Hi! What would you like to know about Cedarbrook Campus?";

export function createGuestProfile(): StudentProfile {
  const now = new Date().toISOString();
  return {
    id: 'guest',
    name: 'Guest Student',
    programme: 'B.Tech CSE',
    year: '1st Year',
    interests: ['Coding & AI', 'Library & Research', 'Campus Life & Wellbeing'],
    preferredCategories: ['Library', 'Clubs & Societies', 'Academics'],
    isGuest: true,
    createdAt: now,
    updatedAt: now,
  };
}

function createFreshSession(title = 'New Campus Chat', idPrefix = 'chat'): ChatSession {
  const now = new Date().toISOString();
  return {
    id: `${idPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `msg-greet-${Date.now()}`,
        role: 'assistant',
        content: INITIAL_GREETING,
        timestamp: now,
        suggestedFollowUps: [
          'Tell me about the library.',
          'What clubs can I join at Cedarbrook Campus?',
          'Are there any upcoming events?',
          'Who is teaching my class tomorrow?',
        ],
      },
    ],
  };
}

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface ProfileInput {
  name: string;
  programme: string;
  year: string;
  interests: string[];
  preferredCategories: KnowledgeCategory[];
}

interface CampusContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activePage: PageId;
  navigate: (page: PageId) => void;
  openAssistantWithPrompt: (prompt: string) => void;
  pendingPrompt: string | null;
  clearPendingPrompt: () => void;

  // Prototype Local Account (localStorage only — no real authentication)
  userProfile: StudentProfile;
  savedProfiles: StudentProfile[];
  saveLocalProfile: (input: ProfileInput) => StudentProfile;
  signInSavedProfile: (profileId: string) => boolean;
  quickSignInByName: (name: string) => StudentProfile;
  continueAsGuest: () => void;
  logoutToGuest: () => void;

  // Knowledge Base Category Deep-Link Preset
  kbCategoryPreset: 'All' | KnowledgeCategory;
  setKbCategoryPreset: (cat: 'All' | KnowledgeCategory) => void;
  openKnowledgeBaseCategory: (cat: KnowledgeCategory) => void;

  // Recently Viewed Activity (localStorage)
  recentlyViewed: RecentlyViewedItem[];
  trackRecentlyViewed: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;

  // Chat sessions (normal vs isolated demo mode)
  chatSessions: ChatSession[];
  activeSession: ChatSession;
  selectSession: (id: string) => void;
  createNewSession: () => void;
  clearActiveSession: () => void;
  appendMessageToActive: (msg: ChatMessage, maybeTitle?: string) => void;
  setMessageFeedback: (messageId: string, feedback: 'helpful' | 'not-helpful') => void;
  deleteSession: (id: string) => void;

  // Knowledge Base (Verified source read-only + Prototype sample CRUD)
  knowledgeBase: KnowledgeRecord[];
  customDemoRecords: KnowledgeRecord[];
  addDemoRecord: (
    record: Pick<KnowledgeRecord, 'title' | 'category' | 'description' | 'keywords' | 'sourceUrl' | 'sourceName' | 'lastChecked'> & {
      subcategory?: string;
    }
  ) => void;
  updateDemoRecord: (id: string, updates: Partial<KnowledgeRecord>) => void;
  deleteDemoRecord: (id: string) => void;

  // Clubs Local Prototype Interest
  clubRegistrations: ClubRegistration[];
  registerClubInterest: (reg: Omit<ClubRegistration, 'registeredAt'>) => void;
  cancelClubInterest: (clubId: string) => void;

  // Events Local Prototype RSVP
  eventRegistrations: string[];
  toggleEventRegistration: (eventId: string, eventTitle: string) => void;

  // Local Prototype Helpdesk Tickets
  tickets: HelpdeskTicket[];
  createDemoTicket: (
    data: Pick<HelpdeskTicket, 'subject' | 'category' | 'description' | 'studentName' | 'priority'>
  ) => HelpdeskTicket;
  updateDemoTicketStatus: (id: string, status: HelpdeskTicket['status']) => void;

  // Favorites & Recent Questions
  favorites: FavoriteResource[];
  toggleFavorite: (item: FavoriteResource) => void;
  isFavorite: (id: string) => boolean;
  recentQuestions: string[];
  recordRecentQuestion: (q: string) => void;

  // Guided Presentation Demo Mode (isolated from ordinary user data)
  isPresentationMode: boolean;
  presentationStepIndex: number;
  startPresentationMode: () => void;
  exitPresentationMode: () => void;
  goToPresentationStep: (idx: number) => void;

  // System Status (Live Gemini availability vs Local Fallback)
  systemStatus: SystemStatusInfo;
  reportAiMode: (mode: 'gemini-rag' | 'kb-fallback', reason?: string) => void;

  // Global Search, Saved Resources Drawer, Toasts & Reset
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSavedModalOpen: boolean;
  setIsSavedModalOpen: (open: boolean) => void;
  toasts: ToastItem[];
  pushToast: (message: string, variant?: ToastItem['variant']) => void;
  dismissToast: (id: string) => void;
  resetAllPrototypeData: () => void;
}

const CampusContext = createContext<CampusContextValue | null>(null);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.theme);
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [activePage, setActivePage] = useState<PageId>('home');
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [kbCategoryPreset, setKbCategoryPreset] = useState<'All' | KnowledgeCategory>('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatusInfo>(() => ({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    geminiConfigured: null,
    model: 'gemini-3.1-flash-lite',
    lastAiMode: null,
  }));

  useEffect(() => {
    const onOnline = () => setSystemStatus((prev) => ({ ...prev, online: true }));
    const onOffline = () =>
      setSystemStatus((prev) => ({
        ...prev,
        online: false,
        lastAiMode: 'kb-fallback',
        lastFallbackReason: 'Browser offline',
      }));
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    fetch('/api/health', { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setSystemStatus((prev) => ({
            ...prev,
            geminiConfigured: Boolean(d.geminiConfigured),
            model: typeof d.model === 'string' ? d.model : prev.model,
          }));
        } else {
          setSystemStatus((prev) => ({ ...prev, geminiConfigured: false }));
        }
      })
      .catch(() => {
        setSystemStatus((prev) => ({ ...prev, geminiConfigured: false }));
      })
      .finally(() => clearTimeout(timer));

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  const reportAiMode = useCallback((mode: 'gemini-rag' | 'kb-fallback', reason?: string) => {
    setSystemStatus((prev) => ({
      ...prev,
      lastAiMode: mode,
      lastFallbackReason: mode === 'kb-fallback' ? reason : undefined,
    }));
  }, []);

  // Local Prototype Profile & Saved Browser Profiles
  const [userProfile, setUserProfile] = useState<StudentProfile>(() =>
    safeReadJson<StudentProfile>(STORAGE_KEYS.userProfile, createGuestProfile())
  );
  const [savedProfiles, setSavedProfiles] = useState<StudentProfile[]>(() =>
    safeReadJson<StudentProfile[]>(STORAGE_KEYS.savedProfiles, [])
  );

  // Recently Viewed Items
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(() =>
    safeReadJson<RecentlyViewedItem[]>(STORAGE_KEYS.recentlyViewed, [])
  );

  // Normal persisted sessions
  const [userSessions, setUserSessions] = useState<ChatSession[]>(() => {
    const saved = safeReadJson<ChatSession[]>(STORAGE_KEYS.sessions, []);
    return saved.length > 0 ? saved : [createFreshSession()];
  });
  const [activeUserSessionId, setActiveUserSessionId] = useState<string>(() => userSessions[0]?.id ?? '');

  // Isolated Presentation Demo Mode state (never written to user localStorage!)
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [presentationStepIndex, setPresentationStepIndex] = useState(0);
  const [demoSession, setDemoSession] = useState<ChatSession>(() =>
    createFreshSession('Professor Viva Demo Session', 'viva-demo')
  );

  // Persisted Demo CRUD / Registrations / Tickets / Favorites
  const [customDemoRecords, setCustomDemoRecords] = useState<KnowledgeRecord[]>(() =>
    safeReadJson<KnowledgeRecord[]>(STORAGE_KEYS.customKb, [])
  );
  const [deletedDemoIds, setDeletedDemoIds] = useState<string[]>(() =>
    safeReadJson<string[]>(STORAGE_KEYS.deletedDemoIds, [])
  );
  const [clubRegistrations, setClubRegistrations] = useState<ClubRegistration[]>(() =>
    safeReadJson<ClubRegistration[]>(STORAGE_KEYS.clubRegs, [])
  );
  const [eventRegistrations, setEventRegistrations] = useState<string[]>(() =>
    safeReadJson<string[]>(STORAGE_KEYS.eventRegs, [])
  );
  const [tickets, setTickets] = useState<HelpdeskTicket[]>(() => {
    const saved = safeReadJson<HelpdeskTicket[]>(STORAGE_KEYS.tickets, []);
    return saved.length > 0 ? saved : PRELOADED_DEMO_TICKETS;
  });
  const [favorites, setFavorites] = useState<FavoriteResource[]>(() =>
    safeReadJson<FavoriteResource[]>(STORAGE_KEYS.favorites, [
      {
        id: 'fac-library',
        title: 'Central & Departmental Libraries',
        type: 'facility',
        targetPage: 'facilities',
      },
    ])
  );
  const [recentQuestions, setRecentQuestions] = useState<string[]>(() =>
    safeReadJson<string[]>(STORAGE_KEYS.recentQuestions, [
      'Tell me about the library.',
      'What clubs can I join at Cedarbrook Campus?',
      'Where can I find transport information?',
    ])
  );

  // Sync theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {}
  }, [theme]);

  // Persist user data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(userProfile));
      localStorage.setItem(STORAGE_KEYS.savedProfiles, JSON.stringify(savedProfiles));
    } catch {}
  }, [userProfile, savedProfiles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.recentlyViewed, JSON.stringify(recentlyViewed));
    } catch {}
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(userSessions));
    } catch {}
  }, [userSessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.customKb, JSON.stringify(customDemoRecords));
      localStorage.setItem(STORAGE_KEYS.deletedDemoIds, JSON.stringify(deletedDemoIds));
    } catch {}
  }, [customDemoRecords, deletedDemoIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.clubRegs, JSON.stringify(clubRegistrations));
    } catch {}
  }, [clubRegistrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.eventRegs, JSON.stringify(eventRegistrations));
    } catch {}
  }, [eventRegistrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.tickets, JSON.stringify(tickets));
    } catch {}
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.recentQuestions, JSON.stringify(recentQuestions));
    } catch {}
  }, [recentQuestions]);

  // Global keyboard shortcut Cmd/Ctrl+K for search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const pushToast = useCallback((message: string, variant: ToastItem['variant'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const trackRecentlyViewed = useCallback((item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
    const now = new Date().toISOString();
    setRecentlyViewed((prev) => {
      const next: RecentlyViewedItem = { ...item, viewedAt: now };
      return [next, ...prev.filter((x) => x.id !== item.id)].slice(0, 8);
    });
  }, []);

  const navigate = useCallback((page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openKnowledgeBaseCategory = useCallback(
    (cat: KnowledgeCategory) => {
      setKbCategoryPreset(cat);
      setActivePage('knowledge-base');
      trackRecentlyViewed({
        id: `kb-cat-${cat}`,
        title: `${cat} Knowledge Records`,
        category: cat,
        type: 'page',
        targetPage: 'knowledge-base',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [trackRecentlyViewed]
  );

  const openAssistantWithPrompt = useCallback((prompt: string) => {
    setPendingPrompt(prompt);
    setActivePage('assistant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearPendingPrompt = useCallback(() => {
    setPendingPrompt(null);
  }, []);

  // Local Prototype Profile Actions (localStorage only)
  const saveLocalProfile = useCallback(
    (input: ProfileInput): StudentProfile => {
      const now = new Date().toISOString();
      const existingId = !userProfile.isGuest ? userProfile.id : `student-${Date.now()}`;
      const profile: StudentProfile = {
        id: existingId,
        name: input.name.trim(),
        programme: input.programme.trim() || 'B.Tech CSE',
        year: input.year.trim() || '1st Year',
        interests: input.interests.length > 0 ? input.interests : ['Coding & AI'],
        preferredCategories:
          input.preferredCategories.length > 0
            ? input.preferredCategories
            : ['Academics', 'Clubs & Societies'],
        isGuest: false,
        createdAt: !userProfile.isGuest ? userProfile.createdAt : now,
        updatedAt: now,
      };
      setUserProfile(profile);
      setSavedProfiles((prev) => [profile, ...prev.filter((p) => p.id !== profile.id)].slice(0, 5));
      pushToast(`Saved local profile for ${profile.name} (browser only).`, 'success');
      return profile;
    },
    [userProfile, pushToast]
  );

  const signInSavedProfile = useCallback(
    (profileId: string): boolean => {
      const found = savedProfiles.find((p) => p.id === profileId);
      if (!found) return false;
      setUserProfile({ ...found, isGuest: false, updatedAt: new Date().toISOString() });
      pushToast(`Signed in locally as ${found.name}.`, 'success');
      return true;
    },
    [savedProfiles, pushToast]
  );

  const quickSignInByName = useCallback(
    (name: string): StudentProfile => {
      const trimmed = name.trim();
      const existing = savedProfiles.find(
        (p) => p.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (existing) {
        const updated = { ...existing, isGuest: false, updatedAt: new Date().toISOString() };
        setUserProfile(updated);
        pushToast(`Welcome back, ${updated.name} (local browser profile).`, 'success');
        return updated;
      }
      return saveLocalProfile({
        name: trimmed,
        programme: 'B.Tech CSE',
        year: '1st Year',
        interests: ['Coding & AI', 'Library & Research'],
        preferredCategories: ['Academics', 'Library', 'Clubs & Societies'],
      });
    },
    [savedProfiles, saveLocalProfile, pushToast]
  );

  const continueAsGuest = useCallback(() => {
    setUserProfile(createGuestProfile());
    setActivePage('home');
    pushToast('Continuing in Guest mode.', 'info');
  }, [pushToast]);

  const logoutToGuest = useCallback(() => {
    setUserProfile(createGuestProfile());
    pushToast('Signed out of local browser profile (switched to Guest).', 'info');
  }, [pushToast]);

  // Merged KB
  const knowledgeBase = useMemo<KnowledgeRecord[]>(() => {
    const deletedSet = new Set(deletedDemoIds);
    const byId = new Map<string, KnowledgeRecord>();

    for (const seed of SEED_KNOWLEDGE_BASE) {
      if (seed.sourceType === 'demo' && deletedSet.has(seed.id)) continue;
      byId.set(seed.id, seed);
    }

    for (const custom of customDemoRecords) {
      if (deletedSet.has(custom.id)) continue;
      const existing = byId.get(custom.id);
      if (existing && existing.sourceType === 'official') continue;
      const desc = custom.content || custom.description;
      const tags = custom.tags?.length ? custom.tags : custom.keywords;
      const reviewed = custom.lastReviewedDate || custom.lastChecked || '2026-11-23';
      byId.set(custom.id, {
        ...custom,
        subcategory: custom.subcategory || 'Custom Sample',
        content: desc,
        description: desc,
        tags,
        keywords: tags,
        sourceType: 'demo',
        verificationStatus: 'Prototype sample',
        sourceLabel: 'Prototype sample',
        lastReviewedDate: reviewed,
        lastChecked: reviewed,
        isPrototypeSample: true,
        freshnessStatus: 'demo-static',
        freshnessNote: 'Saved on this device.',
        isCustomDemo: true,
      });
    }

    return Array.from(byId.values());
  }, [customDemoRecords, deletedDemoIds]);

  const activeSession = useMemo(() => {
    if (isPresentationMode) return demoSession;
    return userSessions.find((s) => s.id === activeUserSessionId) ?? userSessions[0] ?? createFreshSession();
  }, [isPresentationMode, demoSession, userSessions, activeUserSessionId]);

  const chatSessions = useMemo(
    () => (isPresentationMode ? [demoSession] : userSessions),
    [isPresentationMode, demoSession, userSessions]
  );

  const selectSession = useCallback(
    (id: string) => {
      if (isPresentationMode) return;
      setActiveUserSessionId(id);
    },
    [isPresentationMode]
  );

  const createNewSession = useCallback(() => {
    if (isPresentationMode) {
      setDemoSession(createFreshSession('Professor Viva Demo Session', 'viva-demo'));
      pushToast('Started a clean isolated presentation chat.', 'info');
      return;
    }
    const fresh = createFreshSession();
    setUserSessions((prev) => [fresh, ...prev]);
    setActiveUserSessionId(fresh.id);
    pushToast('New conversation started.', 'info');
  }, [isPresentationMode, pushToast]);

  const clearActiveSession = useCallback(() => {
    const fresh = createFreshSession(
      isPresentationMode ? 'Professor Viva Demo Session' : 'New Campus Chat',
      isPresentationMode ? 'viva-demo' : 'chat'
    );
    if (isPresentationMode) {
      setDemoSession(fresh);
      pushToast('Presentation chat cleared.', 'info');
      return;
    }
    setUserSessions((prev) =>
      prev.map((s) => (s.id === activeSession.id ? { ...fresh, id: s.id } : s))
    );
    pushToast('Current chat cleared.', 'info');
  }, [isPresentationMode, activeSession.id, pushToast]);

  const deleteSession = useCallback(
    (id: string) => {
      if (isPresentationMode) return;
      setUserSessions((prev) => {
        const remaining = prev.filter((s) => s.id !== id);
        if (remaining.length === 0) {
          const fresh = createFreshSession();
          setActiveUserSessionId(fresh.id);
          return [fresh];
        }
        if (activeUserSessionId === id) {
          setActiveUserSessionId(remaining[0].id);
        }
        return remaining;
      });
    },
    [isPresentationMode, activeUserSessionId]
  );

  const appendMessageToActive = useCallback(
    (msg: ChatMessage, maybeTitle?: string) => {
      const now = new Date().toISOString();
      if (isPresentationMode) {
        setDemoSession((prev) => ({
          ...prev,
          updatedAt: now,
          messages: [...prev.messages, msg],
        }));
        return;
      }

      setUserSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeSession.id) return s;
          const shouldRename = s.title === 'New Campus Chat' && maybeTitle;
          return {
            ...s,
            title: shouldRename ? maybeTitle.slice(0, 44) : s.title,
            updatedAt: now,
            messages: [...s.messages, msg],
          };
        })
      );
    },
    [isPresentationMode, activeSession.id]
  );

  const setMessageFeedback = useCallback(
    (messageId: string, feedback: 'helpful' | 'not-helpful') => {
      const updateMsgs = (msgs: ChatMessage[]) =>
        msgs.map((m) => (m.id === messageId ? { ...m, feedback } : m));

      if (isPresentationMode) {
        setDemoSession((prev) => ({ ...prev, messages: updateMsgs(prev.messages) }));
      } else {
        setUserSessions((prev) =>
          prev.map((s) => (s.id === activeSession.id ? { ...s, messages: updateMsgs(s.messages) } : s))
        );
      }
      pushToast(
        feedback === 'helpful' ? 'Thanks! Marked response as helpful.' : 'Feedback noted — we will refine retrieval.',
        'success'
      );
    },
    [isPresentationMode, activeSession.id, pushToast]
  );

  // Knowledge Base Prototype Sample CRUD
  const addDemoRecord = useCallback(
    (
      record: Pick<KnowledgeRecord, 'title' | 'category' | 'description' | 'keywords' | 'sourceUrl' | 'sourceName' | 'lastChecked'> & {
        subcategory?: string;
      }
    ) => {
      const newRec: KnowledgeRecord = {
        id: `kb-sample-custom-${Date.now()}`,
        title: record.title,
        category: record.category,
        subcategory: record.subcategory?.trim() || 'Custom Sample',
        content: record.description,
        description: record.description,
        tags: record.keywords,
        keywords: record.keywords,
        sourceUrl: record.sourceUrl,
        sourceName: record.sourceName,
        sourceType: 'demo',
        verificationStatus: 'Prototype sample',
        sourceLabel: 'Prototype sample',
        lastReviewedDate: record.lastChecked,
        lastChecked: record.lastChecked,
        isPrototypeSample: true,
        freshnessStatus: 'demo-static',
        freshnessNote: 'Saved on this device.',
        isCustomDemo: true,
      };
      setCustomDemoRecords((prev) => [newRec, ...prev]);
      pushToast('Added new Prototype sample record (saved in this browser).', 'success');
    },
    [pushToast]
  );

  const updateDemoRecord = useCallback(
    (id: string, updates: Partial<KnowledgeRecord>) => {
      const target = knowledgeBase.find((r) => r.id === id);
      if (!target || target.sourceType === 'official') {
        pushToast('Verified source records are read-only.', 'warning');
        return;
      }
      const desc = updates.content ?? updates.description ?? target.description;
      const tags = updates.tags ?? updates.keywords ?? target.keywords;
      const reviewed = updates.lastReviewedDate ?? updates.lastChecked ?? target.lastReviewedDate;
      const updated: KnowledgeRecord = {
        ...target,
        ...updates,
        id,
        subcategory: updates.subcategory ?? target.subcategory ?? 'Custom Sample',
        content: desc,
        description: desc,
        tags,
        keywords: tags,
        sourceType: 'demo',
        verificationStatus: 'Prototype sample',
        sourceLabel: 'Prototype sample',
        lastReviewedDate: reviewed,
        lastChecked: reviewed,
        isPrototypeSample: true,
        freshnessStatus: 'demo-static',
        freshnessNote: 'Saved on this device.',
        isCustomDemo: true,
      };
      setCustomDemoRecords((prev) => {
        const exists = prev.some((r) => r.id === id);
        return exists ? prev.map((r) => (r.id === id ? updated : r)) : [updated, ...prev];
      });
      pushToast('Prototype sample record updated locally.', 'success');
    },
    [knowledgeBase, pushToast]
  );

  const deleteDemoRecord = useCallback(
    (id: string) => {
      const target = knowledgeBase.find((r) => r.id === id);
      if (!target || target.sourceType === 'official') {
        pushToast('Verified source records are protected from deletion.', 'warning');
        return;
      }
      setCustomDemoRecords((prev) => prev.filter((r) => r.id !== id));
      setDeletedDemoIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      pushToast('Prototype sample record removed.', 'info');
    },
    [knowledgeBase, pushToast]
  );

  // Club Registrations (Local Prototype Workflow)
  const registerClubInterest = useCallback(
    (reg: Omit<ClubRegistration, 'registeredAt'>) => {
      const entry: ClubRegistration = { ...reg, registeredAt: new Date().toISOString() };
      setClubRegistrations((prev) => [entry, ...prev.filter((r) => r.clubId !== reg.clubId)]);
      pushToast(`Local prototype interest saved for ${reg.clubName} (browser only).`, 'success');
    },
    [pushToast]
  );

  const cancelClubInterest = useCallback(
    (clubId: string) => {
      setClubRegistrations((prev) => prev.filter((r) => r.clubId !== clubId));
      pushToast('Local club interest removed.', 'info');
    },
    [pushToast]
  );

  // Event Registrations (Local Prototype Workflow)
  const toggleEventRegistration = useCallback(
    (eventId: string, eventTitle: string) => {
      setEventRegistrations((prev) => {
        const exists = prev.includes(eventId);
        if (exists) {
          pushToast(`Removed RSVP for ${eventTitle}.`, 'info');
          return prev.filter((id) => id !== eventId);
        }
        pushToast(`Saved RSVP for ${eventTitle} (browser storage only).`, 'success');
        return [...prev, eventId];
      });
    },
    [pushToast]
  );

  // Helpdesk Tickets (Local Prototype Workflow)
  const createDemoTicket = useCallback(
    (data: Pick<HelpdeskTicket, 'subject' | 'category' | 'description' | 'studentName' | 'priority'>) => {
      const now = new Date().toISOString();
      const num = 104 + tickets.length;
      const newTicket: HelpdeskTicket = {
        id: `TKT-${num}`,
        ...data,
        status: 'Submitted',
        createdAt: now,
        updatedAt: now,
      };
      setTickets((prev) => [newTicket, ...prev]);
      pushToast(`Created ${newTicket.id} on this device.`, 'success');
      return newTicket;
    },
    [tickets.length, pushToast]
  );

  const updateDemoTicketStatus = useCallback(
    (id: string, status: HelpdeskTicket['status']) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t))
      );
      pushToast(`Updated ${id} status to ${status} (local prototype).`, 'info');
    },
    [pushToast]
  );

  // Favorites
  const toggleFavorite = useCallback(
    (item: FavoriteResource) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === item.id);
        if (exists) {
          pushToast(`Removed "${item.title}" from saved resources.`, 'info');
          return prev.filter((f) => f.id !== item.id);
        }
        pushToast(`Saved "${item.title}" to saved resources.`, 'success');
        return [item, ...prev];
      });
    },
    [pushToast]
  );

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const recordRecentQuestion = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentQuestions((prev) => [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, 8));
  }, []);

  // Guided Presentation Demo Mode (isolated)
  const startPresentationMode = useCallback(() => {
    setDemoSession(createFreshSession('Professor Viva Demo Session', 'viva-demo'));
    setPresentationStepIndex(0);
    setIsPresentationMode(true);
    setActivePage(PRESENTATION_TOUR_STEPS[0].page);
    pushToast('Entered Guided Presentation Mode (user data isolated).', 'info');
  }, [pushToast]);

  const exitPresentationMode = useCallback(() => {
    setIsPresentationMode(false);
    setPendingPrompt(null);
    pushToast('Exited Presentation Mode. Your regular data is intact.', 'info');
  }, [pushToast]);

  const goToPresentationStep = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(PRESENTATION_TOUR_STEPS.length - 1, idx));
    setPresentationStepIndex(clamped);
    setActivePage(PRESENTATION_TOUR_STEPS[clamped].page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Reset All User Data
  const resetAllPrototypeData = useCallback(() => {
    const fresh = createFreshSession();
    setUserSessions([fresh]);
    setActiveUserSessionId(fresh.id);
    setUserProfile(createGuestProfile());
    setSavedProfiles([]);
    setRecentlyViewed([]);
    setCustomDemoRecords([]);
    setDeletedDemoIds([]);
    setClubRegistrations([]);
    setEventRegistrations([]);
    setTickets(PRELOADED_DEMO_TICKETS);
    setFavorites([
      {
        id: 'fac-library',
        title: 'Central & Departmental Libraries',
        type: 'facility',
        targetPage: 'facilities',
      },
    ]);
    setRecentQuestions([
      'Tell me about the library.',
      'What clubs can I join at Cedarbrook Campus?',
      'Where can I find transport information?',
    ]);
    pushToast('All local prototype data reset to default state.', 'success');
  }, [pushToast]);

  const value: CampusContextValue = {
    theme,
    toggleTheme,
    activePage,
    navigate,
    openAssistantWithPrompt,
    pendingPrompt,
    clearPendingPrompt,
    userProfile,
    savedProfiles,
    saveLocalProfile,
    signInSavedProfile,
    quickSignInByName,
    continueAsGuest,
    logoutToGuest,
    kbCategoryPreset,
    setKbCategoryPreset,
    openKnowledgeBaseCategory,
    recentlyViewed,
    trackRecentlyViewed,
    chatSessions,
    activeSession,
    selectSession,
    createNewSession,
    clearActiveSession,
    appendMessageToActive,
    setMessageFeedback,
    deleteSession,
    knowledgeBase,
    customDemoRecords,
    addDemoRecord,
    updateDemoRecord,
    deleteDemoRecord,
    clubRegistrations,
    registerClubInterest,
    cancelClubInterest,
    eventRegistrations,
    toggleEventRegistration,
    tickets,
    createDemoTicket,
    updateDemoTicketStatus,
    favorites,
    toggleFavorite,
    isFavorite,
    recentQuestions,
    recordRecentQuestion,
    isPresentationMode,
    presentationStepIndex,
    startPresentationMode,
    exitPresentationMode,
    goToPresentationStep,
    systemStatus,
    reportAiMode,
    isSearchOpen,
    setIsSearchOpen,
    isSavedModalOpen,
    setIsSavedModalOpen,
    toasts,
    pushToast,
    dismissToast,
    resetAllPrototypeData,
  };

  return <CampusContext.Provider value={value}>{children}</CampusContext.Provider>;
};

export function useCampus(): CampusContextValue {
  const ctx = useContext(CampusContext);
  if (!ctx) throw new Error('useCampus must be used inside CampusProvider');
  return ctx;
}
