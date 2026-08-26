import { createPresalesHandover } from './presalesHandover.js'

function present(value) {
  if (Array.isArray(value)) return value.filter(Boolean).length > 0
  return Boolean(value && !String(value).startsWith('Not captured'))
}

function section(id, title, value, partial = false, statusOverride = null) {
  const values = (Array.isArray(value) ? value : [value]).filter(present)
  return { id, title, status: statusOverride ?? (values.length ? (partial ? 'partial' : 'understood') : 'unknown'), items: values }
}

function qualificationItems(summary, ids) {
  return summary.sections.filter((item) => ids.includes(item.id)).map((item) => `${item.label}: ${item.status.replaceAll('_', ' ')}`)
}

export function createHandoverPreview(state, qualificationSummary, presalesRecommendation, readiness, nextEngagement) {
  const base = createPresalesHandover(state, qualificationSummary, presalesRecommendation)
  const context = base.context
  const constraintsNotApplicable = state.qualification?.constraints?.items?.includes('none_identified') && state.qualification?.risk?.items?.includes('none_identified')
  const preview = [
    section('opportunity-context', 'Opportunity Context', [`Sector: ${context.sector}`, `Conversation stage: ${context.conversationStage}`], !state.conversationStageId),
    section('customer-situation', 'Customer Situation', [context.primarySituation, ...context.supportingSituations]),
    section('why-now', 'Why Now', context.whyNow),
    section('business-impact', 'Business Impact', context.businessImpact),
    section('desired-outcomes', 'Desired Outcomes', [context.primaryOutcome, ...context.otherOutcomes]),
    section('qualification', 'Qualification', qualificationSummary.sections.map((item) => `${item.label}: ${item.status.replaceAll('_', ' ')}`), qualificationSummary.status !== 'ready'),
    section('capabilities', 'Capabilities', context.capabilities),
    section('scope-timeline', 'Scope & Timeline', qualificationItems(qualificationSummary, ['scale', 'timescale']), true),
    section('stakeholders-commercial', 'Stakeholders & Commercial', qualificationItems(qualificationSummary, ['stakeholders', 'commercial', 'procurement']), true),
    section('constraints-risks', 'Constraints & Risks', constraintsNotApplicable ? ['No constraints or risks identified'] : qualificationItems(qualificationSummary, ['constraints', 'risk']), !constraintsNotApplicable, constraintsNotApplicable ? 'not_applicable' : null),
    section('discovery-gaps', 'Discovery Gaps', readiness.gaps.map((item) => `${item.area}: ${item.status.replaceAll('_', ' ')}`), readiness.gaps.length > 0),
    section('engagement-reason', 'Presales Engagement Reason', presalesRecommendation.reasons),
    section('next-engagement', 'Next Engagement', [`${nextEngagement.label}: ${nextEngagement.reason}`]),
  ]
  return preview.map((item) => item.items.length ? item : { ...item, items: ['Not yet established'] })
}

export function createHandoverPack(state, qualificationSummary, presalesRecommendation, readiness, solutionReadiness, nextEngagement, presalesSummary) {
  const preview = createHandoverPreview(state, qualificationSummary, presalesRecommendation, readiness, nextEngagement)
  const byId = Object.fromEntries(preview.map((item) => [item.id, item.items]))
  return [
    ['Business Context', byId['opportunity-context']],
    ['Customer Challenge', byId['customer-situation']],
    ['Why Now', byId['why-now']],
    ['Business Impact', byId['business-impact']],
    ['Desired Outcomes', byId['desired-outcomes']],
    ['Qualification', byId.qualification],
    ['Capabilities', byId.capabilities],
    ['Known Environment', presalesSummary.requirements.Technical.length ? presalesSummary.requirements.Technical : ['Not yet established']],
    ['Constraints', byId['constraints-risks']],
    ['Risks', Object.keys(state.technicalDiscovery.risks).length ? Object.entries(state.technicalDiscovery.risks).map(([id, value]) => `${id.replaceAll('_', ' ')}: ${value}`) : ['Not yet established']],
    ['Discovery Gaps', readiness.gaps.map((item) => `${item.area} — ${item.recommendedAction}`)],
    ['Engagement Reason', presalesRecommendation.reasons],
    ['Readiness', [`Sales to Presales: ${readiness.label}`, `Solution shaping: ${solutionReadiness.label}`]],
    ['Next Engagement', [`${nextEngagement.label}: ${nextEngagement.reason}`]],
    ['Next Actions', nextEngagement.actions.map((item) => `${item.owner}: ${item.label}`)],
  ]
}

export function formatHandoverPack(pack, navigatorReference = null) {
  return ['Sales to Presales Handover Pack', ...(navigatorReference ? ['', 'Navigator Reference:', navigatorReference] : []), '', ...pack.flatMap(([title, items], index) => [`${index + 1}. ${title}`, ...(items.length ? items : ['Not yet established']).map((item) => `- ${item}`), '']), 'Privacy: structured, anonymous business and technical context only.'].join('\n')
}
