import { capabilityDiscoveryModules } from '../data/capabilityDiscovery.js'
import { commonDiscoverySections } from '../data/presalesDiscovery.js'
import { businessOutcomes, findTaxonomyItem, vodafoneCapabilities } from '../data/journeyTaxonomies.js'

const understoodStatuses = new Set(['understood', 'not_applicable'])
const unresolvedValues = new Set(['unknown', 'partial', 'partially_understood', 'gap', 'not_defined', 'not_yet_defined', 'undefined'])

const importantCommonFields = {
  current_environment: ['hosting_model', 'network_model', 'security_model', 'operations_model'],
  availability_resilience: ['availability_expectation', 'rto_requirement', 'rpo_requirement', 'disaster_recovery_required'],
  security: ['identity_dependency', 'zero_trust_requirement', 'network_segmentation_required', 'security_monitoring_required'],
  connectivity: ['private_cloud_connectivity_required', 'bandwidth_range', 'resilience_required'],
  cloud: ['migration_involved', 'governance_defined', 'landing_zone_present', 'private_connectivity_required'],
  migration_change: ['strategy', 'complexity', 'wave_model'],
  support: ['support_model', 'coverage'],
}

const importantCapabilityFields = {
  connectivity: ['resilience_required', 'diverse_routing', 'bandwidth', 'private_connectivity'],
  sd_wan: ['current_wan', 'application_visibility', 'dynamic_path_selection', 'migration_complexity'],
  sase_sse: ['identity_dependency', 'zero_trust', 'secure_remote_access', 'security_governance'],
  cloud_hosting: ['hosting_model', 'landing_zone_maturity', 'governance', 'placement'],
  security: ['identity', 'secure_access', 'monitoring', 'managed_security'],
  managed_services: ['operations_model', 'skills_gap', 'support_coverage', 'governance'],
  ai_data: ['data_readiness', 'infrastructure_readiness', 'governance', 'security_requirement'],
}

export function getDiscoveryAreaStatus(answers = {}) {
  return Object.hasOwn(answers, 'discovery_status') ? answers.discovery_status : 'not_started'
}

export function getAllPresalesCapabilityIds(state) {
  return [...new Set([...(state.selectedCapabilityIds ?? []), ...(state.technicalDiscovery.presalesAddedCapabilityIds ?? [])])]
}

function unresolvedStatus(value) {
  const values = Array.isArray(value) ? value : [value]
  if (value === undefined || (Array.isArray(value) && !value.length)) return 'Not answered'
  const unresolved = values.find((item) => unresolvedValues.has(item))
  return unresolved ? unresolved.replaceAll('_', ' ') : null
}

function fieldGaps(scope, areaId, area, answers, fieldIds) {
  if (!Object.hasOwn(answers, 'discovery_status')) return []
  return fieldIds.flatMap((fieldId) => {
    const field = area.fields.find((item) => item.id === fieldId)
    const status = unresolvedStatus(answers[fieldId])
    if (!field || !status) return []
    return [{
      id: `${scope}:${areaId}:${fieldId}`,
      category: area.group ?? 'technical',
      label: field.label.replace(/\?$/, ''),
      status,
      source: scope,
      sectionId: `${scope === 'common' ? 'common' : 'capability'}:${areaId}`,
    }]
  })
}

export function createTechnicalFieldGaps(state) {
  const common = commonDiscoverySections.flatMap((section) => fieldGaps('common', section.id, section, state.technicalDiscovery.common[section.id] ?? {}, importantCommonFields[section.id] ?? []))
  const capabilities = getAllPresalesCapabilityIds(state).flatMap((id) => {
    const module = capabilityDiscoveryModules[id]
    if (!module) return []
    return fieldGaps('capability', id, module, state.technicalDiscovery.capabilities[id] ?? {}, importantCapabilityFields[id] ?? [])
  })
  return [...common, ...capabilities]
}

