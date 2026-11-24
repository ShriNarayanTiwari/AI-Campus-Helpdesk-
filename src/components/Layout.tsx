import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Building2,
  Calendar,
  ChevronDown,
  Compass,
  Database,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Home,
  Info,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Presentation,
  RotateCcw,
  Search,
  Sun,
  Trash2,
  User,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { CLUBS_DIRECTORY, CAMPUS_EVENTS, FACILITIES_DIRECTORY } from '../data/campusDirectory';
import type { PageId } from '../types/campus';
import { DemoTourOverlay } from './DemoTourOverlay';
import { SourceLabel } from './SourceLabel';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
  { id: 'facilities', label: 'Campus Facilities', icon: Building2 },
  { id: 'clubs', label: 'Clubs & Societies', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'academics', label: 'Academics', icon: GraduationCap },
  { id: 'services', label: 'Student Services', icon: HeartHandshake },
  { id: 'knowledge-base', label: 'Knowledge Base', icon: Database },
  { id: 'about', label: 'About This Project', icon: Info },
];

const PAGE_TITLES: Record<PageId, string> = {
  home: 'Dashboard Home',
  assistant: 'AI Campus Assistant',
  facilities: 'Campus Facilities',
  clubs: 'Clubs & Societies',
  events: 'Campus Events',
  academics: 'Academics & Campus Desk',
  services: 'Student Services',
  'knowledge-base': 'Knowledge Base',
  about: 'About This Project & RAG',
  auth: 'Student Profile & Sign In',
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    theme,
    toggleTheme,
    activePage,
    navigate,
    openAssistantWithPrompt,
    isSearchOpen,
    setIsSearchOpen,
    isSavedModalOpen,
    setIsSavedModalOpen,
    knowledgeBase,
    favorites,
    toggleFavorite,
    userProfile,
    logoutToGuest,
    toasts,
    dismissToast,
    isPresentationMode,
    startPresentationMode,
    resetAllPrototypeData,
    systemStatus,
  } = useCampus();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const isGeminiReady =
    systemStatus.online &&
    systemStatus.geminiConfigured === true &&
    systemStatus.lastAiMode !== 'kb-fallback';

  // Global Escape handler to prevent keyboard traps across drawers and modals
  useEffect(() => {
    if (!mobileMenuOpen && !isSavedModalOpen && !confirmReset && !isSearchOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (confirmReset) {
        setConfirmReset(false);
      } else if (isSavedModalOpen) {
        setIsSavedModalOpen(false);
      } else if (isSearchOpen) {
        setIsSearchOpen(false);
      } else if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [mobileMenuOpen, isSavedModalOpen, confirmReset, isSearchOpen, setIsSavedModalOpen, setIsSearchOpen]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [profileMenuOpen]);

  const userInitials = useMemo(() => {
    if (userProfile.isGuest) return 'GS';
    const parts = userProfile.name.trim().split(/\s+/);
    return parts.map((p) => p[0] ?? '').join('').slice(0, 2).toUpperCase() || 'ST';
  }, [userProfile]);

  const searchResults = useMemo(() => {
    const q = globalQuery.trim().toLowerCase();
    if (!q) return { kb: [], facilities: [], clubs: [], events: [] };

    return {
      kb: knowledgeBase
        .filter((r) =>
          `${r.title} ${r.category} ${r.description} ${r.keywords.join(' ')}`.toLowerCase().includes(q)
        )
        .slice(0, 5),
      facilities: FACILITIES_DIRECTORY.filter((f) =>
        `${f.name} ${f.category} ${f.summary}`.toLowerCase().includes(q)
      ).slice(0, 3),
      clubs: CLUBS_DIRECTORY.filter((c) =>
        `${c.name} ${c.category} ${c.description}`.toLowerCase().includes(q)
      ).slice(0, 3),
      events: CAMPUS_EVENTS.filter((e) =>
        `${e.title} ${e.organizer} ${e.category}`.toLowerCase().includes(q)
      ).slice(0, 3),
    };
  }, [globalQuery, knowledgeBase]);

  const totalSearchHits =
    searchResults.kb.length +
    searchResults.facilities.length +
    searchResults.clubs.length +
    searchResults.events.length;

  const handleNavClick = (page: PageId) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#071120] text-slate-900 dark:text-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#1E3A8A] focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>
      {/* Desktop Sidebar */}
      <aside
        aria-label="Primary Sidebar Navigation"
        className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#0B192C] text-slate-200 border-r border-slate-800/80 z-30"
      >
        <div className="h-16 px-5 flex items-center gap-3 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shrink-0">
            <Compass className="w-4.5 h-4.5 text-white" aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="text-left min-w-0 cursor-pointer"
          >
            <span className="block font-display font-bold text-base tracking-tight text-white whitespace-nowrap">
              AI Campus Helpdesk
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Main sections">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('auth')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
              activePage === 'auth'
                ? 'bg-white/15 text-white'
                : 'bg-white/5 hover:bg-white/10 text-slate-200'
            }`}
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#1E3A8A] to-[#0F766E] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-white truncate">
                {userProfile.isGuest ? 'Guest Mode' : userProfile.name}
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                {userProfile.isGuest ? 'Sign in / Create local profile' : `${userProfile.programme} · ${userProfile.year}`}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={startPresentationMode}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-400/25 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Presentation className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Professor Viva Demo</span>
          </button>

          {/* Compact System Status Indicator */}
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px]"
            title={
              isGeminiReady
                ? `Server-side Gemini API ready (${systemStatus.model})`
                : systemStatus.lastFallbackReason || 'Using local grounded Knowledge-Base fallback'
            }
          >
            <span className="inline-flex items-center gap-1.5 min-w-0 text-slate-200">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  systemStatus.geminiConfigured === null
                    ? 'bg-slate-400'
                    : isGeminiReady
                    ? 'bg-teal-400'
                    : 'bg-amber-400'
                }`}
                aria-hidden="true"
              />
              <span className="truncate font-medium">
                {systemStatus.geminiConfigured === null
                  ? 'Checking status...'
                  : !systemStatus.online
                  ? 'Offline · Local KB'
                  : isGeminiReady
                  ? 'Gemini AI Ready'
                  : 'Campus handbook ready'}
              </span>
            </span>
            <span className="text-[10px] text-slate-400 shrink-0">Status</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">Cedarbrook Campus</span>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              aria-label="Reset local prototype data"
              title="Reset local prototype data"
              className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            aria-label="Mobile Navigation Drawer"
            className="relative w-72 max-w-[85vw] bg-[#0B192C] text-slate-200 flex flex-col h-full shadow-2xl z-10"
          >
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <span className="font-display font-bold text-base text-white whitespace-nowrap">
                  AI Campus Helpdesk
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={() => handleNavClick('auth')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/15 cursor-pointer"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <span>{userProfile.isGuest ? 'Sign In / Create Profile' : `Profile: ${userProfile.name}`}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  startPresentationMode();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/25 cursor-pointer"
              >
                <Presentation className="w-4 h-4" aria-hidden="true" />
                <span>Start Professor Viva Demo</span>
              </button>
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-200">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${isGeminiReady ? 'bg-teal-400' : 'bg-amber-400'}`}
                    aria-hidden="true"
                  />
                  <span>
                    System Status:{' '}
                    {!systemStatus.online
                      ? 'Offline · Local KB'
                      : isGeminiReady
                      ? 'Gemini AI Ready'
                      : 'Campus handbook ready'}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setConfirmReset(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset saved data</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Clean Top Header Bar (Single Row, <=15% Mobile Height) */}
        <header className="sticky top-0 z-20 h-14 sm:h-16 bg-white/95 dark:bg-[#0B172A]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 -ml-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="hidden sm:inline text-slate-400 dark:text-slate-500 whitespace-nowrap">
                AI Campus Helpdesk
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700" aria-hidden="true">
                /
              </span>
              <span className="font-display font-semibold text-slate-900 dark:text-white truncate">
                {PAGE_TITLES[activePage]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open global campus search"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              <span className="hidden md:inline">Search campus...</span>
              <kbd className="hidden xl:inline font-mono text-[11px] text-slate-400 dark:text-slate-500 pl-2">
                Ctrl K
              </kbd>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('assistant')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((v) => !v)}
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                aria-label="Open student profile menu"
                className="inline-flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1C32] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="w-6 h-6 rounded-md bg-gradient-to-br from-[#1E3A8A] to-[#0F766E] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {userInitials}
                </span>
                <span className="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-100 max-w-[110px] truncate">
                  {userProfile.isGuest ? 'Guest' : userProfile.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </button>

              {profileMenuOpen && (
                <div
                  role="menu"
                  aria-label="Student profile actions"
                  className="absolute right-0 mt-2 w-60 rounded-xl bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 shadow-xl py-1.5 z-40"
                >
                  <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {userProfile.isGuest ? 'Guest Student' : userProfile.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {userProfile.isGuest
                        ? 'Local guest mode · Browser only'
                        : `${userProfile.programme} · ${userProfile.year}`}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate('auth');
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 cursor-pointer text-left"
                    >
                      {userProfile.isGuest ? (
                        <>
                          <LogIn className="w-3.5 h-3.5 text-[#1E3A8A] dark:text-teal-300" aria-hidden="true" />
                          <span>Sign In / Create Account</span>
                        </>
                      ) : (
                        <>
                          <UserCog className="w-3.5 h-3.5 text-[#1E3A8A] dark:text-teal-300" aria-hidden="true" />
                          <span>Edit Profile</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setIsSavedModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 cursor-pointer text-left"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <Bookmark className="w-3.5 h-3.5 text-[#0F766E] dark:text-teal-300" aria-hidden="true" />
                        <span>Saved Resources</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        {favorites.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        toggleTheme();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 cursor-pointer text-left"
                    >
                      <span className="inline-flex items-center gap-2.5">
                        {theme === 'dark' ? (
                          <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                        ) : (
                          <Moon className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
                        )}
                        <span>Theme Setting</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {theme === 'dark' ? 'Dark' : 'Light'}
                      </span>
                    </button>
                  </div>

                  {!userProfile.isGuest && (
                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          logoutToGuest();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Viewport */}
        <main
          id="main-content"
          tabIndex={-1}
          className={`flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none ${isPresentationMode ? 'pb-48' : ''}`}
        >
          {children}
        </main>

        {/* Quiet Academic Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A1527] px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <p>
              DEMO DATA — NOT OFFICIAL. Cedarbrook Campus is fictional.
            </p>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              
              
              <button
                type="button"
                onClick={() => navigate('about')}
                className="hover:text-blue-700 dark:hover:text-teal-300 underline-offset-4 hover:underline whitespace-nowrap cursor-pointer"
              >
                RAG Architecture
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Search Modal */}
      {isSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Global Campus Search"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
              <input
                type="search"
                autoFocus
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsSearchOpen(false);
                  if (e.key === 'Enter' && globalQuery.trim()) {
                    const q = globalQuery.trim();
                    setIsSearchOpen(false);
                    setGlobalQuery('');
                    openAssistantWithPrompt(q);
                  }
                }}
                placeholder="Search libraries, hostels, clubs, events, or press Enter to ask AI..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close global search"
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {!globalQuery.trim() ? (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Popular campus searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Central Library', 'Circuit Circle', 'Transport Bus', 'Hostel Rooms', 'Campus Desk', 'Placements'].map(
                      (term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setGlobalQuery(term)}
                          className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const q = globalQuery.trim();
                      setIsSearchOpen(false);
                      setGlobalQuery('');
                      openAssistantWithPrompt(q);
                    }}
                    className="w-full flex items-center justify-between gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/70 text-left hover:bg-blue-100/70 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MessageSquare className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-200 truncate">
                        Ask AI Campus Helpdesk: &ldquo;{globalQuery.trim()}&rdquo;
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                      Ask AI
                    </span>
                  </button>

                  {totalSearchHits === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
                      No direct directory matches found. Press Enter to ask the AI Campus Assistant.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.kb.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            Knowledge Base ({searchResults.kb.length})
                          </h3>
                          <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {searchResults.kb.map((rec) => (
                              <button
                                key={rec.id}
                                type="button"
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  navigate('knowledge-base');
                                }}
                                className="w-full py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-md transition-colors cursor-pointer"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {rec.title}
                                  </span>
                                  <SourceLabel type={rec.sourceType} compact />
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                  {rec.category} · {rec.description}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.clubs.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            Clubs & Societies
                          </h3>
                          <div className="space-y-1">
                            {searchResults.clubs.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  navigate('clubs');
                                }}
                                className="w-full py-2 px-2 text-left rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between gap-2 cursor-pointer"
                              >
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                  {c.name}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {c.category}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.facilities.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            Campus Facilities
                          </h3>
                          <div className="space-y-1">
                            {searchResults.facilities.map((f) => (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  navigate('facilities');
                                }}
                                className="w-full py-2 px-2 text-left rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between gap-2 cursor-pointer"
                              >
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                  {f.name}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {f.category}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Saved Resources Modal */}
      {isSavedModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Saved Campus Resources"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setIsSavedModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-[#0F766E] dark:text-teal-300" aria-hidden="true" />
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white tabular-nums">
                    Saved Resources ({favorites.length})
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Browser-local prototype bookmarks only — not synced to Cedarbrook Campus.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSavedModalOpen(false)}
                aria-label="Close saved resources"
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1">
              {favorites.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    No saved resources yet.
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bookmark facilities, portals, or knowledge records to keep quick links here in your browser.
                  </p>
                </div>
              ) : (
                favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#091426]"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsSavedModalOpen(false);
                        navigate(fav.targetPage);
                      }}
                      className="text-left min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="block text-sm font-semibold text-slate-900 dark:text-white truncate hover:text-blue-700 dark:hover:text-teal-300">
                        {fav.title}
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                        {fav.type}
                      </span>
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {fav.url && (
                        <a
                          href={fav.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open external link for ${fav.title}`}
                          className="p-1.5 text-slate-500 hover:text-blue-700 dark:hover:text-teal-300 rounded-md"
                        >
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleFavorite(fav)}
                        aria-label={`Remove ${fav.title} from saved resources`}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Reset Confirmation Modal */}
      {confirmReset && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Reset saved data Confirmation"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setConfirmReset(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Reset saved data?
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This clears your local browser profile, chat history, prototype club interests, local tickets, and custom sample records back to defaults. Handbook entries are restored.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllPrototypeData();
                  setConfirmReset(false);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 sm:max-w-sm sm:w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${
              t.variant === 'success'
                ? 'bg-teal-950 text-teal-50 border-teal-700'
                : t.variant === 'warning'
                ? 'bg-amber-950 text-amber-50 border-amber-700'
                : 'bg-[#0B192C] text-slate-100 border-slate-700'
            }`}
          >
            <span>{t.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Guided Presentation Demo Overlay */}
      <DemoTourOverlay />
    </div>
  );
};
