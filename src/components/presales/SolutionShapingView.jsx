import { ArrowDown, Shapes } from 'lucide-react'
import { useJourney } from '../../context/useJourney'
import { usePresalesSummary } from '../../context/usePresalesSummary'
import { businessOutcomes, findTaxonomyItem, vodafoneCapabilities } from '../../data/journeyTaxonomies'
import { dependencyOptions as presalesDependencies } from '../../data/presalesDiscovery'

function SolutionShapingView() {
  const { state } = useJourney()
  const { requirements, solutionAreas, workshop, discovery } = usePresalesSummary()
  const outcome = findTaxonomyItem(businessOutcomes, state.primaryOutcomeId)?.label ?? 'Not captured yet'
  const capabilities = [...new Set([...(state.selectedCapabilityIds ?? []), ...(state.technicalDiscovery.presalesAddedCapabilityIds ?? [])])].map((id) => findTaxonomyItem(vodafoneCapabilities, id)?.label).filter(Boolean)
  const dependencies = state.technicalDiscovery.dependencies.map((id) => findTaxonomyItem(presalesDependencies, id)?.label).filter(Boolean)
  const requirement = [...requirements['Non-Functional'], ...requirements.Technical][0] ?? 'Further structured discovery required'
  const flow = [
    ['Business outcome', outcome],
    ['Technical requirement', requirement],
    ['Capability areas', capabilities.join(' + ') || 'Not captured yet'],
    ['Dependencies', dependencies.join(', ') || 'None identified yet'],
    ['Next technical action', workshop],
  ]

  return (
    <div>
      <section className="rounded-2xl border border-slate-200 bg-white p-4" aria-labelledby="solution-shaping-title">
        <div className="flex items-center gap-2"><Shapes className="text-[#e60000]" size={18} aria-hidden="true" /><h3 id="solution-shaping-title" className="text-base font-bold text-slate-900">Solution areas to explore</h3></div>
        <p className="mt-1 text-xs leading-5 text-slate-600">This is structured shaping guidance—not a final solution, approved architecture or product commitment.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div><h4 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Primary areas</h4><ul className="mt-2 space-y-2">{solutionAreas.primary.map((item) => <li key={item} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-slate-800">Explore {item}</li>)}</ul>{!solutionAreas.primary.length && <p className="mt-2 text-xs text-slate-400">No capability areas selected yet.</p>}</div>
          <div><h4 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Supporting areas</h4><ul className="mt-2 space-y-2">{solutionAreas.supporting.map((item) => <li key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">Consider {item}</li>)}</ul>{!solutionAreas.supporting.length && <p className="mt-2 text-xs text-slate-400">No supporting areas identified yet.</p>}</div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4" aria-labelledby="shaping-relationship-title">
        <h3 id="shaping-relationship-title" className="text-sm font-bold text-slate-900">Shaping relationship</h3>
        <ol className="mt-3 grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center">
          {flow.map(([label, value], index) => <li key={label} className="contents"><div className="rounded-xl bg-white p-3 ring-1 ring-slate-200"><p className="text-[9px] font-bold tracking-wide text-slate-400 uppercase">{label}</p><p className="mt-1 text-xs leading-5 font-semibold text-slate-700">{value}</p></div>{index < flow.length - 1 && <ArrowDown className="mx-auto text-slate-400 lg:-rotate-90" size={15} aria-hidden="true" />}</li>)}
        </ol>
        <p className="mt-3 text-xs font-bold text-slate-500">Discovery status: {discovery.readiness}. Validate all open gaps before detailed design.</p>
      </section>
    </div>
  )
}

export default SolutionShapingView