export function createTechnicalDiscoverySummary(state, qualificationSummary) {
  const common = commonDiscoverySections.map((section) => ({
    id: section.id,
    label: section.label,
    group: section.group,
    status: getDiscoveryAreaStatus(state.technicalDiscovery.common[section.id]),
  }))
  const capabilityIds = getAllPresalesCapabilityIds(state)
  const capabilities = capabilityIds.map((id) => ({
    id,
    label: capabilityDiscoveryModules[id]?.label ?? findTaxonomyItem(vodafoneCapabilities, id)?.label,
    status: getDiscoveryAreaStatus(state.technicalDiscovery.capabilities[id]),
    provenance: state.technicalDiscovery.presalesAddedCapabilityIds.includes(id) ? 'presales' : 'sales',
  }))
  const gaps = [
    ...createTechnicalFieldGaps(state),
    ...common.filter((item) => !understoodStatuses.has(item.status)).map((item) => ({ id: `common:${item.id}`, category: item.group, label: item.label, status: item.status, source: 'technical', sectionId: `common:${item.id}` })),
    ...capabilities.filter((item) => !understoodStatuses.has(item.status)).map((item) => ({ id: `capability:${item.id}`, category: 'technical', label: `${item.label} discovery`, status: item.status, source: 'capability', sectionId: `capability:${item.id}` })),
    ...qualificationSummary.gaps.map((item) => ({ id: `sales:${item.sectionId}`, category: ['commercial', 'procurement', 'competition'].includes(item.sectionId) ? 'commercial_readiness' : item.sectionId, label: `${item.label} qualification`, status: item.status, source: 'sales', sectionId: item.sectionId })),
  ]
  const understoodCount = [...common, ...capabilities].filter((item) => item.status === 'understood').length
  const totalCount = common.length + capabilities.length
  let readiness = 'Early Discovery'
  if (understoodCount >= 3) readiness = 'Discovery Progressing'
  if (understoodCount >= Math.max(5, Math.ceil(totalCount * 0.45))) readiness = 'Ready for Technical Workshop'
  if (gaps.filter((gap) => ['gap', 'unknown', 'not_started'].includes(gap.status)).length <= 3 && understoodCount >= Math.ceil(totalCount * 0.7)) readiness = 'Ready for Solution Shaping'
  if (gaps.some((gap) => gap.status === 'gap')) readiness = 'Further Discovery Required'

  return { common, capabilities, gaps, understoodCount, totalCount, readiness }
}

function answerLabel(field, value) {
  if (Array.isArray(value)) return value.map((item) => field.options.find((option) => option.id === item)?.label).filter(Boolean).join(', ')
  return field.options.find((option) => option.id === value)?.label
}

function statementsForSection(section, answers = {}) {
  return section.fields.filter((field) => field.id !== 'discovery_status' && answers[field.id] !== undefined && (Array.isArray(answers[field.id]) ? answers[field.id].length : true)).map((field) => {
    const label = field.label.replace(/\?$/, '')
    const value = answers[field.id]
    if (value === 'yes') return `${label}.`
    if (value === 'no') return `${label}: No.`
    if (value === 'unknown' || (Array.isArray(value) && value.includes('unknown'))) return `${label}: Unknown.`
    if (value === 'partial') return `${label}: Partially defined.`
    return `${label}: ${answerLabel(field, value)}.`
  })
}

export function createRequirementsSummary(state) {
  const commonById = Object.fromEntries(commonDiscoverySections.map((section) => [section.id, statementsForSection(section, state.technicalDiscovery.common[section.id])]))
  const capabilityStatements = getAllPresalesCapabilityIds(state).flatMap((id) => {
    const module = capabilityDiscoveryModules[id]
    return module ? statementsForSection(module, state.technicalDiscovery.capabilities[id]).map((statement) => `${module.label}: ${statement}`) : []
  })
  return {
    Business: state.businessOutcomeIds.map((id) => `Business outcome to support: ${findTaxonomyItem(businessOutcomes, id)?.label}.`).filter((item) => !item.includes('undefined')),
    Functional: capabilityStatements,
    Technical: [...(commonById.current_environment ?? []), ...(commonById.architecture_model ?? []), ...(commonById.connectivity ?? []), ...(commonById.cloud ?? [])],
    'Non-Functional': [...(commonById.scale ?? []), ...(commonById.availability_resilience ?? [])],
    Security: commonById.security ?? [],
    Availability: commonById.availability_resilience ?? [],
    Operations: [...(commonById.operations ?? []), ...(commonById.service_management ?? []), ...(commonById.support ?? [])],
    Migration: commonById.migration_change ?? [],
    Governance: commonById.compliance_governance ?? [],
  }
}

