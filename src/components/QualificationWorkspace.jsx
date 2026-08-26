import { useEffect, useRef } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useJourney } from '../context/useJourney'
import { qualificationSections } from '../data/qualificationModel'
import { getQuestionGuidance } from '../data/questionGuidance'
import { trackEvent } from '../utils/analytics'
import { ANALYTICS_EVENTS } from '../utils/analyticsEvents'
import QuestionHelp from './QuestionHelp'
import { ContinueButton } from './journey/JourneyControls'

const statusPresentation = {
  complete: { label: 'Strongly understood', className: 'bg-emerald-50 text-emerald-700' },
  partial: { label: 'Partially understood', className: 'bg-amber-50 text-amber-700' },
  gap: { label: 'Gap identified', className: 'bg-red-50 text-red-700' },
  not_started: { label: 'Not started', className: 'bg-slate-100 text-slate-500' },
}

function QualificationField({ sectionId, field, value, setValue, toggleValue }) {
  const selectedValues = Array.isArray(value) ? value : []
  const guidance = getQuestionGuidance(`qualification.${sectionId}.${field.id}`, field.id)
  return (
    <fieldset className="rounded-xl border border-slate-200 bg-white p-3">
      <legend className="px-1 text-xs font-bold text-slate-800">{field.label} <QuestionHelp guidance={guidance} label={`${field.label} guidance`} /></legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {field.options.map((option) => {
          const selected = field.type === 'multi' ? selectedValues.includes(option.id) : value === option.id
          return <button key={option.id} type="button" aria-pressed={selected} onClick={() => field.type === 'multi' ? toggleValue(sectionId, field.id, option.id) : setValue(sectionId, field.id, option.id)} className={`min-h-9 rounded-lg border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${selected ? 'border-[#e60000] bg-red-50 text-slate-900' : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'}`}>{option.label}</button>
        })}
      </div>
    </fieldset>
  )
}

function QualificationWorkspace({ activeSectionId = 'business', onSectionChange, onBack, onContinue }) {
  const { state, qualificationSummary, setQualificationValue, toggleQualificationValue } = useJourney()
  const startedRef = useRef(false)
  const completedSectionsRef = useRef(new Set())
  const completedRef = useRef(false)
  const activeIndex = Math.max(0, qualificationSections.findIndex((section) => section.id === activeSectionId))
  const section = qualificationSections[activeIndex]
  const summary = qualificationSummary.sections.find((item) => item.id === section.id)
  const presentation = statusPresentation[summary.status]

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true
      trackEvent(ANALYTICS_EVENTS.QUALIFICATION_STARTED)
    }
  }, [])

  useEffect(() => {
    qualificationSummary.sections.forEach((item) => {
      if (item.status !== 'complete' || completedSectionsRef.current.has(item.id)) return
      completedSectionsRef.current.add(item.id)
      trackEvent(ANALYTICS_EVENTS.QUALIFICATION_SECTION_COMPLETED, { section: item.id })
    })
    if (qualificationSummary.status === 'ready' && !completedRef.current) {
      completedRef.current = true
      trackEvent(ANALYTICS_EVENTS.QUALIFICATION_COMPLETED)
    }
  }, [qualificationSummary])

  return (
    <div>
      <section className={`rounded-2xl border p-4 ${qualificationSummary.status === 'ready' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`} aria-labelledby="qualification-summary-title">
        <div className="flex items-start gap-3">{qualificationSummary.status === 'ready' ? <CheckCircle2 className="text-emerald-700" size={22} aria-hidden="true" /> : <AlertCircle className="text-amber-700" size={22} aria-hidden="true" />}<div><h4 id="qualification-summary-title" className="text-sm font-bold text-slate-900 uppercase">{qualificationSummary.label}</h4><p className="mt-1 text-xs leading-5 text-slate-600">{qualificationSummary.completeCount} of {qualificationSummary.sections.length} categories strongly understood. Explicit Unknown answers count as addressed and remain useful handover context.</p></div></div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4" aria-labelledby={`qualification-${section.id}`}>
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">Category {activeIndex + 1} of {qualificationSections.length}</p><h4 id={`qualification-${section.id}`} className="mt-1 text-base font-bold text-slate-900">{section.label}</h4><p className="mt-1 text-xs text-slate-500">{section.description}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${presentation.className}`}>{presentation.label}</span></div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">{section.fields.map((field) => <QualificationField key={field.id} sectionId={section.id} field={field} value={state.qualification[section.id]?.[field.id]} setValue={setQualificationValue} toggleValue={toggleQualificationValue} />)}</div>
      </section>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <button type="button" onClick={() => activeIndex === 0 ? onBack() : onSectionChange(qualificationSections[activeIndex - 1].id)} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><ArrowLeft size={16} aria-hidden="true" /> Back</button>
        {activeIndex < qualificationSections.length - 1 ? <ContinueButton onClick={() => onSectionChange(qualificationSections[activeIndex + 1].id)}>Next category <ArrowRight size={16} aria-hidden="true" /></ContinueButton> : <ContinueButton onClick={onContinue}>Review Presales handover <ArrowRight size={16} aria-hidden="true" /></ContinueButton>}
      </div>
    </div>
  )
}

export default QualificationWorkspace
