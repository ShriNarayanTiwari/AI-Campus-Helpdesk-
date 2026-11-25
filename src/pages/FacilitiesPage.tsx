import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  X,
} from 'lucide-react';
import { FacilityVisual } from '../components/FacilityVisual';
import { useCampus } from '../context/CampusContext';
import { FACILITIES_DIRECTORY } from '../data/campusDirectory';
import { records } from '../data/cedar';
import type { FacilityItem } from '../types/campus';

const CATEGORIES = [
  'All',
  'Library',
  'Hostels',
  'Mess & Dining',
  'Transport',
  'Sports',
  'Academic',
  'Medical & Safety',
  'Campus Services',
];

export const FacilitiesPage: React.FC = () => {
  const { openAssistantWithPrompt, toggleFavorite, isFavorite, trackRecentlyViewed } = useCampus();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);

  useEffect(() => {
    if (!selectedFacility) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedFacility(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedFacility]);

  const handleOpenFacility = (fac: FacilityItem) => {
    setSelectedFacility(fac);
    trackRecentlyViewed({
      id: fac.id,
      title: fac.name,
      category: fac.category,
      type: 'facility',
      targetPage: 'facilities',
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FACILITIES_DIRECTORY.filter((f) => {
      if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
      if (!q) return true;
      return `${f.name} ${f.category} ${f.summary} ${f.verifiedDetails.join(' ')}`
        .toLowerCase()
        .includes(q);
    });
  }, [search, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Campus Facilities Directory
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          Explore campus facilities, labs, residential halls, dining spaces, and support services.
        </p>
      </div>

      {/* Filter & Search Bar — Stacked & Wrapped so "All" is always visible */}
      <div className="space-y-3">
        <div className="relative w-full sm:max-w-md">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <label htmlFor="facility-search" className="sr-only">
            Search campus facilities
          </label>
          <input
            id="facility-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search library, hostels, mess, transport..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div
          role="group"
          aria-label="Filter facilities by category"
          className="flex flex-wrap items-center gap-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-700 text-white'
                  : 'bg-white dark:bg-[#0E1C32] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            No facilities matched &ldquo;{search}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((fac) => {
            const fav = isFavorite(fac.id);
            return (
              <article
                key={fac.id}
                className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full overflow-hidden border-b border-slate-200 dark:border-slate-800">
                    <FacilityVisual facilityId={fac.id} name={fac.name} category={fac.category} />
                  </div>
                  <div className="p-5 space-y-2.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      {fac.category}
                    </span>
                    <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                      {fac.name}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {fac.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenFacility(fac)}
                    className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
                  >
                    View Details
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        toggleFavorite({
                          id: fac.id,
                          title: fac.name,
                          type: 'facility',
                          targetPage: 'facilities',
                          url: fac.sourceUrl,
                        })
                      }
                      aria-label={fav ? `Remove ${fac.name} from saved resources` : `Save ${fac.name} to saved resources`}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                        fav
                          ? 'text-blue-700 dark:text-teal-300 bg-blue-50 dark:bg-blue-950/50'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" fill={fav ? 'currentColor' : 'none'} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openAssistantWithPrompt(fac.suggestedQuestion)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 rounded-md whitespace-nowrap cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Ask Campus Assist</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Facility Detail Modal */}
      {selectedFacility && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedFacility.name} details`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setSelectedFacility(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{selectedFacility.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Updated {selectedFacility.lastChecked}</span>
                </div>
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">
                  {selectedFacility.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFacility(null)}
                aria-label="Close facility details"
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <ul className="space-y-2">
                {selectedFacility.verifiedDetails.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <ul className="space-y-2">
                {records
                  .filter(
                    (r) =>
                      r.id === selectedFacility.id ||
                      (selectedFacility.id === 'hostel' && ['hostel-guidance', 'rooms', 'mess'].includes(r.id)) ||
                      (selectedFacility.id === 'library' && r.id.startsWith('hours-'))
                  )
                  .map((r) => r.content)
                  .map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  const q = selectedFacility.suggestedQuestion;
                  setSelectedFacility(null);
                  openAssistantWithPrompt(q);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ask Campus Assist</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
