import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRELOADED_DEMO_TICKETS } from '../data/campusDirectory';
import { records as SEED_KNOWLEDGE_BASE } from '../data/cedar';
import type {
  AccessSession,
  ChatMessage,
  ChatSession,
  ClubRegistration,
  FavoriteResource,
  HelpdeskTicket,
  KnowledgeCategory,
  KnowledgeRecord,
  PageId,
  RecentlyViewedItem,
  SystemStatusInfo,
  ToastItem,
} from '../types/campus';

const STORAGE_KEYS = {
  theme: 'campus_assist_theme',
  legacyTheme: 'gla_campus_ai_theme',
  clubRegs: 'campus_assist_club_regs_v1',
  eventRegs: 'campus_assist_event_regs_v1',
  tickets: 'campus_assist_tickets_v1',
  customKb: 'campus_assist_custom_resources_v1',
  deletedIds: 'campus_assist_deleted_resources_v1',
  favorites: 'campus_assist_favorites_v1',
  recentlyViewed: 'campus_assist_recently_viewed_v1',
  // Stores ONLY rollNumber -> displayName mapping on this device (NEVER passwords!)
  studentDirectory: 'campus_assist_student_directory_v1',
};

const SESSION_KEYS = {
  accessSession: 'campus_assist_access_session_v1',
  legacyGuestEntered: 'campus_assist_guest_entered',
};

const LEGACY_STORAGE_KEYS_TO_CLEAR = [
  'gla_campus_sessions_v1',
  'gla_campus_sessions_v2',
  'gla_campus_recent_questions_v1',
  'gla_campus_recent_questions_v2',
  'gla_campus_ai_profile_v1',
  'gla_campus_ai_saved_profiles_v1',
  'campus_assist_sessions',
  'campus_assist_recent_questions',
  'campus_assist_guest_entered',
];

export const INITIAL_GREETING =
  'Welcome to Campus Assist. Ask about campus services, academics, facilities, student activities, or support resources.';

const VALID_PAGES: PageId[] = [
  'home',
  'assistant',
  'facilities',
  'clubs',
  'events',
  'academics',
  'services',
  'knowledge-base',
];

function clearLegacyAssistantStorage(): void {
  if (typeof window === 'undefined') return;
  for (const key of LEGACY_STORAGE_KEYS_TO_CLEAR) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore storage access errors
    }
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // Ignore storage access errors
    }
  }
}

function readInitialAccessSession(): AccessSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEYS.accessSession);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AccessSession>;
    if (
      parsed &&
      typeof parsed.displayName === 'string' &&
      parsed.displayName.trim() &&
      (parsed.mode === 'student' || parsed.mode === 'guest')
    ) {
      return {
        displayName: parsed.displayName.trim(),
        rollNumber: typeof parsed.rollNumber === 'string' ? parsed.rollNumber.trim() : undefined,
        mode: parsed.mode,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function readStudentNameMap(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.studentDirectory);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === 'string' && v.trim()) {
          clean[k.toUpperCase()] = v.trim();
        }
      }
      return clean;
    }
    return {};
  } catch {
    return {};
  }
}

function readPageFromHash(): PageId {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase() as PageId;
  return VALID_PAGES.includes(raw) ? raw : 'home';
}

