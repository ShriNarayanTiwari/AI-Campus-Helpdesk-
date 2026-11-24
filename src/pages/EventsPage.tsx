import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { SourceLabel } from '../components/SourceLabel';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_EVENTS } from '../data/campusDirectory';
import {
  buildIcsContent,
  computeEventStatus,
  filterCampusEvents,
  formatDisplayDate,
} from '../lib/events';
import type { CampusEvent } from '../types/campus';

const EVENT_CATEGORIES = ['All', 'Technical', 'Workshop', 'Cultural', 'Academic', 'Sports', 'Career'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const EventsPage: React.FC = () => {
  const { eventRegistrations, toggleEventRegistration, trackRecentlyViewed, pushToast } = useCampus();

  const [statusFilter, setStatusFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);

  useEffect(() => {
    if (!selectedEvent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedEvent]);

  const handleOpenEvent = (evt: CampusEvent) => {
    setSelectedEvent(evt);
    trackRecentlyViewed({
      id: evt.id,
      title: evt.title,
      category: evt.category,
      type: 'event',
      targetPage: 'events',
    });
  };

  // Interactive month calendar state (starts on Nov 2026 / current local month)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [filterBySelectedMonth, setFilterBySelectedMonth] = useState(false);

  const monthKey = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, '0')}`;

  const filteredEvents = useMemo(
    () =>
      filterCampusEvents(CAMPUS_EVENTS, {
        status: statusFilter,
        category: categoryFilter,
        search,
        monthKey: filterBySelectedMonth ? monthKey : undefined,
      }),
    [statusFilter, categoryFilter, search, filterBySelectedMonth, monthKey]
  );

  // Build calendar grid cells for current calendarMonth
  const calendarCells = useMemo(() => {
    const firstDay = new Date(calendarMonth.year, calendarMonth.month, 1).getDay();
    const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
    const cells: Array<{ day: number | null; iso?: string; events: CampusEvent[] }> = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null, events: [] });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = CAMPUS_EVENTS.filter((e) => e.date === iso);
      cells.push({ day: d, iso, events: dayEvents });
    }
    return cells;
  }, [calendarMonth]);

  const shiftMonth = (delta: number) => {
    setCalendarMonth((prev) => {
      const dt = new Date(prev.year, prev.month + delta, 1);
      return { year: dt.getFullYear(), month: dt.getMonth() };
    });
  };

  const handleDownloadIcs = (evt: CampusEvent) => {
    const ics = buildIcsContent(evt);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${evt.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    pushToast(`Downloaded calendar reminder (.ics) for ${evt.title}.`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Campus Events Calendar
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Browse campus events, reserve your place and save a calendar reminder.
          </p>
        </div>

        <SourceLabel type="demo" />
      </div>

      {/* Explicit Local Prototype RSVP Workflow Notice */}
      <div className="px-4 py-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 text-xs text-amber-900 dark:text-amber-200">
        Saved on this device.
      </div>

      {/* Main Split: Calendar Grid + Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Month Calendar */}
        <section
          aria-label="Interactive Monthly Calendar"
          className="lg:col-span-5 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display font-bold text-base text-slate-900 dark:text-white">
              {MONTH_NAMES[calendarMonth.month]} {calendarMonth.year}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell, idx) => {
              if (cell.day === null) {
                return <div key={`empty-${idx}`} className="h-10" />;
              }
              const hasEvent = cell.events.length > 0;
              const isPast = cell.iso ? computeEventStatus(cell.iso) === 'past' : false;

              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => {
                    if (hasEvent) handleOpenEvent(cell.events[0]);
                  }}
                  disabled={!hasEvent}
                  aria-label={
                    hasEvent
                      ? `${cell.day} ${MONTH_NAMES[calendarMonth.month]}: ${cell.events.map((e) => e.title).join(', ')}`
                      : `${cell.day} ${MONTH_NAMES[calendarMonth.month]}: no events`
                  }
                  className={`h-10 rounded-lg text-xs font-medium tabular-nums flex flex-col items-center justify-center transition-colors ${
                    hasEvent
                      ? isPast
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 cursor-pointer font-bold'
                        : 'bg-blue-700 text-white hover:bg-blue-800 cursor-pointer font-bold'
                      : 'text-slate-600 dark:text-slate-400 cursor-default'
                  }`}
                >
                  <span>{cell.day}</span>
                  {hasEvent && <span className="text-[9px] leading-none mt-0.5">{cell.events.length} evt</span>}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
            <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filterBySelectedMonth}
                onChange={(e) => setFilterBySelectedMonth(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Filter list to {MONTH_NAMES[calendarMonth.month]}</span>
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Blue = Upcoming · Gray = Past</span>
          </div>
        </section>

        {/* Events Filters & Cards */}
        <section className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                {(
                  [
                    { id: 'upcoming', label: 'Upcoming' },
                    { id: 'past', label: 'Past Archive' },
                    { id: 'all', label: 'All Events' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      statusFilter === tab.id
                        ? 'bg-white dark:bg-[#0E1C32] text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <label htmlFor="event-search" className="sr-only">
                  Search events
                </label>
                <input
                  id="event-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                No events match your active filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setCategoryFilter('All');
                  setSearch('');
                  setFilterBySelectedMonth(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg cursor-pointer"
              >
                Show All Events
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredEvents.map((evt) => {
                const timeStatus = computeEventStatus(evt.date);
                const isRegistered = eventRegistrations.includes(evt.id);

                return (
                  <article
                    key={evt.id}
                    className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400 tabular-nums">
                        <span
                          className={`font-semibold ${
                            timeStatus === 'past'
                              ? 'text-slate-500 dark:text-slate-400'
                              : 'text-teal-700 dark:text-teal-300'
                          }`}
                        >
                          {timeStatus === 'past' ? 'Past Event' : timeStatus === 'today' ? 'Today' : 'Upcoming'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDisplayDate(evt.date)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.category}</span>
                      </div>
                      <SourceLabel type={evt.sourceType} compact />
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        {evt.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {evt.startTime} – {evt.endTime}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        {evt.venue}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEvent(evt)}
                        className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        View Details
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadIcs(evt)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg whitespace-nowrap cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Add to Calendar (.ics)</span>
                        </button>

                        {timeStatus !== 'past' && (
                          <button
                            type="button"
                            onClick={() => toggleEventRegistration(evt.id, evt.title)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                              isRegistered
                                ? 'bg-teal-700 text-white hover:bg-teal-800'
                                : 'bg-blue-700 text-white hover:bg-blue-800'
                            }`}
                          >
                            {isRegistered ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>RSVP Saved (Local)</span>
                              </>
                            ) : (
                              <>
                                <CalendarIcon className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Local RSVP</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedEvent.title} details`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <SourceLabel type={selectedEvent.sourceType} />
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
                  {selectedEvent.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close event dialog"
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <p>{selectedEvent.description}</p>
              <div className="pt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300 tabular-nums">
                <p>
                  <strong>Date:</strong> {formatDisplayDate(selectedEvent.date)} ({selectedEvent.startTime} – {selectedEvent.endTime})
                </p>
                <p>
                  <strong>Status:</strong> {computeEventStatus(selectedEvent.date) === 'past' ? 'Past (Archived)' : 'Upcoming'}
                </p>
                <p>
                  <strong>Organizer:</strong> {selectedEvent.organizer}
                </p>
                <p>
                  <strong>Location:</strong> {selectedEvent.venue}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              

              <button
                type="button"
                onClick={() => handleDownloadIcs(selectedEvent)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .ics</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
