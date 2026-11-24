import { answer } from '../lib/campusAnswer';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Database,
  ExternalLink,
  History,
  Layers,
  Mic,
  MicOff,
  Plus,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  WifiOff,
} from 'lucide-react';
import { FreshnessBadge, SourceLabel } from '../components/SourceLabel';
import { useCampus } from '../context/CampusContext';
import { SUGGESTED_TEST_PROMPTS } from '../data/campusDirectory';
import {
  buildFallbackResponse,
  buildFollowUpSuggestions,
  buildGroundedContextText,
  buildRetrievalQueryWithHistory,
  buildVerifiedRefusal,
  classifyQueryIntent,
  classifyRefusalCategory,
  detectPromptInjection,
  extractCitations,
  retrieveKnowledgeRecords,
} from '../lib/rag';
import type { ChatErrorType, ChatMessage, RagCitation, RagTrace } from '../types/campus';

const CLIENT_TIMEOUT_MS = 12_000;

function formatFriendlyChatError(errorType: ChatErrorType, serverDetail?: string): string {
  switch (errorType) {
    case 'timeout':
      return `Request timed out after ${Math.round(CLIENT_TIMEOUT_MS / 1000)} seconds. Displayed grounded local knowledge-base results below so your chat stays usable.`;
    case 'quota':
      return 'Gemini API quota or rate limit was temporarily reached. Displayed grounded local knowledge-base results below — you can retry in a moment.';
    case 'missing-key':
      return 'Server-side Gemini API configuration is missing. Displayed grounded local knowledge-base results below with verified citations.';
    case 'auth':
      return 'Server-side AI API configuration is unavailable or unauthorized. Displayed grounded local knowledge-base results below.';
    case 'server':
      return serverDetail && /HTTP 5\d\d/i.test(serverDetail)
        ? `Server error (${serverDetail}). Displayed grounded local knowledge-base results below.`
        : 'Server 5xx error: The AI service hit a temporary issue. Displayed grounded local knowledge-base results below.';
    case 'malformed':
      return 'Empty or malformed response received from the AI service. Displayed grounded local knowledge-base results below.';
    case 'aborted':
      return 'Request cancelled. Your question and chat history were preserved — you can edit, ask another question, or retry.';
    case 'network':
    default:
      return 'Network error: Unable to reach the AI backend right now. Displayed grounded local knowledge-base results below.';
  }
}

/**
 * Clean lightweight inline markdown formatter (bold, italics, markdown links, bare URLs)
 * avoiding heavy external markdown dependencies and raw HTML injection.
 */
function renderFormattedLine(line: string, keyPrefix: string): React.ReactNode {
  const tokenRegex = /(\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\*\*[^*]+\*\*|\*[^*\n]+\*|https?:\/\/[^\s)]+)/g;
  const parts = line.split(tokenRegex);

  return parts.map((part, i) => {
    const mdLink = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (mdLink) {
      return (
        <a
          key={`${keyPrefix}-${i}`}
          href={mdLink[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200 font-medium break-words"
        >
          {mdLink[1]}
        </a>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={`${keyPrefix}-${i}`} className="italic text-slate-600 dark:text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (/^https?:\/\//.test(part)) {
      const cleaned = part.replace(/[.,;]+$/, '');
      const trailing = part.slice(cleaned.length);
      return (
        <React.Fragment key={`${keyPrefix}-${i}`}>
          <a
            href={cleaned}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200 break-all"
          >
            {cleaned}
          </a>
          {trailing}
        </React.Fragment>
      );
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });
}

const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
      {lines.map((raw, idx) => {
        const trimmed = raw.trim();
        if (!trimmed) return <div key={idx} className="h-1.5" />;
        if (/^[-*•]\s+/.test(trimmed)) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-blue-600 dark:text-teal-400 mt-1.5 text-[10px]" aria-hidden="true">
                ●
              </span>
              <span className="flex-1">{renderFormattedLine(trimmed.replace(/^[-*•]\s+/, ''), `b-${idx}`)}</span>
            </div>
          );
        }
        return <p key={idx}>{renderFormattedLine(trimmed, `p-${idx}`)}</p>;
      })}
    </div>
  );
};

