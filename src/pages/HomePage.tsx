import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Building2,
  Calendar,
  Clock,
  Compass,
  Database,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  MessageSquare,
  Presentation,
  Search,
  Sparkles,
  Ticket,
  UserCheck,
  UserCircle,
  Users,
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { SourceLabel } from '../components/SourceLabel';
import { useCampus } from '../context/CampusContext';
import {
  CAMPUS_EVENTS,
  CAMPUS_IMAGES,
  CLUBS_DIRECTORY,
  FACILITIES_DIRECTORY,
  OFFICIAL_QUICK_LINKS,
  SOCIAL_CHANNELS,
} from '../data/campusDirectory';
import { filterCampusEvents, formatDisplayDate } from '../lib/events';
import type { KnowledgeCategory } from '../types/campus';

const HERO_QUICK_QUESTIONS = [
  {
    q: 'Tell me about the library.',
    hint: 'Hours, borrowing and study rooms',
  },
  {
    q: 'What clubs can I join at Cedarbrook Campus?',
    hint: 'Activities and meeting times',
  },
  {
    q: 'Where can I find transport information?',
    hint: 'Routes and shuttle passes',
  },
  {
    q: 'Who is teaching my class tomorrow?',
    hint: 'Guardrail · Hallucination prevention test',
  },
];

const CATEGORY_ORDER: KnowledgeCategory[] = [
  'Academics',
  'Campus Life',
  'Library',
  'Hostels & Mess',
  'Campus Facilities',
  'Clubs & Societies',
  'Campus Events',
  'Student Services',
  'Placements',
  'Transport',
  'Admissions & General',
  'Contacts & Portals',
  'Social & Community',
];

