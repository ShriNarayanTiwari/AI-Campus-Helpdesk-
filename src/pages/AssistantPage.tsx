import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Square,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { SUGGESTED_QUESTIONS } from '../data/campusDirectory';
import { answer, isUnknownAnswer } from '../lib/campusAnswer';
import type { ChatMessage } from '../types/campus';

/**
 * Clean inline formatter (bold, italics, markdown links, bare URLs)
 * without raw HTML injection.
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

function isMarkdownTableRow(line: string): boolean {
  const t = line.trim();
  return t.startsWith('|') && t.endsWith('|') && t.split('|').length >= 3;
}

function isMarkdownTableSeparator(line: string): boolean {
  const t = line.trim();
  return /^\|(?:\s*:?-+:?\s*\|)+$/.test(t);
}

function parseTableCells(line: string): string[] {
  return line
    .trim()
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());
}

const FormattedMessage: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();

    // Compact Markdown Table renderer
    if (
      isMarkdownTableRow(trimmed) &&
      i + 1 < lines.length &&
      isMarkdownTableSeparator(lines[i + 1])
    ) {
      const headers = parseTableCells(trimmed);
      const rows: string[][] = [];
      let j = i + 2;
      while (j < lines.length && isMarkdownTableRow(lines[j])) {
        rows.push(parseTableCells(lines[j]));
        j += 1;
      }

      blocks.push(
        <div
          key={`tbl-${i}`}
          className="my-2 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B172A]"
        >
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                {headers.map((h, hIdx) => (
                  <th
                    key={hIdx}
                    scope="col"
                    className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-3 py-2 whitespace-nowrap tabular-nums ${
                        cIdx === 0
                          ? 'font-semibold text-slate-900 dark:text-white'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {renderFormattedLine(cell, `td-${i}-${rIdx}-${cIdx}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      i = j;
      continue;
    }

    if (!trimmed) {
      blocks.push(<div key={`sp-${i}`} className="h-1.5" />);
      i += 1;
      continue;
    }

    if (/^[-*•]\s+/.test(trimmed)) {
      blocks.push(
        <div key={`b-${i}`} className="flex items-start gap-2 pl-1">
          <span className="text-blue-600 dark:text-teal-400 mt-1.5 text-[10px]" aria-hidden="true">
            ●
          </span>
          <span className="flex-1">
            {renderFormattedLine(trimmed.replace(/^[-*•]\s+/, ''), `b-${i}`)}
          </span>
        </div>
      );
      i += 1;
      continue;
    }

    blocks.push(<p key={`p-${i}`}>{renderFormattedLine(trimmed, `p-${i}`)}</p>);
    i += 1;
  }

  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
      {blocks}
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
    activeSession,
    clearActiveSession,
    appendMessageToActive,
    setMessageFeedback,
    knowledgeBase,
    pendingPrompt,
    clearPendingPrompt,
    pushToast,
    systemStatus,
  } = useCampus();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const pendingProcessedRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const activeRequestIdRef = useRef<number>(0);

  const cancelInFlightRequest = useCallback(
    (silent = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      activeRequestIdRef.current += 1;
      setIsLoading(false);
      setLoadingSeconds(0);
      if (!silent) {
        pushToast('Request cancelled.', 'info');
      }
    },
    [pushToast]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [activeSession.messages.length, isLoading]);

  const sendMessage = async (textOverride?: string) => {
    const query = (textOverride ?? input).trim();
    if (!query || isLoading) return;

    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;

    if (!textOverride) setInput('');

    const historyPayload = activeSession.messages
      .filter((m) => !m.isError && !m.id.startsWith('msg-welcome') && !m.id.startsWith('msg-greet'))
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };
    appendMessageToActive(userMsg, query);

    const matchedIds = new Set<string>();
    let content = answer(query, historyPayload, undefined, knowledgeBase, matchedIds);

    if (
      content.startsWith('I don’t have that detail') &&
      systemStatus.geminiConfigured &&
      !isOffline
    ) {
      setIsLoading(true);
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const timer = setTimeout(() => controller.abort(), 4000);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, history: historyPayload }),
          signal: controller.signal,
        });
        if (res.ok) {
          const result = await res.json();
          if (typeof result.answer === 'string' && result.answer.trim()) {
            content = result.answer;
            if (result.recordId) {
              matchedIds.add(result.recordId);
            }
          }
        }
      } catch {
        // Keep structured campus answer on network timeout/error
      } finally {
        clearTimeout(timer);
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
        setIsLoading(false);
      }
      if (activeRequestIdRef.current !== requestId) return;
    }

    appendMessageToActive({
      id: `msg-a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      content,
      evidenceIds: [...matchedIds],
      suggestedFollowUps: isUnknownAnswer(content)
        ? SUGGESTED_QUESTIONS.map((s) => s.question)
        : undefined,
    });
  };

  // Auto-run pending prompt routed from Home, Facilities, or Global Search
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

  const handleClearSession = () => {
    cancelInFlightRequest(true);
    clearPendingPrompt();
    pendingProcessedRef.current = null;
    clearActiveSession();
  };

  return (
    <div className="space-y-4">
      {/* Compact Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            Campus Assist
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Student Information Hub · Designed for GLA University students
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span
            role="status"
            className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg whitespace-nowrap"
          >
            Information service ready
          </span>
          <button
            type="button"
            onClick={handleClearSession}
            aria-label="Clear current chat conversation"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Sidebar: Suggested Questions */}
        <aside
          aria-label="Suggested questions"
          className="lg:col-span-4 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col"
        >
          <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-display font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0F766E] dark:text-teal-300" aria-hidden="true" />
              <span>Suggested questions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose a topic to start a conversation.
            </p>
          </div>

          <div className="p-3 space-y-2">
            {SUGGESTED_QUESTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={isLoading}
                onClick={() => void sendMessage(item.question)}
                className="w-full text-left p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                  {item.label}
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {item.question}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Right Main Chat Container */}
        <section
          aria-label="Conversation Window"
          className="lg:col-span-8 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col h-[540px] lg:h-[600px] overflow-hidden"
        >
          {/* Scrollable Message List */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
            aria-live="polite"
            aria-relevant="additions"
          >
            {activeSession.messages.map((msg) => {
              const isUser = msg.role === 'user';
              const unknownReply = !isUser && isUnknownAnswer(msg.content);

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[96%] sm:max-w-[90%] rounded-2xl px-4 py-3.5 ${
                      isUser
                        ? 'bg-blue-700 text-white rounded-br-sm'
                        : 'bg-slate-50 dark:bg-[#132542] border border-slate-200 dark:border-slate-700/80 rounded-bl-sm'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-[11px]">
                      <span
                        className={
                          isUser
                            ? 'text-blue-100 font-medium'
                            : 'text-slate-500 dark:text-slate-400 font-semibold'
                        }
                      >
                        {isUser ? 'You' : 'Campus Assist'}
                      </span>
                    </div>

                    {isUser ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    ) : (
                      <FormattedMessage content={msg.content} />
                    )}

                    {/* Clickable Suggested Questions for Unknown / Gibberish Queries */}
                    {unknownReply && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70 space-y-2">
                        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                          Suggested Questions
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {SUGGESTED_QUESTIONS.map((item) => (
                            <button
                              key={`${msg.id}-${item.id}`}
                              type="button"
                              disabled={isLoading}
                              onClick={() => void sendMessage(item.question)}
                              className="px-2.5 py-1.5 text-xs font-medium text-blue-800 dark:text-teal-200 bg-white dark:bg-[#0B172A] border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-teal-400 rounded-lg transition-colors cursor-pointer"
                            >
                              {item.question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contextual Action Links — Strictly AFTER the Answer (Never on Unknown Replies) */}
                    {!isUser && !unknownReply && !msg.id.startsWith('msg-greet') && (() => {
                      const lower = msg.content.toLowerCase();
                      const evidence = msg.evidenceIds ?? [];

                      const isHostelGuidance =
                        evidence.includes('hostel-guidance') ||
                        lower.includes('hostel facilities and general guidance');

                      const showFeeLinks =
                        !isHostelGuidance &&
                        (lower.includes('indicative tuition fee overview') ||
                          lower.includes('fee structure breakdown') ||
                          lower.includes('tuition fee') ||
                          lower.includes('hostel & room type fee') ||
                          evidence.some((id) => id.startsWith('tuition-') || id === 'rooms'));

                      const showSupport =
                        !isHostelGuidance &&
                        (evidence.some((id) =>
                          ['services', 'wifi', 'id-card', 'repair', 'care'].includes(id)
                        ) ||
                          lower.includes('open student services') ||
                          lower.includes('support request'));

                      const showEvents =
                        evidence.includes('events-notices') ||
                        lower.includes('upcoming information');

                      const showClubs =
                        evidence.includes('clubs') ||
                        lower.includes('student activities');

                      const showFacilities =
                        isHostelGuidance ||
                        evidence.some((id) =>
                          [
                            'library',
                            'hours-weekdays',
                            'hours-Saturday',
                            'hours-Sunday',
                            'travel',
                            'fac',
                            'health',
                            'sports',
                            'labs',
                            'hostel',
                          ].includes(id)
                        );

                      const showOfficialHostel = isHostelGuidance;

                      const showOfficialWebsite =
                        !isHostelGuidance &&
                        (lower.includes('glams') ||
                          lower.includes('official gla') ||
                          lower.includes('official university communication channels') ||
                          showFeeLinks);

                      if (
                        !showSupport &&
                        !showFeeLinks &&
                        !showEvents &&
                        !showClubs &&
                        !showFacilities &&
                        !showOfficialHostel &&
                        !showOfficialWebsite
                      ) {
                        return null;
                      }

                      return (
                        <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                          {showFeeLinks && (
                            <button
                              type="button"
                              className="font-semibold text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200 cursor-pointer"
                              onClick={() => navigate('academics')}
                            >
                              Open Fee Estimator
                            </button>
                          )}
                          {showFacilities && (
                            <button
                              type="button"
                              className="font-semibold text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200 cursor-pointer"
                              onClick={() => navigate('facilities')}
                            >
                              Open Campus Facilities
                            </button>
                          )}
                          {showOfficialHostel && (
                            <a
                              href="https://www.gla.ac.in/campus-life/hostel-facility"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200"
                            >
                              <span>Official GLA Hostel Information</span>
                              <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                            </a>
                          )}
                          {showSupport && (
                            <button
                              type="button"
                              className="font-semibold text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200 cursor-pointer"
                              onClick={() => navigate('services')}
                            >
                              Request Support
                            </button>
                          )}
                          {showClubs && (
                            <button
                              type="button"
                              className="font-semibold text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200 cursor-pointer"
                              onClick={() => navigate('clubs')}
                            >
                              Explore Student Activities
                            </button>
                          )}
                          {showEvents && (
                            <button
                              type="button"
                              className="font-semibold text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200 cursor-pointer"
                              onClick={() => navigate('events')}
                            >
                              Open Activities &amp; Notices
                            </button>
                          )}
                          {showOfficialWebsite && (
                            <a
                              href="https://www.gla.ac.in"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-teal-300 underline underline-offset-2 hover:text-blue-900 dark:hover:text-teal-200"
                            >
                              <span>Official GLA University Website</span>
                              <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      );
                    })()}

                    {/* Expandable Sources Referenced — Strictly AFTER the Answer */}
                    {Boolean(msg.evidenceIds?.length) && (
                      <details className="mt-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/70 text-xs text-slate-600 dark:text-slate-300">
                        <summary className="cursor-pointer font-semibold text-blue-800 dark:text-teal-300 hover:underline select-none">
                          Sources referenced ({msg.evidenceIds?.length}{' '}
                          {msg.evidenceIds?.length === 1 ? 'guide' : 'guides'})
                        </summary>
                        <div className="mt-2 rounded-lg bg-white dark:bg-[#091426] border border-slate-200 dark:border-slate-800 p-2.5">
                          <ul className="space-y-1">
                            {msg.evidenceIds?.map((id) => {
                              const rec = knowledgeBase.find((r) => r.id === id);
                              return (
                                <li
                                  key={id}
                                  className="flex flex-wrap items-center justify-between gap-2 text-xs"
                                >
                                  <span className="font-semibold text-slate-900 dark:text-white">
                                    {rec ? rec.title : id}
                                  </span>
                                  {rec && (
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                      {rec.category}
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </details>
                    )}

                    {/* Message Actions (Feedback, Copy) */}
                    {!isUser && !msg.id.startsWith('msg-greet') && (
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
                </div>
              );
            })}

            {isLoading && (
              <div
                className="flex items-start"
                role="status"
                aria-live="polite"
                aria-label="Finding campus information"
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
                        Finding campus information…
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
                placeholder="Ask about campus services, academics, facilities, or activities..."
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