function createFreshSession(): ChatSession {
  const now = new Date().toISOString();
  return {
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: 'Campus Assist',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `msg-greet-${Date.now()}`,
        role: 'assistant',
        content: INITIAL_GREETING,
        timestamp: now,
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

interface CampusContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  accessSession: AccessSession | null;
  hasEnteredDashboard: boolean;
  signInStudent: (rollNumber: string) => void;
  registerStudent: (fullName: string, rollNumber: string) => void;
  enterAsGuest: () => void;
  signOut: () => void;
  returnToWelcome: () => void;
  activePage: PageId;
  navigate: (page: PageId) => void;
  openAssistantWithPrompt: (prompt: string) => void;
  pendingPrompt: string | null;
  clearPendingPrompt: () => void;

  // Campus Resources Category Deep-Link Preset
  kbCategoryPreset: 'All' | KnowledgeCategory;
  setKbCategoryPreset: (cat: 'All' | KnowledgeCategory) => void;
  openKnowledgeBaseCategory: (cat: KnowledgeCategory) => void;

  // Recently Viewed Activity
  recentlyViewed: RecentlyViewedItem[];
  trackRecentlyViewed: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;

  // Clean Single-Session Assistant (in-memory only, cleared on startup/refresh)
  activeSession: ChatSession;
  clearActiveSession: () => void;
  appendMessageToActive: (msg: ChatMessage, maybeTitle?: string) => void;
  setMessageFeedback: (messageId: string, feedback: 'helpful' | 'not-helpful') => void;

  // Campus Resources
  knowledgeBase: KnowledgeRecord[];
  customDemoRecords: KnowledgeRecord[];
  addDemoRecord: (
    record: Pick<
      KnowledgeRecord,
      'title' | 'category' | 'description' | 'keywords' | 'sourceUrl' | 'sourceName' | 'lastChecked'
    > & {
      subcategory?: string;
    }
  ) => void;
  updateDemoRecord: (id: string, updates: Partial<KnowledgeRecord>) => void;
  deleteDemoRecord: (id: string) => void;

  // Activity Interest Bookmarks
  clubRegistrations: ClubRegistration[];
  registerClubInterest: (reg: Omit<ClubRegistration, 'registeredAt'>) => void;
  cancelClubInterest: (clubId: string) => void;

  // Event bookmarks (retained for compatibility)
  eventRegistrations: string[];
  toggleEventRegistration: (eventId: string, eventTitle: string) => void;

  // Support Requests
  tickets: HelpdeskTicket[];
  createDemoTicket: (
    data: Pick<HelpdeskTicket, 'subject' | 'category' | 'description' | 'studentName' | 'priority'>
  ) => HelpdeskTicket;
  updateDemoTicketStatus: (id: string, status: HelpdeskTicket['status']) => void;

  // Favorites
  favorites: FavoriteResource[];
  toggleFavorite: (item: FavoriteResource) => void;
  isFavorite: (id: string) => boolean;

  // Service Status
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
  resetSavedData: () => void;
}

const CampusContext = createContext<CampusContextValue | null>(null);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  clearLegacyAssistantStorage();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEYS.theme) ?? localStorage.getItem(STORAGE_KEYS.legacyTheme);
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [accessSession, setAccessSession] = useState<AccessSession | null>(() =>
    readInitialAccessSession()
  );
  const hasEnteredDashboard = Boolean(accessSession);
  const [activePage, setActivePage] = useState<PageId>(() => readPageFromHash());

  useEffect(() => {
    clearLegacyAssistantStorage();
  }, []);

  // Keep fresh unauthenticated visits cleanly at `/` (never auto-redirect to `#/home`)
  useEffect(() => {
    if (!hasEnteredDashboard) {
      if (typeof window !== 'undefined' && window.location.hash) {
        window.history.replaceState(null, '', '/');
      }
      return;
    }

    const syncHash = () => {
      const next = readPageFromHash();
      setActivePage(next);
    };
    if (!window.location.hash) {
      window.history.replaceState(null, '', `#/${readPageFromHash()}`);
    }
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [hasEnteredDashboard]);

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

  // In-memory only assistant conversation (never persisted across reloads)
  const [activeSession, setActiveSession] = useState<ChatSession>(() => createFreshSession());

  // Persisted campus preferences & bookmarks
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>(() =>
    safeReadJson<RecentlyViewedItem[]>(STORAGE_KEYS.recentlyViewed, [])
  );
  const [customDemoRecords, setCustomDemoRecords] = useState<KnowledgeRecord[]>(() =>
    safeReadJson<KnowledgeRecord[]>(STORAGE_KEYS.customKb, [])
  );
  const [deletedDemoIds, setDeletedDemoIds] = useState<string[]>(() =>
    safeReadJson<string[]>(STORAGE_KEYS.deletedIds, [])
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
    safeReadJson<FavoriteResource[]>(STORAGE_KEYS.favorites, [])
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
    } catch {
      // Ignore storage access errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.recentlyViewed, JSON.stringify(recentlyViewed));
    } catch {
      // Ignore storage access errors
    }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.customKb, JSON.stringify(customDemoRecords));
      localStorage.setItem(STORAGE_KEYS.deletedIds, JSON.stringify(deletedDemoIds));
    } catch {
      // Ignore storage access errors
    }
  }, [customDemoRecords, deletedDemoIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.clubRegs, JSON.stringify(clubRegistrations));
    } catch {
      // Ignore storage access errors
    }
  }, [clubRegistrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.eventRegs, JSON.stringify(eventRegistrations));
    } catch {
      // Ignore storage access errors
    }
  }, [eventRegistrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.tickets, JSON.stringify(tickets));
    } catch {
      // Ignore storage access errors
    }
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
    } catch {
      // Ignore storage access errors
    }
  }, [favorites]);

  // Global keyboard shortcut Cmd/Ctrl+K for search (active inside dashboard)
  useEffect(() => {
    if (!hasEnteredDashboard) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hasEnteredDashboard]);

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
    if (typeof window !== 'undefined' && window.location.hash !== `#/${page}`) {
      window.location.hash = `#/${page}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const persistAccessSession = useCallback((session: AccessSession) => {
    // Only store displayName, rollNumber, and mode in sessionStorage — NEVER passwords.
    const safeSession: AccessSession = {
      displayName: session.displayName.trim(),
      ...(session.rollNumber ? { rollNumber: session.rollNumber.trim().toUpperCase() } : {}),
      mode: session.mode,
    };
    try {
      window.sessionStorage.setItem(SESSION_KEYS.accessSession, JSON.stringify(safeSession));
    } catch {
      // Ignore storage access errors
    }
    setAccessSession(safeSession);
    setActivePage('home');
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '#/home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const signInStudent = useCallback(
    (rollNumber: string) => {
      const normalizedRoll = rollNumber.trim().toUpperCase();
      const directory = readStudentNameMap();
      const knownName = directory[normalizedRoll];
      persistAccessSession({
        displayName: knownName || `Student (${normalizedRoll})`,
        rollNumber: normalizedRoll,
        mode: 'student',
      });
    },
    [persistAccessSession]
  );

  const registerStudent = useCallback(
    (fullName: string, rollNumber: string) => {
      const cleanName = fullName.trim();
      const normalizedRoll = rollNumber.trim().toUpperCase();
      try {
        const directory = readStudentNameMap();
        directory[normalizedRoll] = cleanName;
        // Persist ONLY displayName by rollNumber — NEVER store passwords anywhere.
        window.localStorage.setItem(STORAGE_KEYS.studentDirectory, JSON.stringify(directory));
      } catch {
        // Ignore storage access errors
      }
      persistAccessSession({
        displayName: cleanName,
        rollNumber: normalizedRoll,
        mode: 'student',
      });
    },
    [persistAccessSession]
  );

  const enterAsGuest = useCallback(() => {
    persistAccessSession({
      displayName: 'Guest',
      mode: 'guest',
    });
  }, [persistAccessSession]);

  const signOut = useCallback(() => {
    try {
      window.sessionStorage.removeItem(SESSION_KEYS.accessSession);
      window.sessionStorage.removeItem(SESSION_KEYS.legacyGuestEntered);
    } catch {
      // Ignore storage access errors
    }
    setIsSearchOpen(false);
    setIsSavedModalOpen(false);
    setPendingPrompt(null);
    setActiveSession(createFreshSession());
    setAccessSession(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const openKnowledgeBaseCategory = useCallback(
    (cat: KnowledgeCategory) => {
      setKbCategoryPreset(cat);
      navigate('knowledge-base');
      trackRecentlyViewed({
        id: `kb-cat-${cat}`,
        title: `${cat} Resources`,
        category: cat,
        type: 'page',
        targetPage: 'knowledge-base',
      });
    },
    [navigate, trackRecentlyViewed]
  );

  const openAssistantWithPrompt = useCallback(
    (prompt: string) => {
      setPendingPrompt(prompt);
      navigate('assistant');
    },
    [navigate]
  );

  const clearPendingPrompt = useCallback(() => {
    setPendingPrompt(null);
  }, []);

  // Merged Campus Resources
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
      const rawTags = custom.tags?.length ? custom.tags : custom.keywords;
      const tags = Array.from(new Set(rawTags.map((t) => t.trim().toLowerCase()).filter(Boolean)));
      const reviewed = custom.lastReviewedDate || custom.lastChecked || '2026-11-24';
      byId.set(custom.id, {
        ...custom,
        subcategory:
          custom.subcategory && custom.subcategory !== custom.category ? custom.subcategory : 'Student Note',
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
        freshnessNote: 'Added to your Campus Resources.',
        isCustomDemo: true,
      });
    }

    return Array.from(byId.values());
  }, [customDemoRecords, deletedDemoIds]);

  const clearActiveSession = useCallback(() => {
    setActiveSession(createFreshSession());
    pushToast('Conversation cleared.', 'info');
  }, [pushToast]);

  const appendMessageToActive = useCallback((msg: ChatMessage, maybeTitle?: string) => {
    const now = new Date().toISOString();
    setActiveSession((prev) => ({
      ...prev,
      title: prev.title === 'Campus Assist' && maybeTitle ? maybeTitle.slice(0, 44) : prev.title,
      updatedAt: now,
      messages: [...prev.messages, msg],
    }));
  }, []);

  const setMessageFeedback = useCallback(
    (messageId: string, feedback: 'helpful' | 'not-helpful') => {
      setActiveSession((prev) => ({
        ...prev,
        messages: prev.messages.map((m) => (m.id === messageId ? { ...m, feedback } : m)),
      }));
      pushToast(
        feedback === 'helpful' ? 'Marked response as helpful.' : 'Feedback noted.',
        'success'
      );
    },
    [pushToast]
  );

  // Campus Resources CRUD
  const addDemoRecord = useCallback(
    (
      record: Pick<
        KnowledgeRecord,
        'title' | 'category' | 'description' | 'keywords' | 'sourceUrl' | 'sourceName' | 'lastChecked'
      > & {
        subcategory?: string;
      }
    ) => {
      const uniqueKeywords = Array.from(
        new Set(record.keywords.map((k) => k.trim().toLowerCase()).filter(Boolean))
      );
      const cleanSubcategory =
        record.subcategory?.trim() && record.subcategory.trim() !== record.category
          ? record.subcategory.trim()
          : 'Student Note';
      const newRec: KnowledgeRecord = {
        id: `resource-custom-${Date.now()}`,
        title: record.title,
        category: record.category,
        subcategory: cleanSubcategory,
        content: record.description,
        description: record.description,
        tags: uniqueKeywords,
        keywords: uniqueKeywords,
        sourceUrl: record.sourceUrl,
        sourceName: record.sourceName,
        sourceType: 'demo',
        verificationStatus: 'Prototype sample',
        sourceLabel: 'Prototype sample',
        lastReviewedDate: record.lastChecked,
        lastChecked: record.lastChecked,
        isPrototypeSample: true,
        freshnessStatus: 'demo-static',
        freshnessNote: 'Added to your Campus Resources.',
        isCustomDemo: true,
      };
      setCustomDemoRecords((prev) => [newRec, ...prev]);
      pushToast('Added new campus resource.', 'success');
    },
    [pushToast]
  );

  const updateDemoRecord = useCallback(
    (id: string, updates: Partial<KnowledgeRecord>) => {
      const target = knowledgeBase.find((r) => r.id === id);
      if (!target || target.sourceType === 'official') {
        pushToast('This resource cannot be modified.', 'warning');
        return;
      }
      const desc = updates.content ?? updates.description ?? target.description;
      const tags = updates.tags ?? updates.keywords ?? target.keywords;
      const reviewed = updates.lastReviewedDate ?? updates.lastChecked ?? target.lastReviewedDate;
      const updated: KnowledgeRecord = {
        ...target,
        ...updates,
        id,
        subcategory: updates.subcategory ?? target.subcategory ?? 'Student Note',
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
        freshnessNote: 'Updated in your Campus Resources.',
        isCustomDemo: true,
      };
      setCustomDemoRecords((prev) => {
        const exists = prev.some((r) => r.id === id);
        return exists ? prev.map((r) => (r.id === id ? updated : r)) : [updated, ...prev];
      });
      pushToast('Campus resource updated.', 'success');
    },
    [knowledgeBase, pushToast]
  );

  const deleteDemoRecord = useCallback(
    (id: string) => {
      const target = knowledgeBase.find((r) => r.id === id);
      if (!target || target.sourceType === 'official') {
        pushToast('This resource cannot be removed.', 'warning');
        return;
      }
      setCustomDemoRecords((prev) => prev.filter((r) => r.id !== id));
      setDeletedDemoIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      pushToast('Campus resource removed.', 'info');
    },
    [knowledgeBase, pushToast]
  );

  // Student Activity Interests
  const registerClubInterest = useCallback(
    (reg: Omit<ClubRegistration, 'registeredAt'>) => {
      const entry: ClubRegistration = { ...reg, registeredAt: new Date().toISOString() };
      setClubRegistrations((prev) => [entry, ...prev.filter((r) => r.clubId !== reg.clubId)]);
      pushToast(`Saved interest in ${reg.clubName}.`, 'success');
    },
    [pushToast]
  );

  const cancelClubInterest = useCallback(
    (clubId: string) => {
      setClubRegistrations((prev) => prev.filter((r) => r.clubId !== clubId));
      pushToast('Interest removed.', 'info');
    },
    [pushToast]
  );

  // Event bookmark compatibility
  const toggleEventRegistration = useCallback(
    (eventId: string, eventTitle: string) => {
      setEventRegistrations((prev) => {
        const exists = prev.includes(eventId);
        if (exists) {
          pushToast(`Removed bookmark for ${eventTitle}.`, 'info');
          return prev.filter((id) => id !== eventId);
        }
        pushToast(`Saved bookmark for ${eventTitle}.`, 'success');
        return [...prev, eventId];
      });
    },
    [pushToast]
  );

  // Support Requests
  const createDemoTicket = useCallback(
    (data: Pick<HelpdeskTicket, 'subject' | 'category' | 'description' | 'studentName' | 'priority'>) => {
      const now = new Date().toISOString();
      const num = 104 + tickets.length;
      const newTicket: HelpdeskTicket = {
        id: `REQ-${num}`,
        ...data,
        status: 'Submitted',
        createdAt: now,
        updatedAt: now,
      };
      setTickets((prev) => [newTicket, ...prev]);
      pushToast(`Created support request ${newTicket.id}.`, 'success');
      return newTicket;
    },
    [tickets.length, pushToast]
  );

  const updateDemoTicketStatus = useCallback(
    (id: string, status: HelpdeskTicket['status']) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t))
      );
      pushToast(`Updated ${id} status to ${status}.`, 'info');
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

  const isFavorite = useCallback((id: string) => favorites.some((f) => f.id === id), [favorites]);

  // Reset Saved Data
  const resetSavedData = useCallback(() => {
    setActiveSession(createFreshSession());
    setRecentlyViewed([]);
    setCustomDemoRecords([]);
    setDeletedDemoIds([]);
    setClubRegistrations([]);
    setEventRegistrations([]);
    setTickets(PRELOADED_DEMO_TICKETS);
    setFavorites([]);
    clearLegacyAssistantStorage();
    pushToast('Saved items reset to default state.', 'success');
  }, [pushToast]);

  const value: CampusContextValue = {
    theme,
    toggleTheme,
    accessSession,
    hasEnteredDashboard,
    signInStudent,
    registerStudent,
    enterAsGuest,
    signOut,
    returnToWelcome: signOut,
    activePage,
    navigate,
    openAssistantWithPrompt,
    pendingPrompt,
    clearPendingPrompt,
    kbCategoryPreset,
    setKbCategoryPreset,
    openKnowledgeBaseCategory,
    recentlyViewed,
    trackRecentlyViewed,
    activeSession,
    clearActiveSession,
    appendMessageToActive,
    setMessageFeedback,
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
    systemStatus,
    reportAiMode,
    isSearchOpen,
    setIsSearchOpen,
    isSavedModalOpen,
    setIsSavedModalOpen,
    toasts,
    pushToast,
    dismissToast,
    resetSavedData,
  };

  return <CampusContext.Provider value={value}>{children}</CampusContext.Provider>;
};

export function useCampus(): CampusContextValue {
  const ctx = useContext(CampusContext);
  if (!ctx) throw new Error('useCampus must be used inside CampusProvider');
  return ctx;
}