export const HomePage: React.FC = () => {
  const {
    navigate,
    openAssistantWithPrompt,
    openKnowledgeBaseCategory,
    knowledgeBase,
    favorites,
    recentQuestions,
    recentlyViewed,
    userProfile,
    startPresentationMode,
    setIsSavedModalOpen,
  } = useCampus();

  const [heroInput, setHeroInput] = useState('');

  const officialCount = useMemo(
    () => knowledgeBase.filter((r) => r.sourceType === 'official').length,
    [knowledgeBase]
  );
  const sampleCount = useMemo(
    () => knowledgeBase.filter((r) => r.sourceType === 'demo').length,
    [knowledgeBase]
  );

  const categoryStats = useMemo(() => {
    const map = new Map<KnowledgeCategory, { total: number; verified: number }>();
    for (const cat of CATEGORY_ORDER) {
      map.set(cat, { total: 0, verified: 0 });
    }
    for (const rec of knowledgeBase) {
      const existing = map.get(rec.category) ?? { total: 0, verified: 0 };
      existing.total += 1;
      if (rec.sourceType === 'official') existing.verified += 1;
      map.set(rec.category, existing);
    }
    return Array.from(map.entries())
      .filter(([, counts]) => counts.total > 0)
      .map(([category, counts]) => ({ category, ...counts }));
  }, [knowledgeBase]);

  const personalizedRecords = useMemo(() => {
    const preferredCats = new Set(userProfile.preferredCategories);
    const interestTokens = userProfile.interests
      .flatMap((item) => item.toLowerCase().split(/[^a-z0-9]+/))
      .filter((t) => t.length >= 3);

    const scored = knowledgeBase.map((rec) => {
      let score = 0;
      if (preferredCats.has(rec.category)) score += 6;
      if (rec.sourceType === 'official') score += 2.5;
      const haystack = `${rec.title} ${rec.subcategory} ${rec.tags.join(' ')} ${rec.description}`.toLowerCase();
      for (const tok of interestTokens) {
        if (haystack.includes(tok)) score += 1.5;
      }
      return { rec, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // Ensure variety across categories in the top 6 cards
    const picked: typeof knowledgeBase = [];
    const seenCatCounts = new Map<string, number>();
    for (const item of scored) {
      const count = seenCatCounts.get(item.rec.category) ?? 0;
      if (count >= 2 && picked.length < 4) continue;
      picked.push(item.rec);
      seenCatCounts.set(item.rec.category, count + 1);
      if (picked.length === 4) break;
    }
    return picked;
  }, [knowledgeBase, userProfile.interests, userProfile.preferredCategories]);

  const allUpcomingEvents = useMemo(
    () => filterCampusEvents(CAMPUS_EVENTS, { status: 'upcoming', category: 'All', search: '' }),
    []
  );
  const upcomingEvents = useMemo(() => allUpcomingEvents.slice(0, 3), [allUpcomingEvents]);

  const featuredFacilities = FACILITIES_DIRECTORY.slice(0, 4);
  const featuredClubs = CLUBS_DIRECTORY.slice(0, 4);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = heroInput.trim();
    if (!q) {
      navigate('assistant');
      return;
    }
    setHeroInput('');
    openAssistantWithPrompt(q);
  };

  return (
    <div className="space-y-9">
      {/* Subtle Local Personalization Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              userProfile.isGuest
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                : 'bg-[#1E3A8A]/10 dark:bg-[#0F766E]/25 text-[#1E3A8A] dark:text-teal-300'
            }`}
          >
            {userProfile.isGuest ? (
              <UserCircle className="w-5 h-5" aria-hidden="true" />
            ) : (
              <UserCheck className="w-5 h-5" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            {userProfile.isGuest ? (
              <>
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  Browsing as Guest Student
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Create a student profile to tailor recommendations by programme, year, and campus interests.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  Welcome back, {userProfile.name}
                  <span className="font-normal text-slate-500 dark:text-slate-400">
                    {' '}
                    · {userProfile.programme} ({userProfile.year})
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Tailored for {userProfile.preferredCategories.slice(0, 3).join(', ')}
                </p>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('auth')}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1E3A8A] hover:bg-blue-900 dark:bg-[#0F766E] dark:hover:bg-teal-600 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>{userProfile.isGuest ? 'Sign In / Personalize' : 'Edit Profile'}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Hero Section — Balanced 2-Column Split */}
      <section className="rounded-2xl overflow-hidden bg-[#0B192C] text-white border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-teal-300 font-medium">
                <span>Cedarbrook Campus</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">First-Year B.Tech Prototype (Independent Project)</span>
              </div>

              <div className="space-y-2.5">
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] tracking-tight text-white">
                  AI Campus Helpdesk
                </h1>
                <p className="font-display font-semibold text-lg sm:text-xl text-blue-200">
                  Your campus. Your questions. One smart assistant.
                </p>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Check library hours, plan your hostel budget or find a club to join.
                </p>
              </div>

              {/* Primary AI Prompt Bar */}
              <form onSubmit={handleHeroSubmit} className="pt-2 max-w-xl">
                <label htmlFor="hero-ai-search" className="sr-only">
                  Ask AI Campus Helpdesk a question
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search
                      className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="hero-ai-search"
                      type="text"
                      value={heroInput}
                      onChange={(e) => setHeroInput(e.target.value)}
                      placeholder="Ask about library, hostels, clubs, buses, placements..."
                      className="w-full pl-10 pr-4 py-3 text-sm bg-white/10 text-white placeholder:text-slate-400 border border-white/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" aria-hidden="true" />
                    <span>Ask Assistant</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={startPresentationMode}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-teal-200 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/25 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <Presentation className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Start Presentation Mode</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('about')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Inspect RAG Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <SafeImage
              src={CAMPUS_IMAGES.hero}
              alt="Architectural view of Cedarbrook Campus Mathura campus greenery and modern academic buildings"
              fallbackTitle="Cedarbrook Campus Mathura — 110-Acre Campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/85 via-[#0B192C]/20 to-transparent flex items-end p-5">
              <div className="text-xs text-slate-200 leading-snug">
                <span className="font-semibold text-white block">110-Acre Mathura Campus · NAAC A+</span>
                <span>Cedarbrook Campus</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dense Quantitative Stats Cards */}
      <section aria-label="Knowledge Base Overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => navigate('knowledge-base')}
          className="text-left bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 rounded-xl p-4 sm:p-5 transition-colors cursor-pointer"
        >
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Knowledge Records</span>
          <p className="mt-1 font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tabular-nums">
            {knowledgeBase.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Campus handbook
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate('knowledge-base')}
          className="text-left bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 rounded-xl p-4 sm:p-5 transition-colors cursor-pointer"
        >
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Categories</span>
          <p className="mt-1 font-display font-bold text-2xl sm:text-3xl text-teal-700 dark:text-teal-300 tabular-nums">
            {categoryStats.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Structured across campus life &amp; study
          </p>
        </button>

        <button
          type="button"
          onClick={() => setIsSavedModalOpen(true)}
          className="text-left bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 rounded-xl p-4 sm:p-5 transition-colors cursor-pointer"
        >
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Saved Resources</span>
          <p className="mt-1 font-display font-bold text-2xl sm:text-3xl text-[#1E3A8A] dark:text-blue-300 tabular-nums">
            {favorites.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Pinned locally in your browser
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate('events')}
          className="text-left bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 rounded-xl p-4 sm:p-5 transition-colors cursor-pointer"
        >
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Upcoming Activities</span>
          <p className="mt-1 font-display font-bold text-2xl sm:text-3xl text-amber-700 dark:text-amber-300 tabular-nums">
            {allUpcomingEvents.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {CLUBS_DIRECTORY.length} clubs
          </p>
        </button>
      </section>

      {/* Quick Actions Strip */}
      <section aria-label="Quick Actions" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          {
            label: 'Ask AI Assistant',
            sub: 'Grounded RAG chat',
            icon: MessageSquare,
            onClick: () => navigate('assistant'),
          },
          {
            label: 'Knowledge Base',
            sub: `${knowledgeBase.length} records`,
            icon: Database,
            onClick: () => navigate('knowledge-base'),
          },
          {
            label: 'Submit Local Ticket',
            sub: 'Track your request',
            icon: Ticket,
            onClick: () => navigate('services'),
          },
          {
            label: 'Upcoming Events',
            sub: 'Calendar & local RSVP',
            icon: Calendar,
            onClick: () => navigate('events'),
          },
          {
            label: 'Presentation Mode',
            sub: 'Guided project demo',
            icon: Presentation,
            onClick: startPresentationMode,
          },
        ].map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              type="button"
              onClick={act.onClick}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 hover:border-[#1E3A8A] dark:hover:border-teal-400 text-left transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-[#1E3A8A] dark:text-teal-300">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {act.label}
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {act.sub}
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* Personalized For You Section */}
      <section aria-labelledby="personalized-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 id="personalized-heading" className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Personalized for you
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {userProfile.isGuest
                ? 'Recommended campus records based on default first-year preferences — customize anytime.'
                : `Curated for ${userProfile.name} (${userProfile.programme}, ${userProfile.year}) across ${userProfile.preferredCategories.slice(0, 3).join(', ')}.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('auth')}
            className="text-sm font-semibold text-[#1E3A8A] dark:text-teal-300 hover:underline whitespace-nowrap cursor-pointer self-start sm:self-auto"
          >
            Edit preferences
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalizedRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {rec.category}
                  </span>
                  <SourceLabel type={rec.sourceType} compact />
                </div>
                <h3 className="font-display font-semibold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {rec.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => openKnowledgeBaseCategory(rec.category)}
                  className="font-semibold text-[#1E3A8A] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  View in KB
                </button>
                <button
                  type="button"
                  onClick={() => openAssistantWithPrompt(`Tell me about ${rec.title}`)}
                  className="font-medium text-slate-600 dark:text-slate-300 hover:text-[#0F766E] dark:hover:text-teal-300 cursor-pointer"
                >
                  Ask AI
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore by Category Interactive Grid */}
      <section aria-labelledby="explore-categories-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 id="explore-categories-heading" className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#0F766E] dark:text-teal-300" aria-hidden="true" />
              <span>Explore by category</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Select any topic to jump straight into filtered Knowledge Base records.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('knowledge-base')}
            className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
          >
            All {knowledgeBase.length} records
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {categoryStats.map((item) => (
            <button
              key={item.category}
              type="button"
              onClick={() => openKnowledgeBaseCategory(item.category)}
              className="group text-left p-3.5 rounded-xl bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 hover:border-[#1E3A8A] dark:hover:border-teal-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-[#1E3A8A] dark:group-hover:text-teal-300 truncate">
                  {item.category}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                  {item.total}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                {item.verified > 0 ? `${item.verified} verified` : 'Campus guides'}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Questions */}
      <section aria-labelledby="quick-questions-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 id="quick-questions-heading" className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Popular questions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Click any prompt to launch a grounded RAG conversation with source citations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('assistant')}
            className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
          >
            Open Full Assistant
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HERO_QUICK_QUESTIONS.map((item) => (
            <button
              key={item.q}
              type="button"
              onClick={() => openAssistantWithPrompt(item.q)}
              className="group text-left p-4 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl transition-all flex flex-col justify-between gap-3 cursor-pointer"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                  {item.hint}
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  &ldquo;{item.q}&rdquo;
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-teal-300">
                <span>Ask now</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Campus Facilities + Popular Student Services */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Facilities */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Featured Campus Facilities
            </h2>
            <button
              type="button"
              onClick={() => navigate('facilities')}
              className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
            >
              View all {FACILITIES_DIRECTORY.length}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredFacilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{fac.category}</span>
                    <SourceLabel type="official" compact />
                  </div>
                  <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                    {fac.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {fac.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => navigate('facilities')}
                    className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Explore details
                  </button>
                  <button
                    type="button"
                    onClick={() => openAssistantWithPrompt(fac.suggestedQuestion)}
                    className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-teal-300 cursor-pointer"
                  >
                    Ask AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Student Services & Portals */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Popular Student Services
            </h2>
            <button
              type="button"
              onClick={() => navigate('services')}
              className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
            >
              Open Services
            </button>
          </div>

          <div className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
            {[
              {
                title: 'Campus Desk Student Portal',
                desc: 'Tuition calculator, timetable and exams.',
                action: () => navigate('academics'),
                icon: GraduationCap,
                type: 'official' as const,
              },
              {
                title: 'Anti-Ragging & Campus Safety',
                desc: 'Contact Student Services through your ticket tracker.',
                action: () => navigate('services'),
                icon: HeartHandshake,
                type: 'official' as const,
              },
              {
                title: 'Ticket Tracker',
                desc: 'Submit a browser-local support ticket and track status.',
                action: () => navigate('services'),
                icon: Sparkles,
                type: 'demo' as const,
              },
              {
                title: `Searchable ${knowledgeBase.length}-Record Knowledge Base`,
                desc: 'Browse the campus handbook and add your own records.',
                action: () => navigate('knowledge-base'),
                icon: Building2,
                type: 'official' as const,
              },
            ].map((srv) => {
              const Icon = srv.icon;
              return (
                <button
                  key={srv.title}
                  type="button"
                  onClick={srv.action}
                  className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3.5 first:rounded-t-xl last:rounded-b-xl cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4.5 h-4.5 text-blue-700 dark:text-teal-300" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {srv.title}
                      </span>
                      <SourceLabel type={srv.type} compact />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Prototype Events & Club Highlights */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Upcoming Campus Events
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Date-calculated schedule · Expired events move automatically to Past
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('events')}
              className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
            >
              Open Calendar
            </button>
          </div>

          <div className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
            {upcomingEvents.map((evt) => (
              <div key={evt.id} className="p-4 flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {formatDisplayDate(evt.date)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{evt.category}</span>
                    <span aria-hidden="true">·</span>
                    <SourceLabel type={evt.sourceType} compact />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{evt.organizer}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('events')}
                  className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Club Highlights */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Club &amp; Society Highlights
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Browse societies and save your interests
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('clubs')}
              className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
            >
              Explore {CLUBS_DIRECTORY.length} Clubs
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredClubs.map((club) => (
              <div
                key={club.id}
                className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{club.category}</span>
                    <SourceLabel type={club.sourceType} compact />
                  </div>
                  <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                    {club.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {club.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('clubs')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-teal-300 hover:underline self-start cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Explore club</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social & Campus Community Section */}
      

      {/* Recently Viewed, Saved Resources, Recent Questions & Official University Links */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F766E] dark:text-teal-300" aria-hidden="true" />
              <span>Recently viewed &amp; Saved</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsSavedModalOpen(true)}
              className="text-xs font-semibold text-[#1E3A8A] dark:text-teal-300 hover:underline cursor-pointer"
            >
              Saved ({favorites.length})
            </button>
          </div>

          <div className="space-y-3.5">
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Recently viewed</span>
              {recentlyViewed.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Inspect any Knowledge Base record, facility, club, or event to see your recent history here.
                </p>
              ) : (
                <div className="mt-1.5 space-y-1.5">
                  {recentlyViewed.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(item.targetPage)}
                      className="w-full text-left px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="truncate">{item.title}</span>
                      <span className="text-[11px] text-slate-400 shrink-0">{item.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#1E3A8A] dark:text-teal-300" aria-hidden="true" />
                <span>Saved Resources</span>
              </span>
              {favorites.length === 0 ? (
                <p className="text-xs text-slate-500 mt-1">Bookmark facilities or records to pin them here.</p>
              ) : (
                <div className="mt-1.5 space-y-1.5">
                  {favorites.slice(0, 3).map((fav) => (
                    <button
                      key={fav.id}
                      type="button"
                      onClick={() => navigate(fav.targetPage)}
                      className="w-full text-left px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-slate-800 dark:text-slate-200 flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{fav.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Recent AI Questions</span>
              <div className="mt-1.5 space-y-1.5">
                {recentQuestions.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => openAssistantWithPrompt(q)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg truncate cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        </section>
    </div>
  );
};
