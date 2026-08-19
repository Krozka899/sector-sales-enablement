import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Check,
  Compass,
  Copy,
  MessageSquareText,
  RadioTower,
  RotateCcw,
  Target,
} from 'lucide-react'
import { formatMeetingBrief } from '../utils/meetingBrief'

const briefSections = [
  { key: 'challenges', title: 'Likely Customer Challenges', icon: AlertTriangle, accent: 'bg-amber-50 text-amber-700' },
  { key: 'outcomes', title: 'Business Outcomes to Explore', icon: Target, accent: 'bg-emerald-50 text-emerald-700' },
  { key: 'capabilities', title: 'Vodafone Angles to Consider', icon: RadioTower, accent: 'bg-red-50 text-[#e60000]' },
  { key: 'questions', title: 'Discovery Questions to Ask', icon: MessageSquareText, accent: 'bg-blue-50 text-blue-700' },
]

function MeetingBrief({ brief, headingRef, onReset }) {
  const [copyStatus, setCopyStatus] = useState('idle')
  const copyTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(formatMeetingBrief(brief))
      setCopyStatus('copied')
    } catch {
      setCopyStatus('error')
    }

    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopyStatus('idle'), 2000)
  }

  const copyLabel = copyStatus === 'copied' ? 'Brief copied' : copyStatus === 'error' ? 'Try copy again' : 'Copy meeting brief'

  return (
    <article className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)] laptop:mt-6">
      <div className="border-b border-slate-200 bg-slate-900 px-5 py-6 text-white sm:px-7 laptop:flex laptop:items-center laptop:justify-between laptop:gap-6 laptop:py-5">
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-red-300 uppercase">Your meeting brief</p>
          <h3 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-bold tracking-[-0.03em] outline-none">
            {brief.sector.name}
          </h3>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row laptop:mt-0">
          <button
            type="button"
            onClick={copyBrief}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {copyStatus === 'copied' ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
            {copyLabel}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <RotateCcw size={16} aria-hidden="true" />
            Start again
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {copyStatus === 'copied' ? 'Meeting brief copied to clipboard' : copyStatus === 'error' ? 'Meeting brief could not be copied' : ''}
        </p>
      </div>

      <div className="p-5 sm:p-7 laptop:p-5 2xl:p-7">
        <dl className="grid gap-3 rounded-2xl border border-slate-200 bg-[#fafafa] p-4 sm:grid-cols-3 laptop:p-3.5 2xl:p-4">
          {[
            ['Sector', brief.sector.name],
            ['Primary priority', brief.priority.label],
            ['Conversation stage', brief.stage.label],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[11px] font-bold tracking-[0.13em] text-slate-400 uppercase">{label}</dt>
              <dd className="mt-1 text-sm font-bold text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 grid gap-3 lg:grid-cols-2 laptop:gap-2.5 2xl:gap-3">
          {briefSections.map(({ key, title, icon: Icon, accent }) => (
            <section key={key} className="rounded-2xl border border-slate-200 p-4 laptop:p-3.5 2xl:p-4">
              <div className="flex items-center gap-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${accent}`}>
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h4 className="text-sm font-bold text-[#1b1b1b]">{title}</h4>
              </div>
              <ol className="mt-3 space-y-2">
                {brief[key].map((item, index) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                    <span className="mt-0.5 min-w-5 text-xs font-black text-slate-400">
                      {key === 'questions' ? `${index + 1}.` : '—'}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <section className="mt-3 rounded-2xl border-l-4 border-[#e60000] bg-red-50 p-4 laptop:p-3.5 2xl:p-4">
          <div className="flex items-start gap-3">
            <Compass className="mt-0.5 shrink-0 text-[#e60000]" size={20} aria-hidden="true" />
            <div>
              <h4 className="text-sm font-bold text-[#1b1b1b]">Conversation Stage Guidance</h4>
              <p className="mt-1 text-sm leading-6 font-semibold text-slate-800">{brief.stage.guidance}</p>
              <ul className="mt-2 flex flex-col gap-1 text-sm leading-6 text-slate-700 laptop:flex-row laptop:flex-wrap laptop:gap-x-6">
                {brief.stage.behaviours.map((behaviour) => (
                  <li key={behaviour} className="flex items-start gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#e60000]" />
                    {behaviour}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}

export default MeetingBrief
