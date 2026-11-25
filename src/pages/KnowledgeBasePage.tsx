import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  Edit3,
  MessageSquare,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import type { KnowledgeCategory, KnowledgeRecord } from '../types/campus';

const KB_CATEGORIES: Array<'All' | KnowledgeCategory> = [
  'All',
  'Campus Facilities',
  'Library',
  'Hostels & Mess',
  'Transport',
  'Clubs & Societies',
  'Campus Events',
  'Academics',
  'Student Services',
  'Placements',
  'Campus Life',
  'Admissions & General',
  'Contacts & Portals',
  'Social & Community',
];

export const KnowledgeBasePage: React.FC = () => {
  const {
    knowledgeBase,
    addDemoRecord,
    updateDemoRecord,
    deleteDemoRecord,
    openAssistantWithPrompt,
    kbCategoryPreset,
    setKbCategoryPreset,
    trackRecentlyViewed,
    toggleFavorite,
    isFavorite,
  } = useCampus();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | KnowledgeCategory>(kbCategoryPreset);
  const [sourceFilter, setSourceFilter] = useState('All');
  const [viewingRecord, setViewingRecord] = useState<KnowledgeRecord | null>(null);

  useEffect(() => {
    if (kbCategoryPreset !== 'All') {
      setCategoryFilter(kbCategoryPreset);
      setKbCategoryPreset('All');
    }
  }, [kbCategoryPreset, setKbCategoryPreset]);

  const handleInspectRecord = (rec: KnowledgeRecord) => {
    setViewingRecord(rec);
    trackRecentlyViewed({
      id: rec.id,
      title: rec.title,
      category: rec.category,
      type: 'kb',
      targetPage: 'knowledge-base',
    });
  };

  // Add / Edit campus resource modal state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<KnowledgeCategory>('Campus Facilities');
  const [formSubcategory, setFormSubcategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formSourceUrl, setFormSourceUrl] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!viewingRecord && !editorOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (editorOpen) setEditorOpen(false);
      else if (viewingRecord) setViewingRecord(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewingRecord, editorOpen]);

  const uniqueSources = useMemo(() => {
    const set = new Set(knowledgeBase.map((r) => r.sourceName));
    return ['All', ...Array.from(set).sort()];
  }, [knowledgeBase]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return knowledgeBase.filter((r) => {
      if (categoryFilter !== 'All' && r.category !== categoryFilter) return false;
      if (sourceFilter !== 'All' && r.sourceName !== sourceFilter) return false;
      if (!q) return true;
      return `${r.title} ${r.category} ${r.subcategory} ${r.description} ${r.tags.join(' ')} ${r.keywords.join(' ')} ${r.sourceName}`
        .toLowerCase()
        .includes(q);
    });
  }, [knowledgeBase, search, categoryFilter, sourceFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setFormTitle('');
    setFormCategory('Campus Facilities');
    setFormSubcategory('');
    setFormDescription('');
    setFormKeywords('');
    setFormSourceUrl('');
    setFormError('');
    setEditorOpen(true);
  };

  const openEditModal = (rec: KnowledgeRecord) => {
    setEditingId(rec.id);
    setFormTitle(rec.title);
    setFormCategory(rec.category);
    setFormSubcategory(rec.subcategory || '');
    setFormDescription(rec.description);
    setFormKeywords(rec.keywords.join(', '));
    setFormSourceUrl(rec.sourceUrl);
    setFormError('');
    setEditorOpen(true);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (formTitle.trim().length < 4) {
      setFormError('Title must be at least 4 characters.');
      return;
    }
    if (formDescription.trim().length < 12) {
      setFormError('Description must be at least 12 characters.');
      return;
    }
    const cleanUrl = formSourceUrl.trim().startsWith('https://')
      ? formSourceUrl.trim()
      : '';

    const keywords = formKeywords
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const today = new Date().toISOString().slice(0, 10);
    const cleanKeywords = keywords.length > 0 ? keywords : [formCategory.toLowerCase()];

    const payload = {
      title: formTitle.trim(),
      category: formCategory,
      subcategory: formSubcategory.trim() || 'Student Note',
      content: formDescription.trim(),
      description: formDescription.trim(),
      tags: cleanKeywords,
      keywords: cleanKeywords,
      sourceUrl: cleanUrl,
      sourceName: 'Campus Assist Directory',
      lastChecked: today,
      lastReviewedDate: today,
    };

    if (editingId) {
      updateDemoRecord(editingId, payload);
    } else {
      addDemoRecord(payload);
    }
    setEditorOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Campus Resources
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl tabular-nums">
            Showing <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{knowledgeBase.length}</strong> searchable campus guides.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add resource</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <section className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <label htmlFor="kb-search" className="sr-only">
              Search campus resources by keyword
            </label>
            <input
              id="kb-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by keyword, title, or topic..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="kb-cat-select" className="sr-only">
              Filter by category
            </label>
            <select
              id="kb-cat-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'All' | KnowledgeCategory)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              {KB_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label htmlFor="kb-source-select" className="sr-only">
              Filter by directory
            </label>
            <select
              id="kb-source-select"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              {uniqueSources.map((src) => (
                <option key={src} value={src}>
                  {src === 'All' ? 'All Directories' : src}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(search || categoryFilter !== 'All' || sourceFilter !== 'All') && (
          <div className="flex items-center justify-end pt-1">
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setSourceFilter('All');
              }}
              className="text-xs font-semibold text-blue-700 dark:text-teal-300 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Resources List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">No campus resources matched your filters.</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategoryFilter('All');
              setSourceFilter('All');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rec) => {
            const saved = isFavorite(rec.id);
            return (
              <article
                key={rec.id}
                className="rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-3 border min-w-0 bg-white dark:bg-[#0E1C32] border-slate-200 dark:border-slate-800"
              >
                <div className="space-y-2 min-w-0">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate block">
                    {rec.category}
                    {rec.subcategory && rec.subcategory !== rec.category ? ` · ${rec.subcategory}` : ''}
                  </span>
                  <h2 className="font-display font-bold text-base text-slate-900 dark:text-white break-words">
                    {rec.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 break-words">
                    {rec.description}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    Keywords: {Array.from(new Set(rec.tags)).join(', ')}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleInspectRecord(rec)}
                    className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        toggleFavorite({
                          id: rec.id,
                          title: rec.title,
                          type: 'kb',
                          targetPage: 'knowledge-base',
                          url: rec.sourceUrl,
                        })
                      }
                      aria-label={saved ? `Remove ${rec.title} from saved resources` : `Save ${rec.title}`}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        saved
                          ? 'text-blue-700 dark:text-teal-300 bg-blue-50 dark:bg-blue-950/50'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
                    </button>
                    {rec.isCustomDemo && (
                      <>
                        <button
                          type="button"
                          onClick={() => openEditModal(rec)}
                          aria-label={`Edit resource ${rec.title}`}
                          className="p-1.5 text-slate-500 hover:text-blue-700 dark:hover:text-teal-300 rounded cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteDemoRecord(rec.id)}
                          aria-label={`Delete resource ${rec.title}`}
                          className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Inspect Resource Modal */}
      {viewingRecord && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Campus resource: ${viewingRecord.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setViewingRecord(null)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  {viewingRecord.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {viewingRecord.category}
                  {viewingRecord.subcategory && viewingRecord.subcategory !== viewingRecord.category
                    ? ` · ${viewingRecord.subcategory}`
                    : ''}{' '}
                  · Updated {viewingRecord.lastReviewedDate ?? viewingRecord.lastChecked}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingRecord(null)}
                aria-label="Close resource details"
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {viewingRecord.content || viewingRecord.description}
            </p>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>
                <strong>Keywords:</strong>{' '}
                <span className="font-mono break-words">
                  {Array.from(new Set(viewingRecord.keywords)).join(', ')}
                </span>
              </p>
              <p>
                <strong>Directory:</strong> {viewingRecord.sourceName}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const title = viewingRecord.title;
                  setViewingRecord(null);
                  openAssistantWithPrompt(`Tell me about ${title}`);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Campus Assist</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Campus Resource Modal */}
      {editorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingId ? 'Edit campus resource' : 'Add campus resource'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setEditorOpen(false)}
        >
          <form
            onSubmit={handleSaveRecord}
            className="w-full max-w-lg bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                  {editingId ? 'Edit campus resource' : 'Add campus resource'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Entries added here are searchable in Campus Resources and Campus Assist.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                aria-label="Close resource editor"
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="kb-form-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  id="kb-form-title"
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Robotics Club Orientation Guide"
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="kb-form-cat" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    id="kb-form-cat"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as KnowledgeCategory)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {KB_CATEGORIES.filter((c): c is KnowledgeCategory => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="kb-form-subcat" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subcategory
                  </label>
                  <input
                    id="kb-form-subcat"
                    type="text"
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    placeholder="e.g., Student Orientation"
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="kb-form-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content / Description *
                </label>
                <textarea
                  id="kb-form-desc"
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter helpful campus details..."
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="kb-form-kw" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Search Keywords (comma-separated)
                </label>
                <input
                  id="kb-form-kw"
                  type="text"
                  value={formKeywords}
                  onChange={(e) => setFormKeywords(e.target.value)}
                  placeholder="e.g., robotics, hardware, orientation"
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="kb-form-url" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reference URL (https://)
                </label>
                <input
                  id="kb-form-url"
                  type="url"
                  value={formSourceUrl}
                  onChange={(e) => setFormSourceUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              {formError && <p className="text-xs font-medium text-red-600 dark:text-red-400">{formError}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
              >
                {editingId ? 'Save Changes' : 'Add resource'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
