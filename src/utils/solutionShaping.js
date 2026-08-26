import { createPresalesHandover } from './presalesHandover.js'
import { findTaxonomyItem } from '../data/journeyTaxonomies.js'
import { assumptionOptions, dependencyOptions, technicalRiskOptions } from '../data/presalesDiscovery.js'

function labelsFor(items, ids) {
  return ids.map((id) => findTaxonomyItem(items, id)?.label).filter(Boolean)
}

export function createSolutionShapingPack(state, qualificationSummary, presalesRecommendation, workspaceSummary, navigatorReference = null) {
  const handover = createPresalesHandover(state, qualificationSummary, presalesRecommendation)
  const capabilityProvenance = workspaceSummary.discovery.capabilities.map((item) => `${item.label} (identified during ${item.provenance === 'presales' ? 'Presales' : 'Sales'})`)
  return {
    navigatorReference,
    opportunityContext: { ...handover.context, capabilities: workspaceSummary.discovery.capabilities.map((item) => item.label) },
    businessOutcomes: [handover.context.primaryOutcome, ...handover.context.otherOutcomes].filter(Boolean),
    salesDiscoverySummary: [
      `Primary situation: ${handover.context.primarySituation}`,
      ...handover.context.supportingSituations.map((item) => `Supporting situation: ${item}`),
      ...handover.context.whyNow.map((item) => `Why now: ${item}`),
      ...handover.context.businessImpact.map((item) => `Business impact: ${item}`),
      ...handover.context.transformationThemes.map((item) => `Transformation theme: ${item}`),
    ],
    capabilityProvenance,
    salesQualification: qualificationSummary.sections,
    currentEnvironment: workspaceSummary.requirements.Technical.filter((item) => /Hosting model|Cloud platforms|Network model|Security model|Operations model/.test(item)),
    technicalDiscovery: [
      ...workspaceSummary.discovery.common.map((item) => `${item.label}: ${item.status.replaceAll('_', ' ')}`),
      ...workspaceSummary.discovery.capabilities.map((item) => `${item.label}: ${item.status.replaceAll('_', ' ')}`),
    ],
    technicalRequirements: [...workspaceSummary.requirements.Technical, ...workspaceSummary.requirements.Functional],
    nonFunctionalRequirements: workspaceSummary.requirements['Non-Functional'],
    securityCompliance: [...workspaceSummary.requirements.Security, ...workspaceSummary.requirements.Governance],
    serviceOperations: workspaceSummary.requirements.Operations,
    migrationChange: workspaceSummary.requirements.Migration,
    assumptions: Object.entries(state.technicalDiscovery.assumptions).map(([id, status]) => `${findTaxonomyItem(assumptionOptions, id)?.label}: ${status.replaceAll('_', ' ')}`),
    risks: Object.entries(state.technicalDiscovery.risks).map(([id, impact]) => `${findTaxonomyItem(technicalRiskOptions, id)?.label}: ${impact} impact`),
    dependencies: labelsFor(dependencyOptions, state.technicalDiscovery.dependencies),
    discoveryGaps: workspaceSummary.discovery.gaps.map((gap) => `${gap.label}: ${gap.status.replaceAll('_', ' ')}`),
    specialists: workspaceSummary.specialists.map((item) => `${item.role}: ${item.reason}`),
    workshop: workspaceSummary.workshop,
    solutionAreas: workspaceSummary.solutionAreas,
    readiness: workspaceSummary.discovery.readiness,
    nextActions: [workspaceSummary.workshop, 'Validate remaining discovery gaps', 'Confirm solution areas before detailed design'],
  }
}

function bullets(items) {
  return items.length ? items.map((item) => `- ${item}`).join('\n') : '- Not yet established'
}

export function formatSolutionShapingPack(pack) {
  const context = pack.opportunityContext
  return [
    'Presales Solution-Shaping Pack', ...(pack.navigatorReference ? ['', 'Navigator Reference:', pack.navigatorReference] : []), '',
    '1. Opportunity Context', `Sector: ${context.sector}`, `Primary situation: ${context.primarySituation}`, `Why now: ${context.whyNow.join(', ') || 'Not established'}`,
    '', '2. Business Outcomes', `Primary: ${context.primaryOutcome}`, `Other: ${context.otherOutcomes.join(', ') || 'None selected'}`,
    '', '3. Sales Discovery Summary', bullets(pack.salesDiscoverySummary),
    '', '4. Sales Qualification', bullets(pack.salesQualification.map((item) => `${item.label}: ${item.status.replaceAll('_', ' ')}`)),
    '', '5. Current Environment', bullets(pack.currentEnvironment),
    '', '6. Technical Discovery', bullets(pack.technicalDiscovery),
    '', '7. Technical Requirements', bullets(pack.technicalRequirements),
    '', '8. Non-Functional Requirements', bullets(pack.nonFunctionalRequirements),
    '', '9. Security / Compliance', bullets(pack.securityCompliance),
    '', '10. Service / Operations', bullets(pack.serviceOperations),
    '', '11. Migration / Change', bullets(pack.migrationChange),
    '', '12. Capabilities to Explore', bullets(pack.capabilityProvenance),
    '', '13. Assumptions', bullets(pack.assumptions),
    '', '14. Risks', bullets(pack.risks),
    '', '15. Dependencies', bullets(pack.dependencies),
    '', '16. Technical Discovery Gaps', bullets(pack.discoveryGaps),
    '', '17. Recommended Specialists', bullets(pack.specialists),
    '', '18. Recommended Workshop / Next Engagement', pack.workshop,
    '', '19. Solution Areas to Explore', 'Primary:', bullets(pack.solutionAreas.primary), 'Supporting:', bullets(pack.solutionAreas.supporting),
    '', '20. Next Actions', bullets(pack.nextActions),
    '', `Design readiness: ${pack.readiness}`,
  ].join('\n')
}
