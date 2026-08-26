import { ArrowRight, Layers3 } from 'lucide-react'
import {
  businessOutcomes,
  customerSituations,
  findTaxonomyItem,
  journeySectors,
  transformationThemes,
  vodafoneCapabilities,
} from '../data/journeyTaxonomies'
import { conversationStages } from '../data/meetingOptions'
import { useJourney } from '../context/useJourney'

function labelsFor(items, ids) {
  return ids.map((id) => findTaxonomyItem(items, id)?.label).filter(Boolean)
}

function JourneyContextSummary({ compact = false }) {
  const { state, qualificationSummary, presalesRecommendation } = useJourney()
  const rows = [
    ['Sector', findTaxonomyItem(journeySectors, state.sectorId)?.label],
    ['Primary situation', findTaxonomyItem(customerSituations, state.primarySituationId)?.label],
    ['Primary outcome', findTaxonomyItem(businessOutcomes, state.primaryOutcomeId)?.label],
    ['Other outcomes', labelsFor(businessOutcomes, state.businessOutcomeIds.filter((id) => id !== state.primaryOutcomeId)).join(', ')],
    ['Transformation themes', labelsFor(transformationThemes, state.transformationThemeIds).join(', ')],
    ['Selected capabilities', labelsFor(vodafoneCapabilities, state.selectedCapabilityIds).join(', ')],
    ['Conversation stage', findTaxonomyItem(conversationStages, state.conversationStageId)?.label],
    ['Qualification', qualificationSummary.startedCount ? qualificationSummary.label : null],
    ['Presales recommendation', state.selectedCapabilityIds.length ? presalesRecommendation.headline : null],
  ].filter(([, value]) => value)

  if (!rows.length) return null

  return (
    <aside className={`rounded-2xl border border-slate-200 bg-white ${compact ? 'p-4' : 'p-5'} shadow-[0_8px_28px_rgba(15,23,42,0.05)]`} aria-label="Shared journey context">
      <div className="flex items-center gap-2 text-[#d90000]">
        <Layers3 size={18} aria-hidden="true" />
        <h3 className="text-sm font-bold text-slate-900">Captured once, reused throughout</h3>
      </div>
      <dl className={`mt-4 grid gap-3 ${compact ? '' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
        {rows.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase">{label}</dt>
            <dd className="mt-1 text-sm leading-5 font-semibold text-slate-700">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-500">
        Capture once <ArrowRight size={13} aria-hidden="true" /> reuse in Prepare, Qualify and Presales
      </p>
    </aside>
  )
}

export default JourneyContextSummary
