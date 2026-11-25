import React, { useState } from 'react';
import {
  CheckCircle2,
  Send,
  Ticket,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import type { HelpdeskTicket } from '../types/campus';

const TICKET_CATEGORIES: HelpdeskTicket['category'][] = [
  'Hostel & Mess',
  'Transport',
  'Academics & Campus Desk',
  'Library',
  'Student Welfare',
  'IT & Wi-Fi',
  'General',
];

const TICKET_STATUSES: HelpdeskTicket['status'][] = [
  'Submitted',
  'In Review',
  'Resolved',
];

export const StudentServicesPage: React.FC = () => {
  const { tickets, createDemoTicket, updateDemoTicketStatus } = useCampus();

  const [studentName, setStudentName] = useState('');
  const [category, setCategory] = useState<HelpdeskTicket['category']>('Academics & Campus Desk');
  const [priority, setPriority] = useState<HelpdeskTicket['priority']>('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim().length < 2) {
      setFormError('Please enter your name (at least 2 characters).');
      return;
    }
    if (subject.trim().length < 5) {
      setFormError('Please enter a short subject (at least 5 characters).');
      return;
    }
    if (description.trim().length < 10) {
      setFormError('Please describe your request in at least 10 characters.');
      return;
    }

    const created = createDemoTicket({
      studentName: studentName.trim(),
      category,
      priority,
      subject: subject.trim(),
      description: description.trim(),
    });
    setCreatedTicketId(created.id);
    setStudentName('');
    setSubject('');
    setDescription('');
    setFormError('');
  };

  const visibleTickets = tickets.filter(
    (t) => statusFilter === 'All' || t.status === statusFilter
  );

  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Student Services &amp; Support
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          Submit a support request for Wi-Fi, ID cards, hostel maintenance, or general campus assistance.
        </p>
      </div>

      <section
        aria-labelledby="support-request-heading"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        {/* Request Support Form */}
        <form
          onSubmit={handleSubmitTicket}
          className="lg:col-span-5 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4"
        >
          <div className="space-y-1">
            <h2 id="support-request-heading" className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Request Support
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share the details of your question or campus issue below.
            </p>
          </div>

          {createdTicketId && (
            <div
              role="status"
              className="flex items-start gap-2 p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Support request <strong className="font-mono">{createdTicketId}</strong> has been created. You can review or update its status in the list.
              </span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label htmlFor="ticket-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Name *
              </label>
              <input
                id="ticket-name"
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g., Rohan Verma"
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label htmlFor="ticket-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department / Category
                </label>
                <select
                  id="ticket-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HelpdeskTicket['category'])}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {TICKET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ticket-priority" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  id="ticket-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as HelpdeskTicket['priority'])}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="ticket-subject" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject *
              </label>
              <input
                id="ticket-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Library card replacement inquiry"
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="ticket-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description *
              </label>
              <textarea
                id="ticket-desc"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your support request..."
                className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            {formError && <p className="text-xs font-medium text-red-600 dark:text-red-400">{formError}</p>}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>Submit Request</span>
          </button>
        </form>

        {/* Support Requests List */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-700 dark:text-teal-300" aria-hidden="true" />
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white tabular-nums">
                Support Requests ({visibleTickets.length})
              </h2>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              {['All', ...TICKET_STATUSES].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
                    statusFilter === st
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {visibleTickets.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {tickets.length === 0 && statusFilter === 'All'
                    ? 'No support requests created yet.'
                    : 'No requests match this status filter.'}
                </p>
                {tickets.length === 0 && statusFilter === 'All' ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Use the Request Support form to log a campus request and track its status here.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStatusFilter('All')}
                    className="text-xs font-semibold text-blue-700 dark:text-teal-300 hover:underline cursor-pointer"
                  >
                    Show all requests
                  </button>
                )}
              </div>
            ) : (
              visibleTickets.map((tkt) => (
                <div key={tkt.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-blue-800 dark:text-teal-300 tabular-nums">
                        {tkt.id}
                      </span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-slate-600 dark:text-slate-400">{tkt.category}</span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                      <span
                        className={`font-semibold ${
                          tkt.priority === 'High'
                            ? 'text-red-600 dark:text-red-400'
                            : tkt.priority === 'Medium'
                            ? 'text-amber-700 dark:text-amber-300'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {tkt.priority} Priority
                      </span>
                    </div>

                    <label className="inline-flex items-center gap-1.5 text-xs">
                      <span className="sr-only">Update status for {tkt.id}</span>
                      <select
                        aria-label={`Status for ${tkt.id}`}
                        value={tkt.status}
                        onChange={(e) =>
                          updateDemoTicketStatus(tkt.id, e.target.value as HelpdeskTicket['status'])
                        }
                        className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 cursor-pointer"
                      >
                        {TICKET_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{tkt.subject}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{tkt.description}</p>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Submitted by {tkt.studentName}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
