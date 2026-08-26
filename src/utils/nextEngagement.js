const technicalWorkshopCapabilities = new Set(['sd_wan', 'sase_sse', 'security', 'iot'])
const readinessCapabilities = new Set(['cloud_hosting', 'ai_data'])

export function recommendNextEngagement(state, salesReadiness, solutionReadiness) {
  const capabilities = state.selectedCapabilityIds ?? []
  const migration = state.technicalDiscovery.common.migration_change ?? {}
  let id = 'discovery_session'
  let label = 'Discovery Session'
  let reason = 'Resolve the core business-context gaps before moving into technical design.'

  if (!['not_assessed', 'more_discovery_needed'].includes(salesReadiness.status)) {
    if (['high', 'very_high'].includes(migration.complexity) || state.whyNowIds?.includes('data_centre_closure')) {
      id = 'migration_planning'; label = 'Migration Planning'; reason = 'The structured context indicates migration sequencing and dependencies should be addressed next.'
    } else if (solutionReadiness.status === 'ready_for_solution_shaping') {
      id = 'solution_design'; label = 'Solution Design'; reason = 'Business and technical context are sufficiently established for solution shaping.'
    } else if (capabilities.some((item) => readinessCapabilities.has(item))) {
      id = 'readiness_assessment'; label = 'Readiness Assessment'; reason = 'Cloud, AI or data capability interest needs a structured readiness baseline.'
    } else if (capabilities.some((item) => technicalWorkshopCapabilities.has(item)) || capabilities.length > 1) {
      id = 'technical_workshop'; label = 'Technical Workshop'; reason = 'The selected capabilities benefit from joint technical validation and cross-domain alignment.'
    } else if (capabilities.includes('unified_communications') || capabilities.includes('mobile_5g')) {
      id = 'experience_demonstration'; label = 'Experience / Demonstration'; reason = 'A focused experience session can validate the intended user and operational outcomes.'
    }
  }

  const allGaps = [...salesReadiness.gaps, ...solutionReadiness.gaps]
  const actions = allGaps.slice(0, 3).map((item) => ({
    id: `action-${item.id}`,
    label: item.recommendedAction,
    owner: item.owner,
    target: { stage: item.stage, sectionId: item.sectionId },
  }))
  if (['technical_workshop', 'readiness_assessment', 'migration_planning', 'solution_design'].includes(id)) actions.push({ id: 'action-specialist', label: 'Confirm the appropriate technical specialist for the engagement.', owner: 'Specialist', target: { stage: 'presales', sectionId: 'specialists' } })
  actions.push({ id: 'action-customer-discussion', label: `Confirm objectives and relevant roles for the ${label}.`, owner: 'Customer discussion', target: { stage: 'presales', sectionId: 'context' } })
  if (actions.length === 1) actions.unshift({ id: 'action-alignment', label: 'Review the inherited Sales context and agree the validation focus.', owner: 'Shared', target: { stage: 'presales', sectionId: 'context' } })
  const prepare = actions.slice(0, 3).map((item) => item.label)
  return { id, label, reason, prepare, actions }
}
