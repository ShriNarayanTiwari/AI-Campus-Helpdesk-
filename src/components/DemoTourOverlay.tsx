import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Presentation,
  X,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { PRESENTATION_TOUR_STEPS } from '../data/campusDirectory';

export const DemoTourOverlay: React.FC = () => {
  const {
    isPresentationMode,
    presentationStepIndex,
    goToPresentationStep,
    exitPresentationMode,
    openAssistantWithPrompt,
  } = useCampus();

  useEffect(() => {
    if (!isPresentationMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exitPresentationMode();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPresentationMode, exitPresentationMode]);

  if (!isPresentationMode) return null;

  const current = PRESENTATION_TOUR_STEPS[presentationStepIndex];
  const total = PRESENTATION_TOUR_STEPS.length;

  return (
    <aside
      aria-label="Professor Viva Demo Controls"
      className="fixed bottom-4 left-4 right-4 lg:left-[276px] z-50"
    >
      <div className="max-w-4xl mx-auto bg-[#0B192C] text-white border border-blue-500/40 rounded-xl shadow-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <Presentation className="w-5 h-5 text-teal-300 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-teal-300 font-medium tabular-nums">
                <span>Professor Viva Demo</span>
                <span aria-hidden="true">·</span>
                <span className="px-1.5 py-0.5 rounded bg-teal-500/20 border border-teal-400/30 text-teal-200 font-semibold">
                  {current.pillar}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Step {current.step} of {total}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-display font-semibold text-white truncate mt-0.5">
                {current.step}. {current.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={exitPresentationMode}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Exit Demo</span>
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-blue-300">Goal: {current.vivaGoal}</p>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{current.talkingPoint}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {current.demoQuery && (
              <button
                type="button"
                onClick={() => openAssistantWithPrompt(current.demoQuery!)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Run Demo Prompt</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => goToPresentationStep(presentationStepIndex - 1)}
              disabled={presentationStepIndex === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (presentationStepIndex === total - 1) {
                  exitPresentationMode();
                } else {
                  goToPresentationStep(presentationStepIndex + 1);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{presentationStepIndex === total - 1 ? 'Finish Demo' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Step progress bar */}
        <div className="mt-3 flex items-center gap-1.5" aria-label="Presentation progress">
          {PRESENTATION_TOUR_STEPS.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => goToPresentationStep(idx)}
              aria-label={`Go to step ${s.step}: ${s.title}`}
              className={`h-1.5 flex-1 rounded-full transition-colors cursor-pointer ${
                idx === presentationStepIndex
                  ? 'bg-teal-400'
                  : idx < presentationStepIndex
                  ? 'bg-blue-500'
                  : 'bg-white/15 hover:bg-white/25'
              }`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};
