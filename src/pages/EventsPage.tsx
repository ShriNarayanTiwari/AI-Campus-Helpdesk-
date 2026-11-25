import React from 'react';
import {
  ArrowRight,
  Bell,
  ExternalLink,
  MessageSquare,
  Users,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import {
  CLUBS_DIRECTORY,
  OFFICIAL_QUICK_LINKS,
  STUDENT_ACTIVITIES_NOTICE,
} from '../data/campusDirectory';

export const EventsPage: React.FC = () => {
  const { navigate, openAssistantWithPrompt } = useCampus();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-1.5">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Student Activities &amp; Notices
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          Official university communication links and general student interest categories.
        </p>
      </div>

      {/* Primary Notice & Official Channels Card */}
      <section
        aria-labelledby="official-notices-heading"
        className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center shrink-0 text-[#1E3A8A] dark:text-teal-300">
            <Bell className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h2
              id="official-notices-heading"
              className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white"
            >
              Official University Announcements
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed max-w-3xl">
              {STUDENT_ACTIVITIES_NOTICE}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OFFICIAL_QUICK_LINKS.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 transition-colors"
            >
              <div className="min-w-0">
                <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {link.tag}
                </span>
                <span className="block text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">
                  {link.label}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-blue-700 dark:text-teal-300 shrink-0" aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Campus Assist does not display unverified event calendars or static dates.
          </p>
          <button
            type="button"
            onClick={() => openAssistantWithPrompt('Tell me about campus clubs and upcoming events')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ask Campus Assist</span>
          </button>
        </div>
      </section>

      {/* Optional Student Interest Areas Overview */}
      <section aria-labelledby="interest-areas-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2
              id="interest-areas-heading"
              className="font-display font-bold text-xl text-slate-900 dark:text-white"
            >
              Student Interest Areas
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              General student activity categories — clearly distinct from official named university clubs.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('clubs')}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-teal-300 hover:underline whitespace-nowrap cursor-pointer"
          >
            <span>Manage saved interests</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLUBS_DIRECTORY.map((area) => (
            <article
              key={area.id}
              className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-3"
            >
              <div className="space-y-1.5">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Interest Area · {area.category}
                </span>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  {area.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {area.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('clubs')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-teal-300 hover:underline self-start cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Explore interest area</span>
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
