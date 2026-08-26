const situationRules = {
  costs_are_increasing: { outcomes: ['reduce_cost'], themes: ['operational_efficiency'], capabilities: ['managed_services'] },
  too_many_suppliers: { outcomes: ['reduce_cost'], themes: ['operational_efficiency'], capabilities: ['managed_services', 'connectivity'] },
  sites_keep_losing_connectivity: { outcomes: ['increase_resilience'], themes: ['network_modernisation', 'business_resilience'], capabilities: ['connectivity', 'sd_wan', 'mobile_5g', 'managed_services'] },
  moving_to_cloud: { outcomes: ['accelerate_transformation'], themes: ['cloud_ai_transformation', 'network_modernisation'], capabilities: ['cloud_hosting', 'connectivity', 'security', 'managed_services'] },
  cyber_security_concerns: { outcomes: ['improve_security', 'increase_resilience'], themes: ['security_transformation'], capabilities: ['security', 'sase_sse', 'connectivity'] },
  data_centre_exit: { outcomes: ['accelerate_transformation', 'increase_resilience'], themes: ['cloud_ai_transformation', 'business_resilience'], capabilities: ['cloud_hosting', 'colocation_data_centre', 'connectivity', 'security', 'managed_services'] },
  resilience_improvement: { outcomes: ['increase_resilience'], themes: ['business_resilience', 'network_modernisation'], capabilities: ['connectivity', 'sd_wan', 'mobile_5g', 'managed_services'] },
  ai_adoption: { outcomes: ['accelerate_transformation'], themes: ['cloud_ai_transformation'], capabilities: ['ai_data', 'cloud_hosting', 'connectivity', 'security', 'managed_services'] },
  opening_new_locations: { outcomes: ['grow_revenue', 'increase_resilience'], themes: ['network_modernisation'], capabilities: ['connectivity', 'mobile_5g', 'sd_wan', 'managed_services'] },
  ageing_infrastructure: { outcomes: ['reduce_cost', 'accelerate_transformation'], themes: ['network_modernisation', 'operational_efficiency'], capabilities: ['connectivity', 'cloud_hosting', 'managed_services'] },
  distributed_workforce: { outcomes: ['accelerate_transformation', 'improve_security'], themes: ['workforce_transformation', 'security_transformation'], capabilities: ['unified_communications', 'connectivity', 'sase_sse', 'security', 'mobile_5g'] },
  cloud_cost_concerns: { outcomes: ['reduce_cost'], themes: ['cloud_ai_transformation', 'operational_efficiency'], capabilities: ['cloud_hosting', 'managed_services'] },
  poor_application_performance: { outcomes: ['accelerate_transformation', 'increase_resilience'], themes: ['network_modernisation'], capabilities: ['sd_wan', 'connectivity', 'sase_sse', 'managed_services'] },
  network_complexity: { outcomes: ['reduce_cost', 'accelerate_transformation'], themes: ['network_modernisation', 'operational_efficiency'], capabilities: ['sd_wan', 'connectivity', 'managed_services', 'sase_sse'] },
  regulatory_compliance: { outcomes: ['improve_security', 'increase_resilience'], themes: ['security_transformation'], capabilities: ['security', 'sase_sse', 'cloud_hosting'] },
  acquisition_integration: { outcomes: ['accelerate_transformation', 'reduce_cost'], themes: ['network_modernisation', 'operational_efficiency'], capabilities: ['sd_wan', 'connectivity', 'managed_services', 'security'] },
  skills_resource_constraints: { outcomes: ['reduce_cost', 'accelerate_transformation'], themes: ['operational_efficiency'], capabilities: ['managed_services'] },
  operational_visibility: { outcomes: ['reduce_cost', 'increase_resilience'], themes: ['operational_efficiency'], capabilities: ['managed_services', 'iot', 'sd_wan'] },
  modernise_collaboration: { outcomes: ['accelerate_transformation'], themes: ['workforce_transformation'], capabilities: ['unified_communications', 'mobile_5g', 'sase_sse'] },
  connect_assets: { outcomes: ['reduce_cost', 'accelerate_transformation'], themes: ['operational_efficiency'], capabilities: ['iot', 'mobile_5g', 'connectivity', 'security', 'managed_services'] },
}

