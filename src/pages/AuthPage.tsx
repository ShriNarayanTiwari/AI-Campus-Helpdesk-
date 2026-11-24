import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  Compass,
  LogIn,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import type { KnowledgeCategory } from '../types/campus';

const PROGRAMMES = [
  'B.Tech CSE',
  'B.Tech CSE (AI / ML)',
  'B.Tech ECE',
  'B.Tech Mechanical / Civil',
  'BCA / MCA',
  'BBA / MBA',
  'B.Pharm / M.Pharm',
  'Law / Humanities / Sciences',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

const STUDENT_INTERESTS = [
  'Coding & AI',
  'Cybersecurity & Cloud',
  'Robotics & Hardware',
  'Library & Research',
  'Music & Performing Arts',
  'Photography & Media',
  'Sports & Fitness',
  'Entrepreneurship',
  'Debate & Literary',
  'Internships & Placements',
  'Campus Life & Wellbeing',
];

const PREFERRED_CATEGORIES: KnowledgeCategory[] = [
  'Academics',
  'Library',
  'Campus Facilities',
  'Clubs & Societies',
  'Campus Events',
  'Student Services',
  'Placements',
  'Campus Life',
  'Hostels & Mess',
  'Transport',
];

export const AuthPage: React.FC = () => {
  const {
    userProfile,
    savedProfiles,
    saveLocalProfile,
    signInSavedProfile,
    quickSignInByName,
    continueAsGuest,
    navigate,
  } = useCampus();

  const [tab, setTab] = useState<'register' | 'signin'>(userProfile.isGuest ? 'register' : 'register');
  const [name, setName] = useState(userProfile.isGuest ? '' : userProfile.name);
  const [programme, setProgramme] = useState(userProfile.programme || PROGRAMMES[0]);
  const [year, setYear] = useState(userProfile.year || YEARS[0]);
  const [interests, setInterests] = useState<string[]>(
    userProfile.interests.length > 0 ? userProfile.interests : ['Coding & AI', 'Library & Research']
  );
  const [preferredCategories, setPreferredCategories] = useState<KnowledgeCategory[]>(
    userProfile.preferredCategories.length > 0
      ? userProfile.preferredCategories
      : ['Academics', 'Library', 'Clubs & Societies']
  );

  const [signInName, setSignInName] = useState('');
  const [formError, setFormError] = useState('');

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item].slice(0, 6)
    );
  };

  const toggleCategory = (cat: KnowledgeCategory) => {
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat].slice(0, 5)
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setFormError('Please enter your name (at least 2 characters).');
      return;
    }
    if (interests.length === 0) {
      setFormError('Please pick at least one interest so we can personalize your dashboard.');
      return;
    }
    if (preferredCategories.length === 0) {
      setFormError('Please pick at least one preferred category.');
      return;
    }
    setFormError('');
    saveLocalProfile({
      name: name.trim(),
      programme,
      year,
      interests,
      preferredCategories,
    });
    navigate('home');
  };

  const handleQuickSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (signInName.trim().length < 2) {
      setFormError('Enter your student name to sign into a local browser profile.');
      return;
    }
    setFormError('');
    quickSignInByName(signInName.trim());
    navigate('home');
  };

  return (
    <div className="max-w-5xl mx-auto py-2 sm:py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-[#0E1C32]">
        {/* Brand Indigo & Teal Side Panel */}
        <section className="lg:col-span-5 bg-gradient-to-br from-[#0B192C] via-[#1E3A8A] to-[#0F766E] text-white p-6 sm:p-8 flex flex-col justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">AI Campus Helpdesk</span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl leading-tight">
              {userProfile.isGuest ? 'Personalize your campus workspace' : 'Update your student profile'}
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Tailor your Home dashboard with relevant academics, clubs, facilities, career prep, and campus life guides based on your programme and interests.
            </p>
          </div>

          <div className="space-y-3 text-xs text-blue-50/90">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 border border-white/15">
              <Sparkles className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-white">Personalized for you</p>
                <p className="mt-0.5 text-blue-100/85">
                  Recommended records, clubs, and quick prompts adapt immediately to your chosen categories.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 border border-white/15">
              <ShieldCheck className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-white">Zero credentials collected</p>
                <p className="mt-0.5 text-blue-100/85">
                  Your profile is saved on this device.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2 text-xs text-blue-100/80">
            <span>Your profile is saved on this device.</span>
          </div>
        </section>

        {/* Interactive Form Panel */}
        <section className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg self-start">
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setFormError('');
                }}
                aria-pressed={tab === 'register'}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  tab === 'register'
                    ? 'bg-white dark:bg-[#0E1C32] text-[#1E3A8A] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{userProfile.isGuest ? 'Create Account' : 'Edit Profile'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setFormError('');
                }}
                aria-pressed={tab === 'signin'}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  tab === 'signin'
                    ? 'bg-white dark:bg-[#0E1C32] text-[#1E3A8A] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sign In</span>
              </button>
            </div>

            <button
              type="button"
              onClick={continueAsGuest}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:underline self-start sm:self-auto cursor-pointer"
            >
              <span>Continue as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {tab === 'register' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label htmlFor="profile-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Name *
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Ananya Verma"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] dark:focus:ring-teal-400"
                  />
                </div>

                <div>
                  <label htmlFor="profile-programme" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Programme
                  </label>
                  <select
                    id="profile-programme"
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {PROGRAMMES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="profile-year" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Year
                  </label>
                  <select
                    id="profile-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Campus Interests (select up to 6)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    {interests.length}/6 selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {STUDENT_INTERESTS.map((item) => {
                    const selected = interests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        aria-pressed={selected}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#0F766E] text-white border-[#0F766E]'
                            : 'bg-slate-50 dark:bg-[#091426] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0F766E]'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" aria-hidden="true" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Categories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Preferred Knowledge Categories (select up to 5)
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    {preferredCategories.length}/5 selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PREFERRED_CATEGORIES.map((cat) => {
                    const selected = preferredCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        aria-pressed={selected}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                            : 'bg-slate-50 dark:bg-[#091426] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1E3A8A]'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" aria-hidden="true" />}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                  {formError}
                </p>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" aria-hidden="true" />
                  <span>{userProfile.isGuest ? 'Create Local Profile' : 'Save Profile Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={continueAsGuest}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Continue as Guest
                </button>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Your profile is saved on this device.
              </p>
            </form>
          ) : (
            <div className="space-y-5">
              {savedProfiles.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Saved profiles on this browser
                  </p>
                  <div className="space-y-2">
                    {savedProfiles.map((prof) => (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => {
                          signInSavedProfile(prof.id);
                          navigate('home');
                        }}
                        className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#1E3A8A] dark:hover:border-teal-400 bg-slate-50/70 dark:bg-[#091426] text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {prof.name
                              .split(/\s+/)
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {prof.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {prof.programme} · {prof.year}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#0F766E] dark:text-teal-300 whitespace-nowrap">
                          Sign In
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleQuickSignIn} className="space-y-3.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label htmlFor="quick-signin-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quick Local Sign In by Name (no password required)
                  </label>
                  <input
                    id="quick-signin-name"
                    type="text"
                    required
                    value={signInName}
                    onChange={(e) => setSignInName(e.target.value)}
                    placeholder="Enter your name to resume or start a local profile..."
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                {formError && (
                  <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                    {formError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-blue-900 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" aria-hidden="true" />
                    <span>Sign In Locally</span>
                  </button>
                  <button
                    type="button"
                    onClick={continueAsGuest}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Continue as Guest
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Your profile is saved on this device.
                </p>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
