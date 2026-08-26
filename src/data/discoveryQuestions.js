const capabilityQuestions = {
  connectivity: [
    ['connectivity_sites', 'How many sites or operating locations are involved?', 'technical'],
    ['connectivity_apps', 'Which applications are business critical?', 'business'],
    ['connectivity_refresh', 'Is connectivity approaching refresh or renewal?', 'commercial'],
    ['connectivity_outage', 'What happens operationally when connectivity is unavailable?', 'resilience'],
    ['connectivity_cloud', 'Are private cloud connections required?', 'technical'],
    ['connectivity_resilience', 'How is resilience provided today?', 'resilience'],
  ],
  sd_wan: [
    ['sdwan_cloud_performance', 'Are cloud applications performing consistently?', 'technical'],
    ['sdwan_providers', 'How many WAN providers are managed today?', 'operations'],
    ['sdwan_changes', 'How long do network changes take?', 'operations'],
    ['sdwan_visibility', 'Is application-level network visibility available?', 'technical'],
    ['sdwan_access', 'What access types exist today?', 'technical'],
    ['sdwan_priority', 'Which applications require prioritisation?', 'business'],
  ],
  sase_sse: [
    ['sase_remote_access', 'How do users access applications remotely?', 'security'],
    ['sase_cloud_controls', 'Are security controls moving to cloud?', 'security'],
    ['sase_vendors', 'How many security tools or vendors are involved?', 'operations'],
    ['sase_zero_trust', 'Is Zero Trust part of the roadmap?', 'governance'],
    ['sase_identity', 'How are identity and access policies applied today?', 'security'],
  ],
  cloud_hosting: [
    ['cloud_workloads', 'What types of workloads are moving?', 'technical'],
    ['cloud_platforms', 'Which cloud platforms are currently used?', 'technical'],
    ['cloud_governance', 'How is cloud governance managed?', 'governance'],
    ['cloud_costs', 'Are cloud costs predictable?', 'commercial'],
    ['cloud_availability', 'What availability requirements exist?', 'resilience'],
    ['cloud_compliance', 'What security or compliance constraints apply?', 'security'],
    ['cloud_private_connection', 'Is private cloud connectivity required?', 'technical'],
    ['cloud_operations', 'Who operates the environment today?', 'operations'],
  ],
  colocation_data_centre: [
    ['colo_hosting', 'Where are workloads hosted today?', 'technical'],
    ['colo_consolidation', 'Is consolidation planned?', 'business'],
    ['colo_sovereignty', 'Are sovereignty requirements important?', 'governance'],
    ['colo_growth', 'What capacity growth is expected?', 'technical'],
    ['colo_connectivity', 'What connectivity is required between sites and clouds?', 'technical'],
    ['colo_resilience', 'What resilience model is required?', 'resilience'],
  ],
  security: [
    ['security_management', 'How is security managed today?', 'security'],
    ['security_frameworks', 'Which compliance frameworks matter?', 'governance'],
    ['security_concerns', 'What are the key cyber concerns?', 'security'],
    ['security_fragmentation', 'Which controls are currently fragmented?', 'security'],
    ['security_monitoring', 'How is security monitored?', 'operations'],
    ['security_identity', 'What identity and access model exists?', 'security'],
  ],
  unified_communications: [
    ['uc_voice', 'How important is enterprise voice?', 'business'],
    ['uc_platform', 'What collaboration platform is used?', 'technical'],
    ['uc_users', 'Where are users broadly based?', 'technical'],
    ['uc_integration', 'Is contact or voice integration required?', 'technical'],
    ['uc_experience', 'What user experience problems exist?', 'business'],
  ],
  mobile_5g: [
    ['mobile_workforce', 'How mobile is the workforce?', 'business'],
    ['mobile_temporary', 'Are temporary locations common?', 'technical'],
    ['mobile_backup', 'Is mobile backup required?', 'resilience'],
    ['mobile_apps', 'What applications must remain available?', 'business'],
    ['mobile_private', 'Are private or mobile network requirements emerging?', 'technical'],
  ],
  iot: [
    ['iot_assets', 'What assets need to be connected?', 'technical'],
    ['iot_data', 'What information needs to be collected?', 'business'],
    ['iot_frequency', 'How frequently is telemetry required?', 'technical'],
    ['iot_decision', 'What business decision will the data support?', 'business'],
    ['iot_mobility', 'Are assets mobile or fixed?', 'technical'],
    ['iot_environment', 'What coverage or environment constraints exist?', 'technical'],
  ],
  managed_services: [
    ['managed_operator', 'Who operates the environment today?', 'operations'],
    ['managed_resource', 'Which tasks consume the most resource?', 'operations'],
    ['managed_support', 'What support model is required?', 'operations'],
    ['managed_outcomes', 'What operational outcomes matter?', 'success'],
    ['managed_consolidation', 'Is supplier consolidation important?', 'commercial'],
  ],
  ai_data: [
    ['ai_outcome', 'What business outcome is expected from AI?', 'business'],
    ['ai_data_governance', 'Is the required data accessible and governed?', 'governance'],
    ['ai_platforms', 'Which platforms are involved?', 'technical'],
    ['ai_infrastructure', 'Is infrastructure ready for AI workloads?', 'technical'],
    ['ai_controls', 'What security or governance controls are required?', 'security'],
    ['ai_scale', 'Is this experimentation or production-scale adoption?', 'technical'],
  ],
}

export const discoveryQuestions = Object.entries(capabilityQuestions).flatMap(([capabilityId, questions]) => questions.map(([id, question, category], index) => ({
  id,
  question,
  category,
  capabilities: [capabilityId],
  stage: 'sales_discovery',
  importance: index < 2 ? 'high' : 'standard',
  presalesTrigger: ['technical', 'security', 'governance', 'resilience'].includes(category),
})))

export const coreSalesQuestions = [
  ['sales_business_outcome', 'What business outcome are you trying to achieve?', 'business'],
  ['sales_why_now', 'Why is this important now?', 'business'],
  ['sales_no_change', 'What happens if nothing changes?', 'business'],
  ['sales_operational_problem', 'Which operational problem is causing the most impact?', 'operations'],
  ['sales_success', 'How will success be measured?', 'success'],
  ['sales_current_state', 'How is this done today?', 'technical'],
  ['sales_technologies', 'What technologies or providers are involved?', 'technical'],
  ['sales_pain', 'What are the major pain points?', 'business'],
  ['sales_scale', 'What broad scale is involved?', 'technical'],
  ['sales_availability', 'What availability or resilience is required?', 'resilience'],
].map(([id, question, category]) => ({ id, question, category, capabilities: [], stage: 'sales_discovery', importance: 'high' }))

export function getDiscoveryQuestions(capabilityIds, limit = 8) {
  const capabilitySet = new Set(capabilityIds)
  const matched = discoveryQuestions.filter((item) => item.capabilities.some((id) => capabilitySet.has(id)))
  return [...coreSalesQuestions.slice(0, 3), ...matched].slice(0, limit)
}