const sectorRules = {
  public_sector: { outcomes: ['improve_security', 'increase_resilience'], themes: ['security_transformation', 'cloud_ai_transformation'], capabilities: ['security', 'connectivity', 'cloud_hosting'] },
  healthcare: { outcomes: ['improve_security', 'increase_resilience'], themes: ['security_transformation', 'network_modernisation'], capabilities: ['security', 'connectivity', 'sase_sse'] },
  financial_services: { outcomes: ['improve_security', 'increase_resilience'], themes: ['security_transformation', 'business_resilience'], capabilities: ['security', 'sase_sse', 'connectivity'] },
  retail: { outcomes: ['grow_revenue', 'increase_resilience'], themes: ['network_modernisation', 'operational_efficiency'], capabilities: ['connectivity', 'sd_wan', 'managed_services'] },
  manufacturing: { outcomes: ['increase_resilience', 'accelerate_transformation'], themes: ['network_modernisation', 'operational_efficiency'], capabilities: ['connectivity', 'mobile_5g', 'iot'] },
  construction_engineering: { outcomes: ['increase_resilience'], themes: ['network_modernisation', 'workforce_transformation'], capabilities: ['mobile_5g', 'connectivity', 'unified_communications'] },
  transport_logistics: { outcomes: ['increase_resilience', 'accelerate_transformation'], themes: ['operational_efficiency', 'business_resilience'], capabilities: ['iot', 'mobile_5g', 'connectivity'] },
  energy_utilities: { outcomes: ['increase_resilience', 'improve_security'], themes: ['business_resilience', 'security_transformation'], capabilities: ['security', 'connectivity', 'iot'] },
  technology_digital: { outcomes: ['accelerate_transformation'], themes: ['cloud_ai_transformation', 'operational_efficiency'], capabilities: ['cloud_hosting', 'connectivity', 'managed_services'] },
  education: { outcomes: ['accelerate_transformation', 'improve_security'], themes: ['workforce_transformation', 'security_transformation'], capabilities: ['unified_communications', 'sase_sse', 'connectivity'] },
}

const triggerCapabilityRules = {
  contract_renewal: ['connectivity', 'sd_wan', 'managed_services'], data_centre_closure: ['cloud_hosting', 'colocation_data_centre', 'connectivity'],
  security_incident: ['security', 'sase_sse'], regulatory_change: ['security', 'cloud_hosting'], transformation_programme: ['managed_services', 'cloud_hosting'],
  acquisition: ['sd_wan', 'connectivity', 'managed_services', 'security'], rapid_growth: ['connectivity', 'cloud_hosting', 'managed_services'],
  cost_reduction_target: ['managed_services', 'sd_wan'], technology_refresh: ['connectivity', 'sd_wan', 'security'], new_sites: ['connectivity', 'mobile_5g'],
  workforce_change: ['unified_communications', 'sase_sse'], cloud_migration: ['cloud_hosting', 'connectivity', 'security'],
  ai_programme: ['ai_data', 'cloud_hosting', 'security'], service_performance_issue: ['connectivity', 'sd_wan', 'managed_services'],
  resilience_requirement: ['connectivity', 'mobile_5g', 'sd_wan'],
}

const impactRules = {
  revenue_risk: ['grow_revenue'], productivity_loss: ['reduce_cost'], customer_experience: ['grow_revenue'], operational_disruption: ['increase_resilience'],
  security_risk: ['improve_security'], compliance_risk: ['improve_security'], increased_cost: ['reduce_cost'], slow_change: ['accelerate_transformation'],
  limited_visibility: ['accelerate_transformation'], service_availability: ['increase_resilience'], growth_constraint: ['grow_revenue', 'accelerate_transformation'],
}

const outcomeThemeRules = {
  grow_revenue: ['operational_efficiency', 'network_modernisation'], reduce_cost: ['operational_efficiency'], improve_security: ['security_transformation'],
  increase_resilience: ['business_resilience', 'network_modernisation'], accelerate_transformation: ['cloud_ai_transformation', 'workforce_transformation'],
}

const themeCapabilityRules = {
  cloud_ai_transformation: ['cloud_hosting', 'connectivity', 'security', 'managed_services'],
  network_modernisation: ['connectivity', 'sd_wan', 'sase_sse', 'security'],
  security_transformation: ['security', 'sase_sse', 'connectivity'],
  workforce_transformation: ['unified_communications', 'connectivity', 'sase_sse', 'security', 'mobile_5g'],
  operational_efficiency: ['managed_services'],
  business_resilience: ['connectivity', 'mobile_5g', 'managed_services'],
}

