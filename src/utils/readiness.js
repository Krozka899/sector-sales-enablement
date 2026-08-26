const unknownValues = new Set(['unknown', 'partial', 'partially_understood', 'gap', 'not_defined', 'not_yet_defined', 'undefined'])

export const salesReadinessLabels = Object.freeze({
  not_assessed: 'Not assessed',
  more_discovery_needed: 'More discovery needed',
  ready_with_gaps: 'Ready with gaps',
  ready: 'Ready for Presales',
})

export const solutionReadinessLabels = Object.freeze({
  not_assessed: 'Not assessed',
  technical_discovery_needed: 'Technical discovery needed',
  ready_with_gaps: 'Ready with gaps',
  ready_for_solution_shaping: 'Ready for solution shaping',
})

function hasValue(value) {
  return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== ''
}

function hasResolvedValue(value) {
  if (!hasValue(value)) return false
  return !(Array.isArray(value) ? value : [value]).some((item) => unknownValues.has(item))
}

function sectionHasResolvedAnswer(state, sectionId) {
  return Object.values(state.qualification?.[sectionId] ?? {}).some(hasResolvedValue)
}

function gap(id, area, source, importance, recommendedAction, owner, stage, sectionId, status = 'unanswered') {
  return { id, area, label: area, source, status, importance, recommendedAction, owner, stage, sectionId }
}

export function evaluateSalesReadiness(state) {
  const capabilities = state.selectedCapabilityIds ?? []
  const reasons = []
  const gaps = []
  const add = (...args) => gaps.push(gap(...args))

  if (!state.sectorId) add('sales-sector', 'Sector context', 'sales', 'critical', 'Select the customer sector.', 'Sales', 'explore', 'sector')
  else reasons.push('Sector context is established.')
  if (!state.primarySituationId) add('sales-challenge', 'Primary customer challenge', 'sales', 'critical', 'Confirm the main customer situation.', 'Sales', 'discover', 'situation')
  else reasons.push('The primary customer challenge is understood.')
  if (!(state.businessOutcomeIds ?? []).length) add('sales-outcome', 'Desired business outcome', 'sales', 'critical', 'Select at least one desired outcome.', 'Sales', 'shape', 'outcomes')
  else reasons.push('At least one desired business outcome is established.')
  if (!(state.whyNowIds ?? []).length && !(state.businessImpactIds ?? []).length) add('sales-value-case', 'Why now or business impact', 'sales', 'critical', 'Establish urgency or the impact of no change.', 'Sales', 'discover', 'why_now')
  else reasons.push('Urgency or business impact provides a reason to act.')
  if (!state.conversationStageId) add('sales-stage', 'Conversation stage', 'sales', 'critical', 'Select the current conversation stage.', 'Sales', 'prepare', 'conversation')
  else reasons.push('The conversation stage is known.')
  const presalesReasonEstablished = Object.values(state.qualification?.presales_readiness ?? {}).includes('yes')
  if (!capabilities.length && !presalesReasonEstablished) add('sales-direction', 'Capability direction or Presales reason', 'shared', 'critical', 'Select a capability area or establish why Presales support is needed.', 'Sales', 'shape', 'capabilities')
  else reasons.push('A capability direction or Presales engagement reason is present.')

  const importantAreas = [
    ['sales-urgency', 'Urgency', 'business', 'Confirm why this matters now.', 'Sales'],
    ['sales-impact', 'Business impact', 'business', 'Confirm the impact if nothing changes.', 'Sales'],
    ['sales-scope', 'Opportunity scale', 'scale', 'Capture anonymous scale ranges.', 'Sales'],
    ['sales-timeline', 'Decision and delivery horizon', 'timescale', 'Capture safe timeline ranges.', 'Sales'],
    ['sales-environment', 'Current environment', 'technical', 'Capture high-level current-environment context.', 'Shared'],
    ['sales-commercial', 'Commercial readiness', 'commercial', 'Clarify high-level commercial readiness.', 'Sales'],
    ['sales-stakeholders', 'Stakeholder roles', 'stakeholders', 'Identify relevant roles without names.', 'Sales'],
    ['sales-competition', 'Competitive context', 'competition', 'Clarify high-level competitive context.', 'Sales'],
    ['sales-constraints', 'Known constraints', 'constraints', 'Confirm structured constraint categories.', 'Shared'],
  ]
  importantAreas.forEach(([id, area, sectionId, action, owner]) => {
    if (!sectionHasResolvedAnswer(state, sectionId)) add(id, area, 'sales', 'important', action, owner, 'qualify', sectionId, Object.values(state.qualification?.[sectionId] ?? {}).some(hasValue) ? 'unknown' : 'unanswered')
  })

  const started = [state.sectorId, state.primarySituationId, (state.businessOutcomeIds ?? []).length, state.conversationStageId].filter(Boolean).length
  const criticalCount = gaps.filter((item) => item.importance === 'critical').length
  const importantCount = gaps.filter((item) => item.importance === 'important').length
  let status = 'not_assessed'
  if (started > 0 && criticalCount) status = 'more_discovery_needed'
  if (started > 0 && !criticalCount) status = importantCount <= 2 ? 'ready' : 'ready_with_gaps'

  const summary = status === 'ready'
    ? 'The core business context is strong enough for a purposeful Presales engagement.'
    : status === 'ready_with_gaps'
      ? 'Presales can engage now, with the remaining gaps made explicit for joint discovery.'
      : status === 'more_discovery_needed'
        ? 'A small number of core Sales discovery areas should be established before handover.'
        : 'Complete the first structured discovery selections to assess Presales readiness.'

  return { status, label: salesReadinessLabels[status], summary, strengths: reasons, gaps, criticalCount, importantCount }
}

