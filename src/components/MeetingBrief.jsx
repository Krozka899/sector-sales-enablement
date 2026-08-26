import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Check,
  Compass,
  Copy,
  Download,
  MessageSquareText,
  RadioTower,
  RotateCcw,
  Target,
} from 'lucide-react'
import { formatMeetingBrief } from '../utils/meetingBrief'
import { trackEvent } from '../utils/analytics'
import { ANALYTICS_EVENTS } from '../utils/analyticsEvents'
import MeetingFeedback from './MeetingFeedback'
import { downloadTextFile } from '../utils/localFiles'

const briefSections = [
  { key: 'challenges', title: 'Likely Customer Challenges', icon: AlertTriangle, accent: 'bg-amber-50 text-amber-700' },
  { key: 'outcomes', title: 'Business Outcomes to Explore', icon: Target, accent: 'bg-emerald-50 text-emerald-700' },
  { key: 'capabilities', title: 'Relevant Vodafone Capability Areas', icon: RadioTower, accent: 'bg-red-50 text-[#e60000]' },
  { key: 'questions', title: 'Discovery Questions to Ask', icon: MessageSquareText, accent: 'bg-blue-50 text-blue-700' },
]

function MeetingBrief({ brief, headingRef, onReset }) {
  const [copyStatus, setCopyStatus] = useState('idle')
  const [exportStatus, setExportStatus] = useState('idle')
  const copyTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(formatMeetingBrief(brief))
      trackEvent(ANALYTICS_EVENTS.MEETING_BRIEF_COPIED, {
        sector: brief.sector.name,
        priority: brief.priority.analyticsValue,
        stage: brief.stage.analyticsValue,
      })
      setCopyStatus('copied')
    } catch {
      setCopyStatus('error')
    }

    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopyStatus('idle'), 2000)
  }

  const copyLabel = copyStatus === 'copied' ? 'Brief copied' : copyStatus === 'error' ? 'Try copy again' : 'Copy meeting brief'

  const exportBrief = () => {
    try {
      downloadTextFile('vodafone-meeting-brief.txt', formatMeetingBrief(brief))
      setExportStatus('exported')
      trackEvent(ANALYTICS_EVENTS.MEETING_BRIEF_EXPORTED, { sector: brief.sector.name, priority: brief.priority.analyticsValue, stage: brief.stage.analyticsValue })
    } catch {
      setExportStatus('error')
    }
  }

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
            onClick={exportBrief}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {exportStatus === 'exported' ? <Check size={17} aria-hidden="true" /> : <Download size={17} aria-hidden="true" />}
            {exportStatus === 'exported' ? 'Brief exported' : exportStatus === 'error' ? 'Try export again' : 'Export brief'}
          </button>
          <button
            type="button"
            onClick={copyBrief}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
          {exportStatus === 'exported' ? 'Meeting brief downloaded' : exportStatus === 'error' ? 'Meeting brief could not be downloaded' : copyStatus === 'copied' ? 'Meeting brief copied to clipboard' : copyStatus === 'error' ? 'Meeting brief could not be copied' : ''}
        </p>
      </div>

      <div className="p-5 sm:p-7 laptop:p-5 2xl:p-7">
        <dl className="grid gap-3 rounded-2xl border border-slate-200 bg-[#fafafa] p-4 sm:grid-cols-2 lg:grid-cols-3 laptop:p-3.5 2xl:p-4">
          {[
            ['Sector', brief.sector.name],
            ...(brief.navigatorReference ? [['Navigator reference', brief.navigatorReference]] : []),
            ['Primary priority', brief.priority.label],
            ['Conversation stage', brief.stage.label],
            ...(brief.journeyContext ? [
              ['Primary business situation', brief.journeyContext.primarySituation],
              ['Primary business outcome', brief.journeyContext.primaryOutcome ?? 'Not captured yet'],
              ['Transformation themes', brief.journeyContext.themes.join(', ') || 'Not captured yet'],
            ] : []),
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[11px] font-bold tracking-[0.13em] text-slate-400 uppercase">{label}</dt>
              <dd className="mt-1 text-sm font-bold text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 grid gap-3 lg:grid-cols-2 laptop:gap-2.5 2xl:gap-3">
          {briefSections.map(({ key, title, icon: Icon, accent }) => {
            const items = brief.journeyContext
              ? key === 'outcomes' ? brief.journeyContext.outcomes
                : key === 'capabilities' ? brief.journeyCapabilities
                  : key === 'questions' ? brief.journeyQuestions
                    : brief[key]
              : brief[key]

            return (
            <section key={key} className="rounded-2xl border border-slate-200 p-4 laptop:p-3.5 2xl:p-4">
              <div className="flex items-center gap-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${accent}`}>
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h4 className="text-sm font-bold text-[#1b1b1b]">{title}</h4>
              </div>
              <ol className="mt-3 space-y-2">
                {items.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                    <span className="mt-0.5 min-w-5 text-xs font-black text-slate-400">
                      {key === 'questions' ? `${index + 1}.` : '—'}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>
            )
          })}
        </div>

        {brief.vodafoneAngles?.length > 0 && (
          <section className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 laptop:p-3.5 2xl:p-4">
            <h4 className="text-sm font-bold text-[#1b1b1b]">Vodafone Angles to Consider</h4>
            <ul className="mt-3 grid gap-2 lg:grid-cols-2">
              {brief.vodafoneAngles.map((item) => <li key={item.label} className="text-sm leading-6 text-slate-700"><strong>{item.label}:</strong> {item.angle}</li>)}
            </ul>
          </section>
        )}

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

        {brief.presalesGuidance && (
          <section className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className={`rounded-2xl border p-4 ${brief.presalesGuidance.recommended ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
              <h4 className="text-sm font-bold text-[#1b1b1b]">Presales Engagement Guidance</h4>
              <p className="mt-2 text-sm font-bold text-[#d90000]">{brief.presalesGuidance.headline}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{brief.presalesGuidance.reasons[0]}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-sm font-bold text-[#1b1b1b]">Next Step</h4>
              <p className="mt-2 text-sm font-bold text-slate-800">{brief.nextStep}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">Use this as a structured enablement prompt; confirm the appropriate action with the opportunity team.</p>
            </div>
          </section>
        )}
        <MeetingFeedback brief={brief} />
      </div>
    </article>
  )
}

export default MeetingBrief
