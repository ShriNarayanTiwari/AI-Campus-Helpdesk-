import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Info,
  MessageSquare,
  Search,
  UserPlus,
  X,
} from 'lucide-react';
import { ActivitiesHeroIllustration } from '../components/HeroIllustrations';
import { useCampus } from '../context/CampusContext';
import {
  CLUBS_DIRECTORY,
  STUDENT_ACTIVITIES_NOTICE,
} from '../data/campusDirectory';
import type { ClubItem } from '../types/campus';

const ACTIVITY_CATEGORIES = [
  'All',
  'Technical',
  'Media & Creative',
  'Cultural & Arts',
  'Literary & Debate',
  'Sports & Fitness',
  'Departmental',
];

export const ClubsPage: React.FC = () => {
  const {
    accessSession,
    clubRegistrations,
    registerClubInterest,
    cancelClubInterest,
    openAssistantWithPrompt,
    trackRecentlyViewed,
  } = useCampus();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedArea, setSelectedArea] = useState<ClubItem | null>(null);
  const [registerModalArea, setRegisterModalArea] = useState<ClubItem | null>(null);

  useEffect(() => {
    if (!selectedArea && !registerModalArea) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (registerModalArea) setRegisterModalArea(null);
      else if (selectedArea) setSelectedArea(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedArea, registerModalArea]);

  const [studentName, setStudentName] = useState(
    accessSession?.mode === 'student' ? accessSession.displayName : ''
  );
  const [courseYear, setCourseYear] = useState('B.Tech 1st Year');
  const [interestNote, setInterestNote] = useState('');
  const [formError, setFormError] = useState('');

  const handleExploreArea = (area: ClubItem) => {
    setSelectedArea(area);
    trackRecentlyViewed({
      id: area.id,
      title: area.name,
      category: area.category,
      type: 'club',
      targetPage: 'clubs',
    });
  };

  const savedIds = useMemo(
    () => new Set(clubRegistrations.map((r) => r.clubId)),
    [clubRegistrations]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CLUBS_DIRECTORY.filter((c) => {
      if (category !== 'All' && c.category !== category) return false;
      if (!q) return true;
      return `${c.name} ${c.category} ${c.description} ${c.verifiedActivities.join(' ')}`
        .toLowerCase()
        .includes(q);
    });
  }, [search, category]);

  const handleOpenSaveInterest = (area: ClubItem) => {
    setRegisterModalArea(area);
    setFormError('');
    if (!studentName && accessSession?.mode === 'student') {
      setStudentName(accessSession.displayName);
    }
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerModalArea) return;
    if (studentName.trim().length < 2) {
      setFormError('Please enter your name (at least 2 characters) to save your interest.');
      return;
    }

    registerClubInterest({
      clubId: registerModalArea.id,
      clubName: registerModalArea.name,
      studentName: studentName.trim(),
      courseYear: courseYear.trim() || 'B.Tech 1st Year',
      interestNote: interestNote.trim(),
    });
    setInterestNote('');
    setFormError('');
    setRegisterModalArea(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-8 p-6 sm:p-7 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Student Interest Areas · Designed for GLA University students</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Student Activities &amp; Interest Areas
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Explore general student interest areas and bookmark topics you want to pursue. These categories are general interest areas rather than an official directory of named GLA University clubs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 tabular-nums">
            <span>
              <strong className="text-slate-900 dark:text-white">{CLUBS_DIRECTORY.length}</strong> Interest Areas
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <strong className="text-teal-700 dark:text-teal-300">{clubRegistrations.length}</strong> Saved Interests
            </span>
          </div>
        </div>
        <div className="lg:col-span-4 relative min-h-[200px] lg:min-h-full overflow-hidden">
          <ActivitiesHeroIllustration />
        </div>
      </section>

      {/* Official Channels Guidance Note */}
      <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/70 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
          <Info className="w-4 h-4 text-blue-700 dark:text-teal-300 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">{STUDENT_ACTIVITIES_NOTICE}</p>
        </div>
        <a
          href="https://www.gla.ac.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-teal-300 hover:underline whitespace-nowrap shrink-0"
        >
          <span>Official GLA Website</span>
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Search & Wrapped Category Filter */}
      <div className="space-y-3">
        <div className="relative w-full sm:max-w-md">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <label htmlFor="club-search" className="sr-only">
            Search activities or interests
          </label>
          <input
            id="club-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activities or interests…"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div
          role="group"
          aria-label="Filter activities by category"
          className="flex flex-wrap items-center gap-2"
        >
          {ACTIVITY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                category === cat
                  ? 'bg-blue-700 text-white'
                  : 'bg-white dark:bg-[#0E1C32] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Interest Strip */}
      {clubRegistrations.length > 0 && (
        <section
          aria-label="Saved Activity Interests"
          className="bg-blue-50/70 dark:bg-blue-950/25 border border-blue-200 dark:border-blue-800/70 rounded-xl p-4 space-y-2.5"
        >
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
            Your saved interest areas (stored on this device)
          </span>
          <div className="flex flex-wrap gap-2">
            {clubRegistrations.map((reg) => (
              <div
                key={reg.clubId}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E1C32] border border-blue-200 dark:border-blue-800 text-xs"
              >
                <span className="font-semibold text-slate-900 dark:text-white">{reg.clubName}</span>
                <span className="text-slate-500 dark:text-slate-400">({reg.studentName})</span>
                <button
                  type="button"
                  onClick={() => cancelClubInterest(reg.clubId)}
                  aria-label={`Remove saved interest for ${reg.clubName}`}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interest Areas Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">No interest areas matched your filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategory('All');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg cursor-pointer"
          >
            Show All Areas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((area) => {
            const isSaved = savedIds.has(area.id);
            return (
              <article
                key={area.id}
                className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    Interest Area · {area.category}
                  </span>
                  <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {area.name}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {area.description}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                    {area.demoSchedule}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleExploreArea(area)}
                    className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
                  >
                    Explore
                  </button>

                  {isSaved ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-300 whitespace-nowrap">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Interest Saved</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenSaveInterest(area)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Save Interest</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Interest Area Details Modal */}
      {selectedArea && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedArea.name} details`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setSelectedArea(null)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Interest Area · {selectedArea.category}
                </span>
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-0.5">
                  {selectedArea.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArea(null)}
                aria-label="Close interest area modal"
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {selectedArea.description}
            </p>

            <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <p>{selectedArea.demoSchedule}</p>
              <p>{selectedArea.demoVenueNote}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedArea(null);
                  openAssistantWithPrompt('Tell me about campus clubs and upcoming events');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Campus Assist</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = selectedArea;
                  setSelectedArea(null);
                  handleOpenSaveInterest(target);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Save Interest</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Interest Modal */}
      {registerModalArea && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Save interest in ${registerModalArea.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setRegisterModalArea(null)}
        >
          <form
            onSubmit={handleSaveSubmit}
            className="w-full max-w-md bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  Save Interest: {registerModalArea.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Bookmark this interest area on your device. Check official university notices for formal club registrations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRegisterModalArea(null)}
                aria-label="Close save interest dialog"
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="club-reg-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Name *
                </label>
                <input
                  id="club-reg-name"
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g., Ananya Sharma"
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="club-reg-course" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course &amp; Year
                </label>
                <select
                  id="club-reg-course"
                  value={courseYear}
                  onChange={(e) => setCourseYear(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option>B.Tech 1st Year</option>
                  <option>B.Tech 2nd Year</option>
                  <option>B.Tech 3rd Year</option>
                  <option>BCA / MCA</option>
                  <option>BBA / MBA</option>
                  <option>Other Program</option>
                </select>
              </div>

              <div>
                <label htmlFor="club-reg-note" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Personal Note (Optional)
                </label>
                <textarea
                  id="club-reg-note"
                  rows={2}
                  value={interestNote}
                  onChange={(e) => setInterestNote(e.target.value)}
                  placeholder="e.g., Interested in coding projects or photography..."
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              {formError && <p className="text-xs font-medium text-red-600 dark:text-red-400">{formError}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRegisterModalArea(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
              >
                Save Interest
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
