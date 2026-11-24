import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  MessageSquare,
  Search,
  UserPlus,
  X,
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { SourceLabel } from '../components/SourceLabel';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_IMAGES, CLUBS_DIRECTORY } from '../data/campusDirectory';
import type { ClubItem } from '../types/campus';

const CLUB_CATEGORIES = [
  'All',
  'Technical',
  'Media & Creative',
  'Cultural & Arts',
  'Literary & Debate',
  'Departmental',
];

export const ClubsPage: React.FC = () => {
  const {
    clubRegistrations,
    registerClubInterest,
    cancelClubInterest,
    openAssistantWithPrompt,
    trackRecentlyViewed,
    userProfile,
  } = useCampus();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedClub, setSelectedClub] = useState<ClubItem | null>(null);
  const [registerModalClub, setRegisterModalClub] = useState<ClubItem | null>(null);

  useEffect(() => {
    if (!selectedClub && !registerModalClub) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (registerModalClub) setRegisterModalClub(null);
      else if (selectedClub) setSelectedClub(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedClub, registerModalClub]);

  // Registration form fields
  const [studentName, setStudentName] = useState(userProfile.isGuest ? '' : userProfile.name);
  const [courseYear, setCourseYear] = useState(
    userProfile.isGuest ? 'B.Tech 1st Year' : `${userProfile.programme} (${userProfile.year})`
  );
  const [interestNote, setInterestNote] = useState('');
  const [formError, setFormError] = useState('');

  const handleExploreClub = (club: ClubItem) => {
    setSelectedClub(club);
    trackRecentlyViewed({
      id: club.id,
      title: club.name,
      category: club.category,
      type: 'club',
      targetPage: 'clubs',
    });
  };

  const registeredIds = useMemo(
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

  const handleOpenRegister = (club: ClubItem) => {
    setRegisterModalClub(club);
    setFormError('');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerModalClub) return;
    if (studentName.trim().length < 2) {
      setFormError('Please enter your name (at least 2 characters) to save demo interest.');
      return;
    }

    registerClubInterest({
      clubId: registerModalClub.id,
      clubName: registerModalClub.name,
      studentName: studentName.trim(),
      courseYear: courseYear.trim() || 'B.Tech 1st Year',
      interestNote: interestNote.trim(),
    });
    setStudentName('');
    setInterestNote('');
    setFormError('');
    setRegisterModalClub(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-8 p-6 sm:p-7 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <SourceLabel type="official" compact />
              <span aria-hidden="true">·</span>
              <span>Student societies at Cedarbrook</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
              Clubs &amp; Societies Directory
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Find a club, check its meeting time and register your interest.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 tabular-nums">
            <span>
              <strong className="text-slate-900 dark:text-white">{CLUBS_DIRECTORY.length}</strong> Featured Clubs
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <strong className="text-teal-700 dark:text-teal-300">{clubRegistrations.length}</strong> Saved Interests
            </span>
            <span aria-hidden="true">·</span>
            
          </div>
        </div>
        <div className="lg:col-span-4 min-h-[180px] lg:min-h-full">
          <SafeImage
            src={CAMPUS_IMAGES.clubs}
            alt="Students collaborating in a university club workshop"
            fallbackTitle="GLA Student Clubs & Societies"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <label htmlFor="club-search" className="sr-only">
            Search clubs and societies
          </label>
          <input
            id="club-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MediaScoop, Cyberonites, CSI, Ninad, coding..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CLUB_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
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
          aria-label="Saved Demo Club Registrations"
          className="bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-800/70 rounded-xl p-4 space-y-2.5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SourceLabel type="demo" />
              <span className="text-xs text-slate-700 dark:text-slate-300">
                Your simulated club interest list (saved locally — not submitted to Cedarbrook Campus)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {clubRegistrations.map((reg) => (
              <div
                key={reg.clubId}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E1C32] border border-amber-200 dark:border-amber-800 text-xs"
              >
                <span className="font-semibold text-slate-900 dark:text-white">{reg.clubName}</span>
                <span className="text-slate-500 dark:text-slate-400">({reg.studentName})</span>
                <button
                  type="button"
                  onClick={() => cancelClubInterest(reg.clubId)}
                  aria-label={`Remove demo registration for ${reg.clubName}`}
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Clubs Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">No clubs matched your filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategory('All');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg cursor-pointer"
          >
            Show All Clubs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((club) => {
            const isRegistered = registeredIds.has(club.id);
            return (
              <article
                key={club.id}
                className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{club.category}</span>
                    <SourceLabel type={club.sourceType} compact />
                  </div>
                  <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {club.name}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {club.description}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1.5 pt-1">
                    <FlaskConical className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{club.demoSchedule}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleExploreClub(club)}
                    className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
                  >
                    Explore
                  </button>

                  {isRegistered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-300 whitespace-nowrap">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Interest Saved</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenRegister(club)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Register Interest</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Club Explore Modal */}
      {selectedClub && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedClub.name} club details`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setSelectedClub(null)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedClub.category} · Checked {selectedClub.lastChecked}
                </span>
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-0.5">
                  {selectedClub.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClub(null)}
                aria-label="Close club modal"
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {selectedClub.description}
            </p>

            <div className="space-y-2">
              <SourceLabel type="official" />
              <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                {selectedClub.verifiedActivities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <SourceLabel type="demo" />
              <p>{selectedClub.demoSchedule}</p>
              <p>{selectedClub.demoUpcomingActivity}</p>
              <p>{selectedClub.demoVenueNote}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const name = selectedClub.name;
                    setSelectedClub(null);
                    openAssistantWithPrompt(`Tell me about the ${name} club at Cedarbrook Campus.`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedClub;
                    setSelectedClub(null);
                    handleOpenRegister(target);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Interest</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Membership Interest Registration Modal */}
      {registerModalClub && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Register demo interest for ${registerModalClub.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setRegisterModalClub(null)}
        >
          <form
            onSubmit={handleRegisterSubmit}
            className="w-full max-w-md bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <SourceLabel type="demo" />
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-1">
                  Register Interest: {registerModalClub.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setRegisterModalClub(null)}
                aria-label="Close registration dialog"
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-lg p-3">
              Your registration is saved on this device.
            </p>

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
                  placeholder="e.g., Ananya Singh"
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
                  Why are you interested? (Optional)
                </label>
                <textarea
                  id="club-reg-note"
                  rows={2}
                  value={interestNote}
                  onChange={(e) => setInterestNote(e.target.value)}
                  placeholder="e.g., Excited to learn ethical hacking / photography..."
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              {formError && <p className="text-xs font-medium text-red-600 dark:text-red-400">{formError}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRegisterModalClub(null)}
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
