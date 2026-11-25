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
  Search,
  Ticket,
  Users,
} from 'lucide-react';
import { HomeHeroIllustration } from '../components/HeroIllustrations';
import { useCampus } from '../context/CampusContext';
import {
  CLUBS_DIRECTORY,
  FACILITIES_DIRECTORY,
  OFFICIAL_QUICK_LINKS,
  STUDENT_ACTIVITIES_NOTICE,
} from '../data/campusDirectory';
import type { KnowledgeCategory } from '../types/campus';

const HERO_QUICK_QUESTIONS = [
  {
    q: 'What is the fees structure of all branches?',
    hint: 'Fee structure overview',
  },
  {
    q: 'Tell me about hostel facilities and rules',
    hint: 'Hostel guidance',
  },
  {
    q: 'Tell me about library services and hours',
    hint: 'Library services',
  },
  {
    q: 'Tell me about campus clubs and upcoming events',
    hint: 'Activities & notices',
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
    recentlyViewed,
    setIsSavedModalOpen,
  } = useCampus();

  const [heroInput, setHeroInput] = useState('');

  const categoryStats = useMemo(() => {
    const map = new Map<KnowledgeCategory, number>();
    for (const cat of CATEGORY_ORDER) {
      map.set(cat, 0);
    }
    for (const rec of knowledgeBase) {
      map.set(rec.category, (map.get(rec.category) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .filter(([, total]) => total > 0)
      .map(([category, total]) => ({ category, total }));
  }, [knowledgeBase]);

  const featuredFacilities = FACILITIES_DIRECTORY.slice(0, 4);
  const featuredInterestAreas = CLUBS_DIRECTORY.slice(0, 4);

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
      {/* Hero Section — Balanced 2-Column Split */}
      <section className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B192C] via-[#0F2442] to-[#0B192C] text-white border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-teal-300 font-medium">
                <span>Student Information Hub · Designed for GLA University students</span>
              </div>

              <div className="space-y-2.5">
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[2.65rem] leading-[1.1] tracking-tight text-white">
                  Campus Assist
                </h1>
                <p className="font-display font-semibold text-lg sm:text-xl text-blue-200">
                  Student Information Hub
                </p>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Explore campus facilities, library hours, indicative fee estimates, student interest areas, and support services in one place.
                </p>
              </div>

              {/* Primary Search & Question Bar */}
              <form onSubmit={handleHeroSubmit} className="pt-2 w-full max-w-2xl">
                <label htmlFor="hero-ai-search" className="sr-only">
                  Ask Campus Assist a question
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 min-w-0">
                    <Search
                      className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="hero-ai-search"
                      type="text"
                      value={heroInput}
                      onChange={(e) => setHeroInput(e.target.value)}
                      placeholder="Ask about library, fees, or hostels..."
                      className="w-full pl-10 pr-3 py-3 text-sm bg-white/10 text-white placeholder:text-slate-300/85 border border-white/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" aria-hidden="true" />
                    <span>Ask Campus Assist</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate('knowledge-base')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-teal-200 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/25 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Browse Campus Resources</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('facilities')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Explore Facilities</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-[300px] overflow-hidden">
            <HomeHeroIllustration />
          </div>
        </div>
      </section>

      {/* Overview Stats Cards */}
      <section aria-label="Campus Resources Overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => navigate('knowledge-base')}
          className="text-left bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 rounded-xl p-4 sm:p-5 transition-colors cursor-pointer"
        >
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Campus Resources</span>
          <p className="mt-1 font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tabular-nums">
            {knowledgeBase.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Student guides &amp; directories
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate('knowledge-base')}
          className="text-left bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 rounded-xl p-4 sm:p-5 transition-colors cursor-pointer"
        >
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Topic Categories</span>
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
            Bookmarked for quick access
          </p>
        </button>

        <button
          type="button"
          onClick={() => navigate('clubs')}
          className="text-left bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 rounded-xl p-4 sm:p-5 transition-colors cursor-pointer"
        >
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Interest Areas</span>
          <p className="mt-1 font-display font-bold text-2xl sm:text-3xl text-amber-700 dark:text-amber-300 tabular-nums">
            {CLUBS_DIRECTORY.length}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Student activities &amp; official notices
          </p>
        </button>
      </section>

      {/* Quick Actions Strip */}
      <section aria-label="Quick Actions" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Ask Campus Assist',
            sub: 'Get quick campus answers',
            icon: MessageSquare,
            onClick: () => navigate('assistant'),
          },
          {
            label: 'Campus Resources',
            sub: `${knowledgeBase.length} searchable guides`,
            icon: Database,
            onClick: () => navigate('knowledge-base'),
          },
          {
            label: 'Request Support',
            sub: 'Submit and track requests',
            icon: Ticket,
            onClick: () => navigate('services'),
          },
          {
            label: 'Activities & Notices',
            sub: 'Official channels & interest areas',
            icon: Calendar,
            onClick: () => navigate('events'),
          },
        ].map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              type="button"
              onClick={act.onClick}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 hover:border-[#1E3A8A] dark:hover:border-teal-400 text-left transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-[#1E3A8A] dark:text-teal-300 mt-0.5">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-slate-900 dark:text-white leading-snug">
                  {act.label}
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                  {act.sub}
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* Explore by Category Interactive Grid */}
      <section aria-labelledby="explore-categories-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2
              id="explore-categories-heading"
              className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2"
            >
              <Compass className="w-5 h-5 text-[#0F766E] dark:text-teal-300" aria-hidden="true" />
              <span>Explore by category</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Select a topic to browse Campus Resources.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('knowledge-base')}
            className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
          >
            All {knowledgeBase.length} resources
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
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Campus guides
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
              Select a topic below to open Campus Assist directly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('assistant')}
            className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
          >
            Open Campus Assist
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
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    {fac.category}
                  </span>
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
                    Ask Campus Assist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                title: 'Academics & Fee Estimator',
                desc: 'Estimate annual tuition, view the reference timetable, and check exam dates.',
                action: () => navigate('academics'),
                icon: GraduationCap,
              },
              {
                title: 'Student Welfare & Campus Safety',
                desc: 'Access guidance and reach Student Services for support.',
                action: () => navigate('services'),
                icon: HeartHandshake,
              },
              {
                title: 'Request Support',
                desc: 'Submit a campus support request and follow its status.',
                action: () => navigate('services'),
                icon: Ticket,
              },
              {
                title: `Campus Resources (${knowledgeBase.length} Guides)`,
                desc: 'Browse campus directories, guidance records, and student resources.',
                action: () => navigate('knowledge-base'),
                icon: Building2,
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
                    <span className="font-semibold text-sm text-slate-900 dark:text-white truncate block">
                      {srv.title}
                    </span>
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

      {/* Student Activities & Official Notices */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Student Activities &amp; Notices
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official announcements and communication channels
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('events')}
              className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
            >
              Open Notices
            </button>
          </div>

          <div className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {STUDENT_ACTIVITIES_NOTICE}
            </p>
            <div className="space-y-2 text-xs">
              {OFFICIAL_QUICK_LINKS.slice(0, 3).map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <span className="font-medium truncate">{link.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Student Interest Areas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                General activity categories — not official club listings
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('clubs')}
              className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
            >
              Explore {CLUBS_DIRECTORY.length} Areas
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredInterestAreas.map((area) => (
              <div
                key={area.id}
                className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    {area.category}
                  </span>
                  <h3 className="font-display font-semibold text-base text-slate-900 dark:text-white">
                    {area.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {area.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('clubs')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-teal-300 hover:underline self-start cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Explore area</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Grid: Recently Viewed & Saved + Helpful Resources */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F766E] dark:text-teal-300" aria-hidden="true" />
              <span>Recently Viewed &amp; Saved Resources</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsSavedModalOpen(true)}
              className="text-xs font-semibold text-[#1E3A8A] dark:text-teal-300 hover:underline cursor-pointer"
            >
              Saved ({favorites.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Recently viewed</span>
              {recentlyViewed.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Open any campus resource, facility, or activity area to keep recent items here.
                </p>
              ) : (
                <div className="mt-2 space-y-1.5">
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

            <div className="sm:border-l sm:border-slate-100 sm:dark:border-slate-800 sm:pl-4">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#1E3A8A] dark:text-teal-300" aria-hidden="true" />
                <span>Saved Resources</span>
              </span>
              {favorites.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  No saved resources yet. Bookmark any facility or guide to pin it here.
                </p>
              ) : (
                <div className="mt-2 space-y-1.5">
                  {favorites.slice(0, 4).map((fav) => (
                    <button
                      key={fav.id}
                      type="button"
                      onClick={() => navigate(fav.targetPage)}
                      className="w-full text-left px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span className="truncate">{fav.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Helpful Resources Card */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div>
              <h2 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Helpful Resources
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Quick campus categories and official GLA University links.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Campus Facilities', page: 'facilities' as const },
                { label: 'Academics & Fees', page: 'academics' as const },
                { label: 'Student Services', page: 'services' as const },
                { label: 'Activities & Notices', page: 'events' as const },
              ].map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => navigate(cat.page)}
                  className="px-3 py-2 rounded-lg text-left text-xs font-medium bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-1 text-xs">
              {OFFICIAL_QUICK_LINKS.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <span className="font-medium truncate">{link.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
