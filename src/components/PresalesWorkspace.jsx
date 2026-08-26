import { useRef } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, CircleDashed } from 'lucide-react'
import { useJourney } from '../context/useJourney'
import { usePresalesSummary } from '../context/usePresalesSummary'
import { useReadiness } from '../context/useReadiness'
import { qualificationSections } from '../data/qualificationModel'
import { createPresalesHandover } from '../utils/presalesHandover'
import { trackEvent } from '../utils/analytics'
import { ANALYTICS_EVENTS } from '../utils/analyticsEvents'
import { presalesWorkspaceViews } from '../data/workspaceNavigation'
import JourneyContextSummary from './JourneyContextSummary'
import CapabilityDiscovery from './presales/CapabilityDiscovery'
import CommonDiscovery from './presales/CommonDiscovery'
import PresalesGovernance from './presales/PresalesGovernance'
import RequirementsView from './presales/RequirementsView'
import SolutionShapingPack from './presales/SolutionShapingPack'
import SpecialistsView from './presales/SpecialistsView'
import SolutionShapingView from './presales/SolutionShapingView'

function PresalesWorkspace({ activeSectionId = 'context', onSectionChange, onBack, technicalProgress }) {
  const { state, qualificationSummary, presalesRecommendation } = useJourney()
  const presalesWorkspaceSummary = usePresalesSummary()
  const { solution: solutionReadiness, nextEngagement } = useReadiness()
  const trackedRef = useRef(new Set())
  const commonTarget = activeSectionId.startsWith('common:') ? activeSectionId.slice(7) : null
  const capabilityTarget = activeSectionId.startsWith('capability:') ? activeSectionId.slice(11) : null
  const activeView = commonTarget ? 'common' : capabilityTarget ? 'capabilities' : activeSectionId
  const activeIndex = Math.max(0, presalesWorkspaceViews.findIndex((item) => item.id === activeView))
  const handover = createPresalesHandover(state, qualificationSummary, presalesRecommendation)
  const qualificationLabels = (sectionId, fieldId) => {
    const field = qualificationSections.find((section) => section.id === sectionId)?.fields.find((item) => item.id === fieldId)
    const values = state.qualification[sectionId]?.[fieldId] ?? []
    return (Array.isArray(values) ? values : [values]).map((value) => field?.options.find((option) => option.id === value)?.label).filter(Boolean).join(', ')
  }

  if (!state.sectorId) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center"><CircleDashed className="mx-auto text-slate-400" size={28} aria-hidden="true" /><h3 className="mt-3 text-base font-bold text-slate-900">Build structured Sales context first</h3><p className="mx-auto mt-1 max-w-xl text-sm leading-6 text-slate-600">Choose a sector and shape the opportunity before beginning Presales discovery.</p></div>
  }

  const navigate = (viewId) => {
    onSectionChange(viewId)
    if (viewId === 'requirements' && !trackedRef.current.has('gaps')) {
      trackedRef.current.add('gaps')
      const gapCategories = [...new Set(presalesWorkspaceSummary.discovery.gaps.map((gap) => gap.category))]
      gapCategories.forEach((category) => trackEvent(ANALYTICS_EVENTS.TECHNICAL_GAP_IDENTIFIED, { category }))
    }
    if (viewId === 'specialists' && !trackedRef.current.has('specialists')) {
      trackedRef.current.add('specialists')
      presalesWorkspaceSummary.specialists.forEach((item) => trackEvent(ANALYTICS_EVENTS.SPECIALIST_RECOMMENDED, { specialist_category: item.id }))
    }
  }

  const trackSolutionReadiness = () => {
    if (trackedRef.current.has('solution-readiness')) return
    trackedRef.current.add('solution-readiness')
    trackEvent(ANALYTICS_EVENTS.SOLUTION_SHAPING_READINESS_VIEWED, { readiness_status: solutionReadiness.status, gap_count: solutionReadiness.gaps.length })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div><p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">Technical discovery progress</p><p className="mt-1 text-sm font-bold text-slate-900">{technicalProgress?.percentage ?? 0}% addressed</p></div>
        <div className="h-2 w-36 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label="Technical discovery progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={technicalProgress?.percentage ?? 0}><span className="block h-full rounded-full bg-[#e60000]" style={{ width: `${technicalProgress?.percentage ?? 0}%` }} /></div>
      </div>
      <details className="mb-4 rounded-xl border border-blue-200 bg-blue-50" onToggle={(event) => event.currentTarget.open && trackSolutionReadiness()}>
        <summary className="min-h-11 cursor-pointer list-none px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><span className="block text-[10px] font-bold tracking-wide text-blue-700 uppercase">Solution-shaping readiness</span><span className="mt-1 block text-sm font-bold text-slate-900">{solutionReadiness.label}</span></summary>
        <div className="border-t border-blue-200 px-4 py-3"><p className="text-xs leading-5 text-slate-600">{solutionReadiness.summary}</p><p className="mt-2 text-xs font-bold text-slate-800">Suggested focus: {nextEngagement.label}</p><ul className="mt-2 space-y-1">{nextEngagement.prepare.slice(0, 5).map((item) => <li key={item} className="text-xs leading-5 text-slate-600">• {item}</li>)}</ul></div>
      </details>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        {activeView === 'context' && (
          <div>
            <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <div><p className="text-[10px] font-bold tracking-wider text-[#d90000] uppercase">Sales context received</p><h3 className="mt-1 text-xl font-bold text-slate-900">Context inherited from Sales</h3><p className="mt-2 text-sm leading-6 text-slate-600">Review what is already known before validating the technical environment. Presales does not restart the opportunity or re-enter Sales context.</p><div className="mt-4"><JourneyContextSummary compact /></div></div>
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4" aria-labelledby="presales-inherited-title">
                <h4 id="presales-inherited-title" className="text-sm font-bold text-slate-900">Sales context received — opportunity briefing</h4>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    ['Why now', handover.context.whyNow.join(', ')], ['Business impact', handover.context.businessImpact.join(', ')],
                    ['Supporting situations', handover.context.supportingSituations.join(', ')], ['Sales qualification', qualificationSummary.label],
                    ['Success criteria', qualificationLabels('success', 'criteria')], ['Constraints', qualificationLabels('constraints', 'items')],
                    ['Known Sales risks', qualificationLabels('risk', 'items')], ['Presales reason', presalesRecommendation.reasons[0]],
                    ['Recommended Sales next action', handover.recommendedNextAction],
                    ['Primary next engagement', nextEngagement.label],
                  ].map(([label, value]) => <div key={label}><dt className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">{label}</dt><dd className={`mt-1 text-xs leading-5 font-semibold ${value ? 'text-slate-700' : 'text-slate-400'}`}>{value || 'Not yet established'}</dd></div>)}
                </dl>
              </section>
            </div>

            <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4" aria-labelledby="validate-title">
              <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 shrink-0 text-amber-700" size={19} aria-hidden="true" /><div><p className="text-[10px] font-bold tracking-wide text-amber-800 uppercase">Not yet technically validated</p><h4 id="validate-title" className="mt-1 text-sm font-bold text-slate-900">What Presales needs to validate</h4><p className="mt-1 text-xs leading-5 text-slate-600">Begin with genuine unknown, partial or gap areas; there is no requirement to invent answers.</p></div></div>
              <ul className="mt-3 flex flex-wrap gap-2">{presalesWorkspaceSummary.discovery.gaps.slice(0, 8).map((gap) => <li key={`${gap.source}-${gap.label}`} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-amber-200">{gap.label}</li>)}</ul>
            </section>
            <div className="mt-4 flex justify-end"><button type="button" onClick={() => navigate('common')} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#e60000] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#bd0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">Start Technical Discovery <ArrowRight size={16} aria-hidden="true" /></button></div>
          </div>
        )}
        {activeView === 'common' && <CommonDiscovery selectedSectionId={commonTarget} onSelectSection={(id) => onSectionChange(`common:${id}`)} />}
        {activeView === 'capabilities' && <CapabilityDiscovery selectedCapabilityId={capabilityTarget} onSelectCapability={(id) => onSectionChange(`capability:${id}`)} />}
        {activeView === 'requirements' && <RequirementsView />}
        {['assumptions', 'risks', 'dependencies'].includes(activeView) && <PresalesGovernance view={activeView} />}
        {activeView === 'specialists' && <SpecialistsView />}
        {activeView === 'solution_shaping' && <SolutionShapingView />}
        {activeView === 'pack' && <SolutionShapingPack />}
      </div>
      {activeView !== 'context' && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <button type="button" onClick={() => navigate(presalesWorkspaceViews[Math.max(0, activeIndex - 1)].id)} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><ArrowLeft size={16} aria-hidden="true" /> Back</button>
        {activeIndex < presalesWorkspaceViews.length - 1 && <button type="button" onClick={() => navigate(presalesWorkspaceViews[activeIndex + 1].id)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">Continue <ArrowRight size={16} aria-hidden="true" /></button>}
      </div>}
      {activeView === 'context' && <div className="mt-4"><button type="button" onClick={onBack} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><ArrowLeft size={16} aria-hidden="true" /> Back to Qualify</button></div>}
    </div>
  )
}

export default PresalesWorkspace
