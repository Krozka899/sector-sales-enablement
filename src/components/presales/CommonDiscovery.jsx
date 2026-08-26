import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useJourney } from '../../context/useJourney'
import { commonDiscoverySections } from '../../data/presalesDiscovery'
import { trackEvent } from '../../utils/analytics'
import { ANALYTICS_EVENTS } from '../../utils/analyticsEvents'
import { DiscoveryField, StatusChip } from './DiscoveryControls'

function CommonDiscovery({ selectedSectionId, onSelectSection }) {
  const { state, setTechnicalValue, toggleTechnicalValue } = useJourney()
  const [internalSectionId, setInternalSectionId] = useState('current_environment')
  const startedRef = useRef(false)
  const completedRef = useRef(new Set())

  const activeSectionId = selectedSectionId ?? internalSectionId
  const activeIndex = Math.max(0, commonDiscoverySections.findIndex((section) => section.id === activeSectionId))
  const section = commonDiscoverySections[activeIndex]
  const answers = state.technicalDiscovery.common[section.id] ?? {}
  const status = Object.hasOwn(answers, 'discovery_status') ? answers.discovery_status : 'not_started'
  const selectSection = (sectionId) => {
    if (onSelectSection) onSelectSection(sectionId)
    else setInternalSectionId(sectionId)
    if (!startedRef.current) {
      startedRef.current = true
      trackEvent(ANALYTICS_EVENTS.TECHNICAL_DISCOVERY_STARTED)
    }
  }

  const setValue = (sectionId, fieldId, value) => {
    if (!startedRef.current) {
      startedRef.current = true
      trackEvent(ANALYTICS_EVENTS.TECHNICAL_DISCOVERY_STARTED)
    }
    setTechnicalValue('common', sectionId, fieldId, value)
    if (fieldId === 'discovery_status' && ['understood', 'not_applicable'].includes(value) && !completedRef.current.has(sectionId)) {
      completedRef.current.add(sectionId)
      trackEvent(ANALYTICS_EVENTS.TECHNICAL_DISCOVERY_SECTION_COMPLETED, { section: sectionId })
    }
  }

  return (
    <div>
      <div className="mb-4"><h3 className="text-base font-bold text-slate-900">Common technical discovery</h3><p className="mt-1 text-sm leading-6 text-slate-600">Validate capability-independent environment, resilience, security, cloud, operations and change context. Unknown and not applicable are valid statuses.</p></div>
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4" aria-labelledby={`common-${section.id}`}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">Area {activeIndex + 1} of {commonDiscoverySections.length}</p><h4 id={`common-${section.id}`} className="mt-1 text-sm font-bold text-slate-900">{section.label}</h4></div><StatusChip status={status} /></div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">{section.fields.map((field) => <DiscoveryField key={field.id} field={field} guidanceId={`common.${section.id}.${field.id}`} value={answers[field.id]} onSet={(fieldId, value) => setValue(section.id, fieldId, value)} onToggle={(fieldId, value) => toggleTechnicalValue('common', section.id, fieldId, value)} />)}</div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3"><button type="button" disabled={activeIndex === 0} onClick={() => selectSection(commonDiscoverySections[activeIndex - 1].id)} className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-xs font-bold text-slate-600 disabled:opacity-40"><ArrowLeft size={14} aria-hidden="true" /> Previous area</button><button type="button" disabled={activeIndex === commonDiscoverySections.length - 1} onClick={() => selectSection(commonDiscoverySections[activeIndex + 1].id)} className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-xs font-bold text-[#d90000] disabled:opacity-40">Next area <ArrowRight size={14} aria-hidden="true" /></button></div>
      </section>
    </div>
  )
}

export default CommonDiscovery
