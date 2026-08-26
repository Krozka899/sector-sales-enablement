import { useState } from 'react'
import { Check, Copy, FileOutput } from 'lucide-react'
import { useJourney } from '../../context/useJourney'
import { usePresalesSummary } from '../../context/usePresalesSummary'
import { createSolutionShapingPack, formatSolutionShapingPack } from '../../utils/solutionShaping'
import { trackEvent } from '../../utils/analytics'
import { ANALYTICS_EVENTS } from '../../utils/analyticsEvents'
import { useOpportunityWorkspaces } from '../../context/useOpportunityWorkspaces'

function PackList({ title, items }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <h4 className="text-xs font-bold text-slate-900">{title}</h4>
      {items.length ? <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-700">{items.map((item) => <li key={item}>• {item}</li>)}</ul> : <p className="mt-2 text-xs text-slate-400">Not yet established</p>}
    </section>
  )
}

function SolutionShapingPack() {
  const { state, qualificationSummary, presalesRecommendation } = useJourney()
  const presalesWorkspaceSummary = usePresalesSummary()
  const { activeWorkspace } = useOpportunityWorkspaces()
  const [pack, setPack] = useState(null)
  const [copyStatus, setCopyStatus] = useState('idle')

  const generatePack = () => {
    setPack(createSolutionShapingPack(state, qualificationSummary, presalesRecommendation, presalesWorkspaceSummary, activeWorkspace?.navigatorReference))
    trackEvent(ANALYTICS_EVENTS.SOLUTION_SHAPING_PACK_GENERATED)
  }

  const copyPack = async () => {
    try {
      await navigator.clipboard.writeText(formatSolutionShapingPack(pack))
      setCopyStatus('copied')
      trackEvent(ANALYTICS_EVENTS.SOLUTION_SHAPING_PACK_COPIED)
    } catch {
      setCopyStatus('error')
    }
  }

  if (!pack) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
        <FileOutput className="mx-auto text-slate-400" size={30} aria-hidden="true" />
        <h3 className="mt-3 text-base font-bold text-slate-900">Generate the Presales Solution-Shaping Pack</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">Assemble inherited Sales context, structured technical discovery, requirements, gaps, specialists and next actions. No customer identifiers or free text are included.</p>
        <button type="button" onClick={generatePack} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#e60000] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#bd0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><FileOutput size={16} aria-hidden="true" /> Generate pack</button>
      </div>
    )
  }

  const context = pack.opportunityContext
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 px-5 py-4 text-white">
        <div><p className="text-[10px] font-bold tracking-wider text-red-300 uppercase">Structured output</p><h3 className="mt-1 text-lg font-bold">Presales Solution-Shaping Pack</h3></div>
        <button type="button" onClick={copyPack} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{copyStatus === 'copied' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{copyStatus === 'copied' ? 'Pack copied' : copyStatus === 'error' ? 'Try copy again' : 'Copy Presales Pack'}</button>
      </div>
      <div className="p-4 sm:p-5">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4" aria-labelledby="pack-context-title"><h4 id="pack-context-title" className="text-sm font-bold text-slate-900">1. Opportunity Context</h4><dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{[['Navigator reference', pack.navigatorReference ?? 'Not available'], ['Sector', context.sector], ['Situation', context.primarySituation], ['Conversation stage', context.conversationStage], ['Why now', context.whyNow.join(', ') || 'Not established']].map(([label, value]) => <div key={label}><dt className="text-[10px] font-bold text-slate-400 uppercase">{label}</dt><dd className="mt-1 text-xs font-semibold text-slate-700">{value}</dd></div>)}</dl></section>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <PackList title="2. Business Outcomes" items={pack.businessOutcomes} />
          <PackList title="3. Sales Discovery Summary" items={pack.salesDiscoverySummary} />
          <PackList title="4. Sales Qualification" items={pack.salesQualification.map((item) => `${item.label}: ${item.status.replaceAll('_', ' ')}`)} />
          <PackList title="5. Current Environment" items={pack.currentEnvironment} />
          <PackList title="6. Technical Discovery" items={pack.technicalDiscovery} />
          <PackList title="7. Technical Requirements" items={pack.technicalRequirements} />
          <PackList title="8. Non-Functional Requirements" items={pack.nonFunctionalRequirements} />
          <PackList title="9. Security / Compliance" items={pack.securityCompliance} />
          <PackList title="10. Service / Operations" items={pack.serviceOperations} />
          <PackList title="11. Migration / Change" items={pack.migrationChange} />
          <PackList title="12. Capabilities to Explore" items={pack.capabilityProvenance} />
          <PackList title="13. Assumptions" items={pack.assumptions} />
          <PackList title="14. Risks" items={pack.risks} />
          <PackList title="15. Dependencies" items={pack.dependencies} />
          <PackList title="16. Technical Discovery Gaps" items={pack.discoveryGaps} />
          <PackList title="17. Recommended Specialists" items={pack.specialists} />
          <PackList title="18. Recommended Workshop / Next Engagement" items={[pack.workshop]} />
          <PackList title="19. Solution Areas to Explore" items={[...pack.solutionAreas.primary, ...pack.solutionAreas.supporting]} />
          <PackList title="20. Next Actions" items={pack.nextActions} />
        </div>
        <p className="mt-4 text-xs font-bold text-slate-500">Design readiness: {pack.readiness}</p>
        <p className="sr-only" aria-live="polite">{copyStatus === 'copied' ? 'Solution-Shaping Pack copied to clipboard' : copyStatus === 'error' ? 'Solution-Shaping Pack could not be copied' : ''}</p>
      </div>
    </article>
  )
}

export default SolutionShapingPack