function addScores(scoreMap, ids, reason, weight = 1) {
  ids?.forEach((id) => {
    const current = scoreMap.get(id) ?? { score: 0, reasons: [] }
    current.score += weight
    if (reason && !current.reasons.includes(reason)) current.reasons.push(reason)
    scoreMap.set(id, current)
  })
}

function ranked(scoreMap, limit) {
  return [...scoreMap.entries()].sort((a, b) => b[1].score - a[1].score || a[0].localeCompare(b[0])).slice(0, limit).map(([id, detail]) => ({ id, ...detail }))
}

export function createRecommendations(state) {
  const situations = [state.primarySituationId, ...(state.supportingSituationIds ?? [])].filter(Boolean)
  const outcomeScores = new Map()
  const themeScores = new Map()
  const capabilityScores = new Map()

  const sectorRule = sectorRules[state.sectorId]
  addScores(outcomeScores, sectorRule?.outcomes, 'Aligns with common priorities in the selected sector', 1)
  addScores(themeScores, sectorRule?.themes, 'Aligns with common priorities in the selected sector', 1)
  addScores(capabilityScores, sectorRule?.capabilities, 'Aligns with common priorities in the selected sector', 1)

  situations.forEach((situationId) => {
    const rule = situationRules[situationId]
    addScores(outcomeScores, rule?.outcomes, 'Matches the selected customer situation', 3)
    addScores(themeScores, rule?.themes, 'Supports the selected customer situation', 3)
    addScores(capabilityScores, rule?.capabilities, 'Relevant to the selected customer situation', 3)
  })
  state.whyNowIds?.forEach((triggerId) => addScores(capabilityScores, triggerCapabilityRules[triggerId], 'Relevant to the selected Why now trigger', 2))
  state.businessImpactIds?.forEach((impactId) => addScores(outcomeScores, impactRules[impactId], 'Addresses the selected business impact', 2))
  state.businessOutcomeIds?.forEach((outcomeId) => addScores(themeScores, outcomeThemeRules[outcomeId], 'Supports a selected business outcome', 2))
  state.transformationThemeIds?.forEach((themeId) => addScores(capabilityScores, themeCapabilityRules[themeId], 'Supports a selected transformation theme', 2))

  return {
    outcomes: ranked(outcomeScores, 4),
    themes: ranked(themeScores, 5),
    capabilities: ranked(capabilityScores, 7),
  }
}

const specialistCapabilities = new Set(['sd_wan', 'sase_sse', 'cloud_hosting', 'colocation_data_centre', 'security', 'iot', 'ai_data'])

export function createPresalesRecommendation(state, qualificationSummary) {
  const reasons = []
  const categories = []
  const selected = state.selectedCapabilityIds ?? []
  if (selected.length > 1) { reasons.push('Multiple capability areas require coordinated solution shaping.'); categories.push('multiple_capabilities') }
  const specialist = selected.filter((id) => specialistCapabilities.has(id))
  if (specialist.length) { reasons.push('Selected capability areas normally benefit from early specialist discovery.'); categories.push('specialist_capability') }
  if (state.businessImpactIds?.includes('compliance_risk') || state.whyNowIds?.includes('regulatory_change')) { reasons.push('Compliance or governance complexity needs technical assurance.'); categories.push('governance') }
  if (qualificationSummary?.gaps.some((gap) => ['technical', 'presales_readiness', 'scale'].includes(gap.sectionId) && gap.status !== 'not_started')) { reasons.push('Technical or scale discovery gaps remain.'); categories.push('discovery_gap') }
  const readiness = state.qualification?.presales_readiness ?? {}
  if (Object.values(readiness).includes('yes')) { reasons.push('Sales has identified a workshop, design or service-definition need.'); categories.push('technical_support') }

  const recommended = reasons.length > 0
  let nextAction = 'Discovery Session'
  if (selected.includes('cloud_hosting') || selected.includes('ai_data')) nextAction = 'Readiness Assessment'
  if (selected.includes('sd_wan') || selected.includes('sase_sse') || selected.includes('security') || selected.includes('iot')) nextAction = 'Technical Workshop'
  if (readiness.architecture_needed === 'yes') nextAction = 'Solution Design'
  if (state.whyNowIds?.includes('data_centre_closure')) nextAction = 'Migration Planning'

  return {
    recommended,
    headline: recommended ? 'Bring Presales in now' : 'Sales discovery can continue',
    reasons: recommended ? reasons : ['Continue structured discovery and involve Presales when a technical solution or specialist requirement begins to emerge.'],
    reasonCategories: [...new Set(categories)],
    nextAction,
  }
}