const CitationCards: React.FC<{ citations: RagCitation[] }> = ({ citations }) => {
  if (citations.length === 0) return null;

  return (
    <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Sources &amp; Citations ({citations.length})
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {citations.map((cit, idx) => (
          <div
            key={`${cit.url}-${idx}`}
            className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between gap-2 ${
              cit.sourceType === 'demo'
                ? 'bg-amber-50/60 dark:bg-amber-950/25 border-amber-200 dark:border-amber-800/70'
                : 'bg-white dark:bg-[#0B172A] border-slate-200 dark:border-slate-700/80'
            }`}
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <SourceLabel type={cit.sourceType} compact />
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                  Last checked {cit.lastChecked}
                </span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white leading-snug break-words">
                {cit.title}
              </p>
              <a
                href={cit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-teal-300 truncate underline-offset-2 hover:underline"
                title={cit.url}
              >
                {cit.url}
              </a>
              {cit.freshnessStatus === 'session-sensitive' && (
                <div className="space-y-0.5">
                  <FreshnessBadge status="session-sensitive" />
                  {cit.freshnessNote && (
                    <p className="text-[10px] text-amber-800/90 dark:text-amber-300/90 leading-snug">
                      {cit.freshnessNote}
                    </p>
                  )}
                </div>
              )}
            </div>

            <a
              href={cit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-teal-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
            >
              <span>{cit.sourceType === 'official' ? 'Verify on official page' : 'Reference portal'}</span>
              <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const RagTracePanel: React.FC<{ trace: RagTrace }> = ({ trace }) => {
  const [open, setOpen] = useState(false);

  const pipelineLabel =
    trace.mode === 'gemini-rag'
      ? `Gemini RAG (${trace.model})`
      : trace.mode === 'verified-refusal'
      ? 'Verified Refusal Guardrail'
      : 'Local Knowledge-Base Fallback';

  return (
    <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 text-xs font-semibold text-blue-800 dark:text-teal-300 hover:text-blue-950 dark:hover:text-teal-200 py-1 cursor-pointer text-left"
      >
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Evidence used</span>
          <span className="font-normal text-slate-500 dark:text-slate-400 tabular-nums">
            · {trace.shortCircuited
              ? 'Short-circuited guardrail'
              : `${trace.retrieved.length} retrieved (${trace.usedOfficialCount} verified, ${trace.usedDemoCount} sample)`}
          </span>
        </span>
        {open ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>

      {open && (
        <div className="mt-2.5 space-y-3 text-xs bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-800 rounded-lg p-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pb-2.5 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Generation Pipeline</span>
              <span className="font-semibold text-slate-900 dark:text-white">{pipelineLabel}</span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                Keyword / BM25-style retrieval
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Detected Intent</span>
              <span className="font-mono font-medium text-slate-900 dark:text-slate-200">
                {trace.intent}
                {trace.refusalCategory ? ` (${trace.refusalCategory})` : ''}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Source Policy &amp; Guardrail</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {trace.hallucinationGuardTriggered
                  ? 'Refusal Guard Active'
                  : trace.usedOfficialCount > 0 && trace.usedDemoCount === 0
                  ? 'Verified Source Only'
                  : trace.usedOfficialCount > 0 && trace.usedDemoCount > 0
                  ? 'Verified + Prototype Sample'
                  : trace.usedDemoCount > 0
                  ? 'Prototype Sample Only'
                  : 'Conversational / General'}
              </span>
            </div>
          </div>

          {typeof trace.demoExcludedCount === 'number' && trace.demoExcludedCount > 0 && (
            <p className="text-[11px] text-teal-800 dark:text-teal-300">
              Excluded {trace.demoExcludedCount} Prototype sample record(s) before scoring because you did not explicitly ask for a sample or prototype guide.
            </p>
          )}

          {trace.fallbackReason && (
            <div className="flex items-start gap-2 p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Fallback Status:</strong> {trace.fallbackReason}. Returned grounded knowledge-base matches instead of inventing an AI answer.
              </span>
            </div>
          )}

          {trace.promptInjectionDetected && (
            <div className="flex items-start gap-2 p-2.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/70 text-red-900 dark:text-red-200">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Rule-override language detected in prompt. System grounding and source-classification rules remained locked.
              </span>
            </div>
          )}

          {trace.normalizedTokens.length > 0 && (
            <div className="space-y-0.5">
              {trace.effectiveRetrievalQuery && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Follow-up Context Query: </span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {trace.effectiveRetrievalQuery}
                  </span>
                </div>
              )}
              <div>
                <span className="text-slate-500 dark:text-slate-400">Search Tokens: </span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {trace.normalizedTokens.join(', ')}
                </span>
                {trace.expandedTerms.length > trace.normalizedTokens.length && (
                  <span className="text-slate-500 dark:text-slate-400">
                    {' '}
                    · Expanded: <span className="font-mono">{trace.expandedTerms.slice(0, 10).join(', ')}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {trace.retrieved.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 italic">
              {trace.shortCircuited
                ? 'Retrieval was short-circuited or rejected for low confidence so no unverified or prototype sample data could influence the answer.'
                : 'No campus knowledge records were needed for this conversational query.'}
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Matched Evidence Records (Ranked by Keyword Relevance &amp; Authority)
                </span>
                <span className="text-[11px] text-teal-800 dark:text-teal-300 font-medium tabular-nums">
                  Citations match only these {trace.retrieved.length} retrieved record(s)
                </span>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#0E1C32]">
                {(() => {
                  const maxScore = Math.max(...trace.retrieved.map((item) => item.score), 1);
                  return trace.retrieved.map((m) => {
                    const relPct = Math.max(15, Math.min(100, Math.round((m.score / maxScore) * 100)));
                    return (
                      <div key={m.record.id} className="p-2.5 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">{m.record.title}</span>
                          <div className="flex items-center gap-2">
                            <SourceLabel type={m.record.sourceType} compact />
                            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300 tabular-nums">
                              Relevance {relPct}% ({m.score.toFixed(2)})
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden" aria-hidden="true">
                          <div
                            className={`h-full rounded-full ${
                              m.record.sourceType === 'official'
                                ? 'bg-teal-600 dark:bg-teal-400'
                                : 'bg-amber-500 dark:bg-amber-400'
                            }`}
                            style={{ width: `${relPct}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {m.record.category}
                          {m.record.subcategory ? ` · ${m.record.subcategory}` : ''} · Type:{' '}
                          {m.record.sourceType === 'official' ? 'Official URL' : 'DEMO DATA — NOT OFFICIAL'} · {m.matchReason} · Last checked{' '}
                          {m.record.lastReviewedDate ?? m.record.lastChecked}
                        </p>
                        {m.record.freshnessStatus === 'session-sensitive' && (
                          <FreshnessBadge status="session-sensitive" />
                        )}
                        <a
                          href={m.record.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 dark:text-teal-300 hover:underline break-all"
                        >
                          <span>{m.record.sourceUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                        </a>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

export const AssistantPage: React.FC = () => {
  const {
    navigate,
    chatSessions,
    activeSession,
    selectSession,
    createNewSession,
    clearActiveSession,
    deleteSession,
    appendMessageToActive,
    setMessageFeedback,
    knowledgeBase,
    customDemoRecords,
    pendingPrompt,
    clearPendingPrompt,
    recordRecentQuestion,
    isPresentationMode,
    pushToast,
    systemStatus,
    reportAiMode,
  } = useCampus();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [lastErrorBanner, setLastErrorBanner] = useState<{
    message: string;
    retryQuery: string;
    retryAllowDemo?: boolean;
    errorType: ChatErrorType;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [promptFilter, setPromptFilter] = useState<string>('All');
  const [sideTab, setSideTab] = useState<'prompts' | 'history'>('prompts');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [serverHealth, setServerHealth] = useState<{ geminiConfigured: boolean; model: string } | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const pendingProcessedRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRequestIdRef = useRef<number>(0);
  const abortReasonRef = useRef<'user' | 'timeout' | null>(null);
  const lastQueryRef = useRef<string>('');

  const clearRequestTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const cancelInFlightRequest = useCallback(
    (silent = false) => {
      if (abortControllerRef.current) {
        abortReasonRef.current = 'user';
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      clearRequestTimers();
      activeRequestIdRef.current += 1;
      setIsLoading(false);
      setLoadingSeconds(0);
      if (!silent && lastQueryRef.current) {
        setLastErrorBanner({
          message: formatFriendlyChatError('aborted'),
          retryQuery: lastQueryRef.current,
          errorType: 'aborted',
        });
        pushToast('AI request cancelled — input unlocked.', 'info');
      }
    },
    [clearRequestTimers, pushToast]
  );

  // Clean up timers & abort pending fetch on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Detect offline/online browser status so users get instant local KB fallback when offline
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Elapsed timer while loading for transparent status feedback
  useEffect(() => {
    if (!isLoading) {
      setLoadingSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    setSpeechSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));

    const healthController = new AbortController();
    const healthTimer = setTimeout(() => healthController.abort(), 5000);
    fetch('/api/health', { signal: healthController.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setServerHealth({
            geminiConfigured: Boolean(d.geminiConfigured),
            model: d.model || 'gemini-3.1-flash-lite',
          });
        }
      })
      .catch(() => setServerHealth(null))
      .finally(() => clearTimeout(healthTimer));
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [activeSession.messages.length, isLoading]);

  /**
   * Builds a strictly grounded local Knowledge-Base fallback directly in the browser
   * if the Express backend is unreachable, times out, returns 5xx, or returns malformed JSON.
   */
  const sendMessage = async (
    textOverride?: string,
    options?: { isRetry?: boolean; allowDemo?: boolean }
  ) => {
    const query = (textOverride ?? input).trim();
    if (!query || isLoading) return;

    // Reset any stale abort state & start a tracked request
    clearRequestTimers();
    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;
    abortReasonRef.current = null;
    lastQueryRef.current = query;
    setLastErrorBanner(null);

    if (!textOverride) setInput('');
    recordRecentQuestion(query);

    const historyPayload = activeSession.messages
      .filter((m) => !m.isError && !m.id.startsWith('msg-welcome') && !m.id.startsWith('msg-greet'))
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    if (!options?.isRetry) {
      const userMsg: ChatMessage = {
        id: `msg-u-${Date.now()}`,
        role: 'user',
        content: query,
        timestamp: new Date().toISOString(),
      };
      appendMessageToActive(userMsg, query);
    }

    const matchedIds=new Set<string>();
    let content = answer(query, historyPayload, undefined, knowledgeBase, matchedIds);
    let answerPath='Campus handbook';
    if (content.startsWith('I don’t have that detail') && systemStatus.geminiConfigured && !isOffline) {
      setIsLoading(true);
      try {
        const res = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,history:historyPayload}),signal:AbortSignal.timeout(4000)});
        if(res.ok){ const result=await res.json(); if(typeof result.answer==='string'){content=result.answer;if(result.recordId){matchedIds.add(result.recordId);answerPath='Gemini-selected handbook record';}} }
      } catch { /* The local answer is ready. */ }
      finally { setIsLoading(false); }
      if(activeRequestIdRef.current!==requestId) return;
    }
    appendMessageToActive({id:crypto.randomUUID(), role:'assistant', timestamp:new Date().toISOString(), content, evidenceIds:[...matchedIds],answerPath});
  };

  // Auto-run pending prompt routed from Home, Facilities, or Presentation Demo Mode
  useEffect(() => {
    if (pendingPrompt && pendingProcessedRef.current !== pendingPrompt && !isLoading) {
      pendingProcessedRef.current = pendingPrompt;
      const toSend = pendingPrompt;
      clearPendingPrompt();
      void sendMessage(toSend);
      setTimeout(() => {
        pendingProcessedRef.current = null;
      }, 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt, isLoading]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      pushToast('Copied response to clipboard.', 'success');
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      pushToast('Clipboard access unavailable in this browser.', 'warning');
    }
  };

  const toggleVoiceInput = () => {
    if (!speechSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRec = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const rec = new SpeechRec();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (ev) => {
      const transcript = ev.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    rec.onerror = () => {
      setIsListening(false);
      pushToast('Voice capture unavailable or permission declined.', 'warning');
    };
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    setIsListening(true);
    rec.start();
  };

  const handleNewSession = () => {
    cancelInFlightRequest(true);
    clearPendingPrompt();
    pendingProcessedRef.current = null;
    setLastErrorBanner(null);
    setInput('');
    createNewSession();
  };

  const handleClearSession = () => {
    cancelInFlightRequest(true);
    clearPendingPrompt();
    pendingProcessedRef.current = null;
    setLastErrorBanner(null);
    clearActiveSession();
  };

  const handleSelectSession = (id: string) => {
    cancelInFlightRequest(true);
    clearPendingPrompt();
    pendingProcessedRef.current = null;
    setLastErrorBanner(null);
    selectSession(id);
  };

  const promptCategories = ['All',...new Set(SUGGESTED_TEST_PROMPTS.map(p=>p.category))];
  const visiblePrompts=SUGGESTED_TEST_PROMPTS.filter(p=>promptFilter==='All'||p.category===promptFilter);

  return (
    <div className="space-y-4">
      {/* Compact Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              AI Campus Helpdesk
            </h1>
          </div>
          <p className="text-sm text-slate-500">Ask about life at Cedarbrook Campus.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleNewSession}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>New Chat</span>
          </button>
          <button
            type="button"
            onClick={handleClearSession}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Offline Mode Banner */}
      {lastErrorBanner && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 text-xs sm:text-sm text-red-900 dark:text-red-200"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{lastErrorBanner.message}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                void sendMessage(lastErrorBanner.retryQuery, {
                  isRetry: true,
                  allowDemo: lastErrorBanner.retryAllowDemo,
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 rounded-lg whitespace-nowrap cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Retry Last Question</span>
            </button>
            <button
              type="button"
              onClick={() => setLastErrorBanner(null)}
              className="px-2.5 py-1.5 text-xs font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {isPresentationMode && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 font-medium">
          <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Isolated Presentation Demo Chat — messages here will not overwrite your regular conversation history.</span>
        </div>
      )}

      {/* Main Two-Column Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Sidebar: Test Prompts + History */}
        <aside
          className={`lg:col-span-4 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col ${
            lastErrorBanner || isOffline || isPresentationMode ? 'lg:max-h-[520px]' : 'lg:max-h-[590px]'
          }`}
        >
          <div className="flex items-center gap-1 p-1.5 bg-slate-100 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSideTab('prompts')}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                sideTab === 'prompts'
                  ? 'bg-white dark:bg-[#0E1C32] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Test Prompts ({SUGGESTED_TEST_PROMPTS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSideTab('history')}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                sideTab === 'history'
                  ? 'bg-white dark:bg-[#0E1C32] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" aria-hidden="true" />
              <span>History ({chatSessions.length})</span>
            </button>
          </div>

          {sideTab === 'prompts' ? (
            <div className="p-3 space-y-3 overflow-y-auto max-h-[300px] lg:max-h-[540px]">
              <div className="flex flex-wrap gap-1.5">
                {promptCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPromptFilter(cat)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      promptFilter === cat
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                {visiblePrompts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      void sendMessage(p.question, {
                        allowDemo: p.intentHint === 'Prototype Sample',
                      })
                    }
                    className="w-full text-left p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      {p.category}
                    </span>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-100 leading-snug block mt-0.5">
                      {p.question}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-2 overflow-y-auto max-h-[300px] lg:max-h-[540px]">
              {chatSessions.map((sess) => {
                const isActive = sess.id === activeSession.id;
                return (
                  <div
                    key={sess.id}
                    className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectSession(sess.id)}
                      className="text-left min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="block text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {sess.title}
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                        {sess.messages.length} messages
                      </span>
                    </button>
                    {!isPresentationMode && chatSessions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteSession(sess.id)}
                        aria-label={`Delete conversation ${sess.title}`}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        {/* Right Main Chat Container */}
        <section
          aria-label="Conversation Window"
          className={`lg:col-span-8 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col h-[540px] ${
            lastErrorBanner || isOffline || isPresentationMode ? 'lg:h-[520px]' : 'lg:h-[590px]'
          } overflow-hidden`}
        >
          {/* Scrollable Message List */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
            aria-live="polite"
            aria-relevant="additions"
          >
            {activeSession.messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <Database className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-3" aria-hidden="true" />
                <p className="font-display font-semibold text-base text-slate-900 dark:text-white">
                  Start a grounded campus conversation
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-1">
                  Ask about Cedarbrook Campus facilities, academics, clubs, transport, or click any test prompt on the left.
                </p>
              </div>
            )}
            {activeSession.messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[95%] sm:max-w-[88%] rounded-2xl px-4 py-3.5 ${
                      isUser
                        ? 'bg-blue-700 text-white rounded-br-sm'
                        : 'bg-slate-50 dark:bg-[#132542] border border-slate-200 dark:border-slate-700/80 rounded-bl-sm'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-[11px]">
                      <span className={isUser ? 'text-blue-100 font-medium' : 'text-slate-500 dark:text-slate-400 font-semibold'}>
                        {isUser ? 'You' : 'AI Campus Helpdesk'}
                      </span>
                      {!isUser && msg.ragTrace && (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-semibold border tabular-nums ${
                            msg.ragTrace.mode === 'gemini-rag'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
                              : msg.ragTrace.mode === 'verified-refusal'
                              ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800'
                              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {msg.ragTrace.mode === 'gemini-rag' ? (
                            <>
                              <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />
                              <span>Gemini RAG</span>
                              <span className="font-normal opacity-80">
                                ({msg.ragTrace.model}) · {(msg.ragTrace.latencyMs / 1000).toFixed(1)}s
                              </span>
                            </>
                          ) : msg.ragTrace.mode === 'verified-refusal' ? (
                            <>
                              <ShieldAlert className="w-3 h-3 shrink-0" aria-hidden="true" />
                              <span>Verified Refusal</span>
                              <span className="font-normal opacity-80">· {msg.ragTrace.latencyMs}ms</span>
                            </>
                          ) : (
                            <>
                              <Database className="w-3 h-3 shrink-0" aria-hidden="true" />
                              <span>KB Fallback</span>
                              <span className="font-normal opacity-80">
                                (Local Records) · {msg.ragTrace.latencyMs}ms
                              </span>
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    {!isUser && msg.ragTrace && msg.ragTrace.usedDemoCount > 0 && (
                      <div
                        role="note"
                        className="mb-2.5 flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-semibold"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>DEMO DATA — NOT OFFICIAL</span>
                        <span className="font-normal text-[11px] opacity-90">
                          · Includes illustrative prototype sample record(s) requested by your query.
                        </span>
                      </div>
                    )}

                    {isUser ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                    ) : (
                      <FormattedMessage content={msg.content} />
                    )}

                    {!isUser &&
                      (msg.content.includes('IT & Wi-Fi ticket') ||
                        msg.content.includes('GLA University Mathura')) && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/70 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                          {msg.content.includes('IT & Wi-Fi ticket') && (
                            <button
                              type="button"
                              className="font-medium text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200 cursor-pointer"
                              onClick={() => navigate('services')}
                            >
                              Raise a ticket
                            </button>
                          )}
                          {msg.content.includes('GLA University Mathura') && (
                            <>
                              <button
                                type="button"
                                className="font-medium text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200 cursor-pointer"
                                onClick={() => navigate('academics')}
                              >
                                Open Sample Fee Calculator
                              </button>
                              <a
                                href="https://www.gla.ac.in/mathura"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200"
                              >
                                <span>Official GLA University Fee Portal</span>
                                <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                              </a>
                              <a
                                href="https://www.gla.ac.in/contact-us"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200"
                              >
                                <span>Official GLA Hostel &amp; Admissions Desk</span>
                                <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                              </a>
                            </>
                          )}
                        </div>
                      )}

                    {Boolean(msg.evidenceIds?.length) && <details className="mt-2 text-xs text-slate-500"><summary className="cursor-pointer">How was this answer found?</summary><p>{msg.answerPath}</p>{msg.evidenceIds?.map(id=><p key={id}>{knowledgeBase.find(r=>r.id===id)?.title || id}</p>)}</details>}
                    {!isUser && msg.ragTrace && msg.ragTrace.citations.length > 0 && (
                      <CitationCards citations={msg.ragTrace.citations} />
                    )}

                    {/* Expandable RAG Trace Inspector */}
                    {!isUser && msg.ragTrace && <RagTracePanel trace={msg.ragTrace} />}

                    {/* Message Actions (Feedback, Retry on Fallback/Error, Copy) */}
                    {!isUser && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setMessageFeedback(msg.id, 'helpful')}
                            aria-label="Mark answer helpful"
                            aria-pressed={msg.feedback === 'helpful'}
                            className={`p-2 rounded-md transition-colors cursor-pointer ${
                              msg.feedback === 'helpful'
                                ? 'text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/40'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setMessageFeedback(msg.id, 'not-helpful')}
                            aria-label="Mark answer not helpful"
                            aria-pressed={msg.feedback === 'not-helpful'}
                            className={`p-2 rounded-md transition-colors cursor-pointer ${
                              msg.feedback === 'not-helpful'
                                ? 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>

                          {msg.retryQuery && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() =>
                                void sendMessage(msg.retryQuery, {
                                  isRetry: true,
                                  allowDemo: msg.retryAllowDemo ?? (msg.ragTrace?.usedDemoCount ? true : undefined),
                                })
                              }
                              className="inline-flex items-center gap-1 ml-1 px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 dark:text-teal-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-md disabled:opacity-50 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" aria-hidden="true" />
                              <span>Retry with AI</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => void handleCopy(msg.id, msg.content)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded-md cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggested Follow-Ups */}
                  {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[92%]">
                      {msg.suggestedFollowUps.map((fq) => (
                        <button
                          key={fq}
                          type="button"
                          disabled={isLoading}
                          onClick={() => void sendMessage(fq)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-[#0B172A] border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-teal-400 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50 cursor-pointer text-left"
                        >
                          {fq}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div
                className="flex items-start"
                role="status"
                aria-live="polite"
                aria-label="Assistant is retrieving knowledge records and generating response"
              >
                <div className="w-full max-w-[85%] bg-slate-50 dark:bg-[#132542] border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3.5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex gap-1" aria-hidden="true">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-teal-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-teal-400 animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-teal-400 animate-bounce [animation-delay:300ms]" />
                      </span>
                      <span className="font-medium">
                        Checking the campus handbook…
                        {loadingSeconds >= 2 ? ` (${loadingSeconds}s)` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => cancelInFlightRequest(false)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md cursor-pointer"
                    >
                      <Square className="w-3 h-3 fill-current" aria-hidden="true" />
                      <span>Cancel</span>
                    </button>
                  </div>
                  {/* Skeleton preview lines */}
                  <div className="space-y-2 animate-pulse" aria-hidden="true">
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-11/12" />
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-3/5" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
            className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0A1527]"
          >
            <label htmlFor="campus-chat-input" className="sr-only">
              Type your campus question
            </label>
            <div className="flex items-center gap-2">
              <input
                id="campus-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage();
                  }
                }}
                disabled={isLoading}
                placeholder="Ask about library, hostels, clubs, transport, fees, or RAG..."
                className="flex-1 min-w-0 px-4 py-2.5 text-sm bg-white dark:bg-[#0E1C32] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-teal-400 disabled:opacity-60"
              />

              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isLoading}
                  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                  className={`p-2.5 rounded-lg border transition-colors shrink-0 disabled:opacity-50 cursor-pointer ${
                    isListening
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white dark:bg-[#0E1C32] text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              {isLoading ? (
                <button
                  type="button"
                  onClick={() => cancelInFlightRequest(false)}
                  aria-label="Cancel generating response"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>Cancel</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
