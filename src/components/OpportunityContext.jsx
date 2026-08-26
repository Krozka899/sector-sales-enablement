import { Layers3 } from 'lucide-react'
import { useJourney } from '../context/useJourney'
import { businessOutcomes, customerSituations, findTaxonomyItem, journeySectors, vodafoneCapabilities } from '../data/journeyTaxonomies'
import { conversationStages } from '../data/meetingOptions'

function OpportunityContext() {
  const { state } = useJourney()
  const capabilityIds = [...new Set([...(state.selectedCapabilityIds ?? []), ...(state.technicalDiscovery.presalesAddedCapabilityIds ?? [])])]
  const capabilities = capabilityIds.map((id) => findTaxonomyItem(vodafoneCapabilities, id)?.label).filter(Boolean)
  const rows = [
    ['Sector', findTaxonomyItem(journeySectors, state.sectorId)?.label],
    ['Primary situation', findTaxonomyItem(customerSituations, state.primarySituationId)?.label],
    ['Business outcome', findTaxonomyItem(businessOutcomes, state.primaryOutcomeId)?.label],
    ['Conversation stage', findTaxonomyItem(conversationStages, state.conversationStageId)?.label],
  ]

  return (
    <aside aria-label="Live opportunity context">
      <div className="flex items-center gap-2"><Layers3 className="text-[#e60000]" size={17} aria-hidden="true" /><h3 className="text-sm font-bold text-slate-900">Opportunity context</h3></div>
      <dl className="mt-4 space-y-3">{rows.map(([label, value]) => <div key={label}><dt className="text-[9px] font-bold tracking-wide text-slate-400 uppercase">{label}</dt><dd className={`mt-0.5 text-xs leading-5 font-semibold ${value ? 'text-slate-700' : 'text-slate-400'}`}>{value || 'Not captured yet'}</dd></div>)}</dl>
      <div className="mt-4 border-t border-slate-200 pt-4"><p className="text-[9px] font-bold tracking-wide text-slate-400 uppercase">Capabilities to explore</p>{capabilities.length ? <ul className="mt-2 flex flex-wrap gap-1.5">{capabilities.map((label) => <li key={label} className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-slate-700">{label}</li>)}</ul> : <p className="mt-1 text-xs text-slate-400">Not captured yet</p>}</div>
    </aside>
  )
}

export default OpportunityContext