const specialistMap = {
  connectivity: ['Connectivity Specialist', 'Validate access, diversity, resilience and cloud-interconnect requirements.'],
  sd_wan: ['SD-WAN Specialist', 'Shape application-aware WAN discovery, readiness and migration planning.'],
  sase_sse: ['Security Specialist', 'Align identity, Zero Trust, secure access and network-security convergence.'],
  cloud_hosting: ['Cloud Specialist', 'Assess workload placement, landing-zone maturity, governance and migration.'],
  colocation_data_centre: ['Data Centre / Colocation Specialist', 'Validate capacity, power, resilience, interconnect and migration considerations.'],
  security: ['Security Specialist', 'Validate security architecture, monitoring, compliance and assurance needs.'],
  unified_communications: ['UC Specialist', 'Validate voice, collaboration, calling, integration and migration requirements.'],
  mobile_5g: ['Mobile / 5G Specialist', 'Assess coverage, rapid deployment, resilience and private-network requirements.'],
  iot: ['IoT Specialist', 'Validate device scale, coverage environment, telemetry and operational integration.'],
  managed_services: ['Managed Services Specialist', 'Define operational scope, governance, support and service responsibilities.'],
  ai_data: ['AI & Data Specialist', 'Assess data, infrastructure, platform, security and governance readiness.'],
}

export function createSpecialistRecommendations(state) {
  return getAllPresalesCapabilityIds(state).map((id) => ({ id, role: specialistMap[id]?.[0], reason: specialistMap[id]?.[1] })).filter((item) => item.role)
}

const solutionAreaMap = {
  connectivity: 'Resilient site, cloud and user connectivity', sd_wan: 'SD-WAN application visibility and path optimisation', sase_sse: 'Secure access and network-security convergence',
  cloud_hosting: 'Hybrid cloud hosting, governance and workload placement', colocation_data_centre: 'Colocation, interconnect and data-centre consolidation', security: 'Security posture, assurance and managed monitoring',
  unified_communications: 'Voice and collaboration modernisation', mobile_5g: 'Mobile, 5G or rapid-deployment connectivity', iot: 'Connected-asset visibility and telemetry',
  managed_services: 'Managed operations, monitoring and service governance', ai_data: 'AI and data readiness, infrastructure and governance',
}

export function createSolutionAreas(state) {
  const capabilityIds = getAllPresalesCapabilityIds(state)
  return {
    primary: capabilityIds.slice(0, 2).map((id) => solutionAreaMap[id]).filter(Boolean),
    supporting: capabilityIds.slice(2).map((id) => solutionAreaMap[id]).filter(Boolean),
  }
}

export function createWorkshopRecommendation(state, summary) {
  const capabilityIds = getAllPresalesCapabilityIds(state)
  if (capabilityIds.includes('sd_wan') || capabilityIds.includes('sase_sse') || capabilityIds.includes('iot')) return 'Technical Workshop'
  if (capabilityIds.includes('cloud_hosting') || capabilityIds.includes('ai_data')) return 'Readiness Assessment'
  if (capabilityIds.includes('security')) return 'Technical Workshop'
  if (state.technicalDiscovery.common.migration_change?.complexity === 'high' || state.technicalDiscovery.common.migration_change?.complexity === 'very_high') return 'Migration Planning'
  if (summary.readiness === 'Ready for Solution Shaping') return 'Solution Design'
  return 'Discovery Session'
}

export function createPresalesWorkspaceSummary(state, qualificationSummary) {
  const discovery = createTechnicalDiscoverySummary(state, qualificationSummary)
  return {
    discovery,
    requirements: createRequirementsSummary(state),
    specialists: createSpecialistRecommendations(state),
    workshop: createWorkshopRecommendation(state, discovery),
    solutionAreas: createSolutionAreas(state),
  }
}
