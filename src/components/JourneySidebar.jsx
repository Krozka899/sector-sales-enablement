import { Check, Circle, LockKeyhole } from 'lucide-react'
import { qualificationSections } from '../data/qualificationModel'
import { discoverWorkspaceSections, presalesWorkspaceViews, shapeWorkspaceSections } from '../data/workspaceNavigation'
import { capabilityDiscoveryModules } from '../data/capabilityDiscovery'
import { commonDiscoverySections } from '../data/presalesDiscovery'

const stages = [
  ['explore', 'Explore'], ['discover', 'Discover'], ['shape', 'Shape'], ['prepare', 'Prepare'], ['qualify', 'Qualify'], ['presales', 'Presales'],
]

function sectionStatus(stage, sectionId, state, progressModel) {
  if (stage === 'discover') {
    const addressed = { situation: Boolean(state.primarySituationId), why_now: state.whyNowIds.length > 0, business_impact: state.businessImpactIds.length > 0 }
    return addressed[sectionId] ? 'complete' : 'not_started'
  }
  if (stage === 'shape') {
    const addressed = { outcomes: Boolean(state.primaryOutcomeId), themes: state.transformationThemeIds.length > 0, capabilities: state.selectedCapabilityIds.length > 0, guidance: state.selectedCapabilityIds.length > 0 }
    return addressed[sectionId] ? 'complete' : 'not_started'
  }
  if (stage === 'qualify') return progressModel.qualification.sections.find((section) => section.id === sectionId)?.status ?? 'not_started'
  if (stage === 'presales') {
    if (sectionId === 'common' || sectionId === 'capabilities') {
      const prefix = sectionId === 'common' ? 'common:' : 'capability:'
      const sections = progressModel.presales.sections.filter((section) => section.id.startsWith(prefix))
      if (sections.length && sections.every((section) => section.status === 'complete')) return 'complete'
      if (sections.some((section) => section.status !== 'not_started')) return 'partial'
    }
    if (sectionId.startsWith('capability:') || sectionId.startsWith('common:') || ['assumptions', 'risks', 'dependencies', 'context'].includes(sectionId)) {
      return progressModel.presales.sections.find((section) => section.id === sectionId)?.status ?? 'not_started'
    }
  }
  return 'not_started'
}

function stageSections(stage, state) {
  if (stage === 'discover') return discoverWorkspaceSections
  if (stage === 'shape') return shapeWorkspaceSections
  if (stage === 'qualify') return qualificationSections.map(({ id, label }) => ({ id, label }))
  if (stage === 'presales') {
    const capabilityIds = [...new Set([...(state.selectedCapabilityIds ?? []), ...(state.technicalDiscovery.presalesAddedCapabilityIds ?? [])])]
    const dynamicCapabilities = capabilityIds.filter((id) => capabilityDiscoveryModules[id]).map((id) => ({ id: `capability:${id}`, label: capabilityDiscoveryModules[id].label }))
    const commonSections = commonDiscoverySections.map((section) => ({ id: `common:${section.id}`, label: section.label }))
    return presalesWorkspaceViews.flatMap((view) => view.id === 'common' ? [view, ...commonSections] : view.id === 'capabilities' ? [view, ...dynamicCapabilities] : [view])
  }
  return []
}

function JourneySidebar({ state, progressModel, activeSection, onNavigateStage, onNavigateSection }) {
  const stageAvailability = {
    explore: true,
    discover: progressModel.stages[0].percentage === 100,
    shape: progressModel.stages[1].percentage === 100,
    prepare: progressModel.stages[1].percentage === 100,
    qualify: progressModel.stages[2].percentage === 100,
    presales: progressModel.stages[0].percentage === 100,
  }
  const sections = stageSections(state.journeyStage, state)

  return (
    <nav aria-label="Opportunity journey navigation" className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto pb-1">
        <ol className="flex min-w-max gap-2 md:grid md:min-w-0 md:grid-cols-6">
          {stages.map(([id, label], index) => {
            const stage = progressModel.stages[index]
            const current = state.journeyStage === id
            const available = stageAvailability[id]
            return (
              <li key={id} className="w-32 md:w-auto">
                <button type="button" disabled={!available} aria-current={current ? 'step' : undefined} onClick={() => onNavigateStage(id)} className={`flex min-h-12 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] disabled:cursor-not-allowed ${current ? 'bg-red-50 text-[#d90000]' : available ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-400'}`}>
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full border ${stage.status === 'complete' ? 'border-emerald-600 bg-emerald-600 text-white' : current ? 'border-[#e60000] text-[#d90000]' : 'border-slate-300'}`}>{stage.status === 'complete' ? <Check size={12} aria-hidden="true" /> : available ? <Circle size={8} fill={current ? 'currentColor' : 'none'} aria-hidden="true" /> : <LockKeyhole size={11} aria-hidden="true" />}</span>
                  <span>{label}<span className="sr-only">, {current ? 'current, ' : ''}{available ? stage.status.replaceAll('_', ' ') : 'locked'}</span></span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
      {sections.length > 0 && (
        <div className="mt-3 border-t border-slate-200 pt-3">
          <p className="px-1 text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">{progressModel.stages.find((stage) => stage.id === state.journeyStage)?.label} sections</p>
          <div className="mt-2 overflow-x-auto pb-1">
            <ul className="flex min-w-max gap-1.5">
              {sections.map((section) => {
                const status = sectionStatus(state.journeyStage, section.id, state, progressModel)
                const selected = activeSection === section.id || (section.id === 'common' && activeSection?.startsWith('common:')) || (section.id === 'capabilities' && activeSection?.startsWith('capability:'))
                return <li key={section.id}><button type="button" aria-current={selected ? 'page' : undefined} onClick={() => onNavigateSection(state.journeyStage, section.id)} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${selected ? 'bg-red-50 text-[#d90000]' : 'text-slate-600 hover:bg-slate-50'}`}><span className={`size-1.5 rounded-full ${status === 'complete' ? 'bg-emerald-600' : status === 'partial' ? 'bg-amber-500' : 'bg-slate-300'}`} aria-hidden="true" />{section.label}<span className="sr-only">, {status.replaceAll('_', ' ')}</span></button></li>
              })}
            </ul>
          </div>
        </div>
      )}
    </nav>
  )
}

export default JourneySidebar
