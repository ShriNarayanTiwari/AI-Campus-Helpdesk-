import React, { useState } from 'react';
import {
  ArrowRight,
  Compass,
  LogIn,
  Moon,
  ShieldCheck,
  Sun,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { useCampus } from '../context/CampusContext';
import { BUNDLED_CAMPUS_IMAGES } from '../data/campusImages';

type AccessTab = 'existing' | 'new';

const ROLL_NUMBER_REGEX = /^[A-Za-z0-9][A-Za-z0-9\-/]{4,19}$/;

export const WelcomePage: React.FC = () => {
  const { signInStudent, registerStudent, enterAsGuest, theme, toggleTheme } = useCampus();

  const [tab, setTab] = useState<AccessTab>('existing');

  // Existing Student form fields (password kept only in ephemeral state, never persisted)
  const [signInRoll, setSignInRoll] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');

  // New Student form fields (password kept only in ephemeral state, never persisted)
  const [fullName, setFullName] = useState('');
  const [newRoll, setNewRoll] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');

  const handleExistingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoll = signInRoll.trim();

    if (!ROLL_NUMBER_REGEX.test(cleanRoll)) {
      setSignInError('Enter a valid University Roll Number (5–20 letters or digits).');
      return;
    }
    if (signInPassword.length < 6) {
      setSignInError('Password must be at least 6 characters.');
      return;
    }

    // Clear password immediately and never store or transmit it
    setSignInPassword('');
    setSignInError('');
    signInStudent(cleanRoll);
  };

  const handleNewStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    const cleanRoll = newRoll.trim();

    if (cleanName.length < 2) {
      setRegisterError('Enter your full name (at least 2 characters).');
      return;
    }
    if (!ROLL_NUMBER_REGEX.test(cleanRoll)) {
      setRegisterError('Enter a valid University Roll Number (5–20 letters or digits).');
      return;
    }
    if (newPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }

    // Clear passwords immediately and never store or transmit them
    setNewPassword('');
    setConfirmPassword('');
    setRegisterError('');
    registerStudent(cleanName, cleanRoll);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#071120] text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Minimal Top Bar */}
      <header className="w-full max-w-[1200px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#0F766E] flex items-center justify-center shrink-0">
            <Compass className="w-4.5 h-4.5 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="block font-display font-bold text-base tracking-tight text-slate-900 dark:text-white leading-tight whitespace-nowrap">
              Campus Assist
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight whitespace-nowrap">
              Student Information Hub
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-white dark:bg-[#0E1C32] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
          )}
        </button>
      </header>

      {/* Main Access Card */}
      <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-6 sm:py-10">
        <div className="w-full max-w-[1080px] rounded-2xl overflow-hidden bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Architectural Visual & Welcome Copy */}
          <section className="lg:col-span-5 relative flex flex-col justify-between bg-[#0B192C] text-white min-h-[240px]">
            <div className="absolute inset-0">
              <SafeImage
                src={BUNDLED_CAMPUS_IMAGES.hero}
                alt="Campus buildings and landscaped grounds"
                fallbackTitle="Campus Assist — Student Information Hub"
                className="w-full h-full object-cover"
                eager
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/95 via-[#0B192C]/70 to-[#0B192C]/45" />
            </div>

            <div className="relative z-10 p-7 sm:p-8 flex flex-col justify-between h-full gap-8">
              <div className="space-y-3">
                <p className="text-xs font-medium text-teal-300">
                  Student Information Hub · Designed for GLA University students
                </p>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl leading-[1.12] tracking-tight text-white">
                  Welcome to Campus Assist
                </h1>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  Access student resources, campus services, and helpful information in one place.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/15 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="leading-relaxed">
                    Browser-only student hub access. This is not official GLA University authentication, and passwords are never saved.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Access Form Column */}
          <section
            aria-label="Campus Assist Access Options"
            className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6"
          >
            <div className="space-y-5">
              {/* Mode Tabs: Existing Student / New Student */}
              <div
                role="tablist"
                aria-label="Student access options"
                className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#091426] border border-slate-200 dark:border-slate-800"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === 'existing'}
                  onClick={() => {
                    setTab('existing');
                    setRegisterError('');
                  }}
                  className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    tab === 'existing'
                      ? 'bg-white dark:bg-[#132542] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LogIn className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Existing Student</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === 'new'}
                  onClick={() => {
                    setTab('new');
                    setSignInError('');
                  }}
                  className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    tab === 'new'
                      ? 'bg-white dark:bg-[#132542] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>New Student</span>
                </button>
              </div>

              {/* Tab A: Existing Student */}
              {tab === 'existing' ? (
                <form onSubmit={handleExistingSubmit} className="space-y-4" noValidate>
                  <div>
                    <label
                      htmlFor="signin-roll"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      University Roll Number
                    </label>
                    <input
                      id="signin-roll"
                      name="rollNumber"
                      type="text"
                      autoComplete="username"
                      value={signInRoll}
                      onChange={(e) => {
                        setSignInRoll(e.target.value);
                        if (signInError) setSignInError('');
                      }}
                      placeholder="e.g., 2415000123"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-teal-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signin-password"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Password
                    </label>
                    <input
                      id="signin-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={signInPassword}
                      onChange={(e) => {
                        setSignInPassword(e.target.value);
                        if (signInError) setSignInError('');
                      }}
                      placeholder="Enter your password (min 6 characters)"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-teal-400"
                    />
                  </div>

                  {signInError && (
                    <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                      {signInError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>
              ) : (
                /* Tab B: New Student */
                <form onSubmit={handleNewStudentSubmit} className="space-y-3.5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="register-name"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Full Name
                      </label>
                      <input
                        id="register-name"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (registerError) setRegisterError('');
                        }}
                        placeholder="e.g., Ananya Sharma"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="register-roll"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        University Roll Number
                      </label>
                      <input
                        id="register-roll"
                        name="rollNumber"
                        type="text"
                        autoComplete="username"
                        value={newRoll}
                        onChange={(e) => {
                          setNewRoll(e.target.value);
                          if (registerError) setRegisterError('');
                        }}
                        placeholder="e.g., 2415000123"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-teal-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label
                        htmlFor="register-password"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Password
                      </label>
                      <input
                        id="register-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (registerError) setRegisterError('');
                        }}
                        placeholder="At least 6 characters"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="register-confirm"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="register-confirm"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (registerError) setRegisterError('');
                        }}
                        placeholder="Re-enter password"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-teal-400"
                      />
                    </div>
                  </div>

                  {registerError && (
                    <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                      {registerError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </form>
              )}

              {/* Divider + Guest Option */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white dark:bg-[#0E1C32] text-slate-500 dark:text-slate-400">
                    or browse directly
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={enterAsGuest}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#0F766E] dark:text-teal-300" aria-hidden="true" />
                <span>Continue as Guest</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
              Your information remains on this device.
            </p>
          </section>
        </div>
      </main>

      {/* Single Subtle Footer Note */}
      <footer className="w-full max-w-[1200px] mx-auto px-5 sm:px-8 py-5 text-center sm:text-left">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          For guidance only. Please verify policies, fees, dates, and notices through official GLA University channels.
        </p>
      </footer>
    </div>
  );
};
