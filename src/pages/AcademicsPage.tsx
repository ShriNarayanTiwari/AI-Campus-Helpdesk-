import React, { useState } from 'react';
import { Calculator, Calendar, Clock, ExternalLink } from 'lucide-react';
import { DEMO_TIMETABLE } from '../data/campusDirectory';
import { exams, fees, money, total } from '../data/cedar';

export function AcademicsPage() {
  const [p, setP] = useState<keyof typeof fees.tuition>('B.Tech');
  const [room, setRoom] = useState(0);
  const [meals, setMeals] = useState(false);

  const annualTuition = fees.tuition[p];
  const deposit = room ? fees.deposit : 0;
  const messFee = meals ? fees.mess : 0;
  const grandTotal = total(annualTuition, room, meals);

  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
          Academics &amp; Fee Estimator
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
          First-year tuition estimator, weekly B.Tech timetable, and examination reference schedule. Always confirm official fee circulars and dates on GLA University channels.
        </p>
      </div>

      {/* First-Year Fee Estimator */}
      <section
        aria-labelledby="fee-calc-heading"
        className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-blue-700 dark:text-teal-300 shrink-0" aria-hidden="true" />
            <h2 id="fee-calc-heading" className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
              First-Year Fee Estimator
            </h2>
          </div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 self-start sm:self-auto">
            Indicative reference — verify official GLA University fee circular
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="calc-programme" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Programme
            </label>
            <select
              id="calc-programme"
              value={p}
              onChange={(e) => setP(e.target.value as typeof p)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {Object.keys(fees.tuition).map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="calc-room" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Hostel Room Option
            </label>
            <select
              id="calc-room"
              value={room}
              onChange={(e) => setRoom(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-[#091426] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value={0}>Day Scholar (No Hostel)</option>
              <option value={fees.standard}>Double Non-AC ({money(fees.standard)}/year)</option>
              <option value={fees.ac}>Double AC ({money(fees.ac)}/year)</option>
            </select>
          </div>

          <label className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#091426] cursor-pointer text-sm text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={meals}
              onChange={(e) => setMeals(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            <span>Include optional mess ({money(fees.mess)}/year)</span>
          </label>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-800">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Tuition ({p})</span>
            <strong className="block text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
              {money(annualTuition)}/year
            </strong>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              {money(Math.round(annualTuition / 2))}/semester
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-800">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Hostel Room</span>
            <strong className="block text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
              {money(room)}/year
            </strong>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              {room ? `${money(Math.round(room / 2))}/semester` : 'Day scholar'}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#091426] border border-slate-200 dark:border-slate-800">
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Mess &amp; Deposit</span>
            <strong className="block text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
              {money(messFee + deposit)}
            </strong>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              Mess {money(messFee)} · Deposit {money(deposit)}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <span className="block text-[11px] font-semibold text-blue-800 dark:text-teal-300">Estimated Annual Total</span>
            <strong className="block text-lg font-extrabold text-blue-900 dark:text-white tabular-nums mt-0.5">
              {money(grandTotal)}/year
            </strong>
            <span className="block text-[11px] text-blue-700 dark:text-blue-300">
              Single/triple rooms not listed
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Single and triple room fees are not listed here. Please confirm official fee circulars before payment.
          </span>
          <a
            href="https://www.gla.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-teal-300 hover:underline whitespace-nowrap"
          >
            <span>Verify on Official GLA University Website</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* Weekly Timetable — Semantic HTML Table */}
      <section
        aria-labelledby="timetable-heading"
        className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-blue-700 dark:text-teal-300 shrink-0" aria-hidden="true" />
            <h2 id="timetable-heading" className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
              First-Year B.Tech Weekly Timetable
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Reference schedule · Verify your section timetable on GLAMS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#091426] border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Day</th>
                <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Time</th>
                <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Code</th>
                <th scope="col" className="px-4 py-3 font-semibold">Subject</th>
                <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Type</th>
                <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Room / Lab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DEMO_TIMETABLE.map((s) => (
                <tr
                  key={`${s.day}-${s.time}-${s.code}`}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    {s.day}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap tabular-nums">
                    {s.time}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-700 dark:text-teal-300 whitespace-nowrap">
                    {s.code}
                  </td>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">
                    {s.subject}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                        s.type === 'Lab'
                          ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300'
                          : s.type === 'Tutorial'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                          : 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200'
                      }`}
                    >
                      {s.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {s.room}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Semester 1 Examination Schedule */}
      <section
        aria-labelledby="exams-heading"
        className="bg-white dark:bg-[#0E1C32] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-blue-700 dark:text-teal-300 shrink-0" aria-hidden="true" />
            <h2 id="exams-heading" className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
              Semester 1 Examination Schedule
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Reference dates — verify official GLA University examination circulars
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#091426] border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Programme</th>
                <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Semester</th>
                <th scope="col" className="px-4 py-3 font-semibold">Subject</th>
                <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {exams.map((e) => (
                <tr
                  key={`${e.program}-${e.subject}`}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    {e.program}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap tabular-nums">
                    Semester {e.semester}
                  </td>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-100 font-medium">
                    {e.subject}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-700 dark:text-teal-300 whitespace-nowrap tabular-nums">
                    {e.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