export function evaluateSolutionShapingReadiness(state, presalesSummary) {
  const areas = [...presalesSummary.discovery.common, ...presalesSummary.discovery.capabilities]
  const assessed = areas.filter((item) => item.status !== 'not_started')
  const blockingStatuses = new Set(['gap', 'unknown'])
  const blocking = assessed.filter((item) => blockingStatuses.has(item.status))
  const unresolved = presalesSummary.discovery.gaps.map((item) => ({
    id: `solution-${item.id}`,
    area: item.label,
    label: item.label,
    source: item.source === 'sales' ? 'sales' : 'presales',
    status: item.status,
    importance: blockingStatuses.has(item.status) ? 'important' : 'informational',
    recommendedAction: `Validate ${item.label.toLowerCase()} before detailed solution shaping.`,
    owner: item.source === 'sales' ? 'Shared' : 'Presales',
    stage: item.source === 'sales' ? 'qualify' : 'presales',
    sectionId: item.sectionId,
  }))
  let status = 'not_assessed'
  if (assessed.length && (blocking.length || assessed.length < Math.min(3, areas.length))) status = 'technical_discovery_needed'
  if (assessed.length >= Math.min(3, areas.length) && !blocking.length) status = unresolved.length ? 'ready_with_gaps' : 'ready_for_solution_shaping'
  if (areas.length && assessed.length === areas.length && !blocking.length && unresolved.filter((item) => item.importance === 'important').length <= 1) status = 'ready_for_solution_shaping'

  const summary = status === 'ready_for_solution_shaping'
    ? 'The relevant technical areas are sufficiently understood to begin solution shaping.'
    : status === 'ready_with_gaps'
      ? 'Solution shaping can begin while the listed gaps are validated in parallel.'
      : status === 'technical_discovery_needed'
        ? 'Focused technical discovery is needed before detailed solution shaping.'
        : 'Technical discovery has not yet been assessed; this does not change Sales handover readiness.'
  return {
    status,
    label: solutionReadinessLabels[status],
    summary,
    strengths: assessed.filter((item) => ['understood', 'not_applicable'].includes(item.status)).map((item) => `${item.label} is ${item.status === 'not_applicable' ? 'not applicable' : 'understood'}.`),
    gaps: unresolved,
  }
}
