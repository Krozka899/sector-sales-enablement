import { discoveryStatusOptions, multi, option, sites, users, ynu } from './presalesDiscovery.js'
import { capabilityKnowledge } from './capabilityKnowledge.js'

const status = option('discovery_status', 'Discovery module status', discoveryStatusOptions.map(({ id, label }) => [id, label]))
const module = (id, fields, journey) => ({ id, label: capabilityKnowledge[id].label, fields: [status, ...fields], journey })
export const capabilityDiscoveryModules = {
  connectivity: module('connectivity', [
    multi('access_types', 'Access types', [['fibre', 'Fibre'], ['ethernet', 'Ethernet'], ['internet', 'Internet'], ['mobile', 'Mobile'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    option('site_count', 'Site count range', sites), ynu('resilience_required', 'Resilience required?'), ynu('diverse_routing', 'Diverse routing required?'), ynu('internet_required', 'Internet required?'),
    ynu('private_connectivity', 'Private connectivity required?'), ynu('critical_applications', 'Business-critical applications involved?'),
    option('bandwidth', 'Bandwidth category', [['under_100mbps', 'Under 100 Mbps'], ['100mbps_to_1gbps', '100 Mbps–1 Gbps'], ['1_to_10gbps', '1–10 Gbps'], ['over_10gbps', 'Over 10 Gbps'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    ynu('performance_issues', 'Performance issues present?'), ynu('provider_complexity', 'Multiple-provider complexity?'), ynu('contract_refresh', 'Contract refresh relevant?'),
    ynu('migration_required', 'Connectivity migration required?'), option('lead_time', 'Lead-time consideration', [['standard', 'Standard'], ['extended', 'Extended'], ['critical', 'Critical'], ['unknown', 'Unknown']]),
  ]),
  sd_wan: module('sd_wan', [
    option('current_wan', 'Current WAN type', [['mpls', 'MPLS'], ['internet_vpn', 'Internet VPN'], ['sd_wan', 'SD-WAN'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    ynu('multiple_providers', 'Multiple WAN providers?'), ynu('saas_performance_issue', 'SaaS or cloud performance issue?'), ynu('application_visibility', 'Application visibility required?'),
    ynu('application_prioritisation', 'Application prioritisation required?'), ynu('dynamic_path_selection', 'Dynamic path selection needed?'), option('branch_scale', 'Branch scale', sites),
    ynu('internet_breakout', 'Local internet breakout required?'), option('migration_complexity', 'Migration complexity', [['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['unknown', 'Unknown']]),
    ynu('mpls_dependency', 'Existing MPLS dependency?'), ynu('security_convergence', 'Security convergence interest?'),
    option('readiness_outcome', 'Readiness outcome', [['discovery_needed', 'Discovery needed'], ['candidate_for_assessment', 'Candidate for assessment'], ['technical_workshop_recommended', 'Technical workshop recommended'], ['migration_planning_required', 'Migration planning required']]),
  ], ['Explore', 'Assess', 'Experience', 'Prove', 'Deploy']),
  sase_sse: module('sase_sse', [
    ynu('hybrid_workforce', 'Hybrid workforce?'), ynu('secure_remote_access', 'Secure remote access required?'), ynu('identity_dependency', 'Identity dependency?'),
    option('zero_trust', 'Zero Trust objective', [['yes', 'Yes'], ['no', 'No'], ['emerging', 'Emerging'], ['unknown', 'Unknown']]), ynu('firewall_refresh', 'Firewall refresh relevant?'),
    ynu('fragmented_security', 'Fragmented security estate?'), ynu('cloud_security', 'Cloud-delivered security required?'),
    option('internet_breakout', 'Internet breakout model', [['centralised', 'Centralised'], ['local', 'Local'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    option('application_access', 'Application access model', [['private', 'Private applications'], ['saas', 'SaaS'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]), ynu('security_governance', 'Security governance defined?'),
  ]),
  cloud_hosting: module('cloud_hosting', [
    option('hosting_model', 'Current hosting model', [['on_premises', 'On-premises'], ['public_cloud', 'Public cloud'], ['private_cloud', 'Private cloud'], ['hybrid', 'Hybrid'], ['multi_cloud', 'Multi-cloud'], ['unknown', 'Unknown']]),
    multi('platforms', 'Cloud platforms', [['azure', 'Azure'], ['aws', 'AWS'], ['gcp', 'GCP'], ['other_cloud', 'Other cloud'], ['unknown', 'Unknown']]), ynu('migration', 'Migration involved?'),
    multi('workload_types', 'Workload categories', [['web_application', 'Web application'], ['business_application', 'Business application'], ['database', 'Database'], ['virtual_machines', 'Virtual machines'], ['containers', 'Containers'], ['data_platform', 'Data platform'], ['ai_workload', 'AI workload'], ['file_storage', 'File storage'], ['backup_archive', 'Backup / archive'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    option('landing_zone_maturity', 'Landing-zone maturity', [['defined', 'Defined'], ['partial', 'Partial'], ['undefined', 'Undefined'], ['unknown', 'Unknown']]),
    option('governance', 'Governance maturity', [['defined', 'Defined'], ['partial', 'Partial'], ['undefined', 'Undefined'], ['unknown', 'Unknown']]), ynu('cost_management', 'Cost management required?'),
    ynu('high_availability', 'High availability required?'), ynu('disaster_recovery', 'Disaster recovery required?'), ynu('security', 'Security requirements identified?'),
    ynu('compliance', 'Compliance requirements identified?'), ynu('private_connectivity', 'Private connectivity required?'), ynu('managed_operations', 'Managed operations required?'),
    ynu('data_centre_exit', 'Data centre exit involved?'), option('placement', 'Workload placement', [['cloud', 'Cloud'], ['private_cloud', 'Private cloud'], ['colocation', 'Colocation'], ['hybrid', 'Hybrid'], ['not_defined', 'Not defined'], ['unknown', 'Unknown']]),
  ]),
  colocation_data_centre: module('colocation_data_centre', [
    option('hosting_model', 'Current hosting model', [['on_premises', 'On-premises'], ['colocation', 'Colocation'], ['hybrid', 'Hybrid'], ['unknown', 'Unknown']]), ynu('consolidation', 'Consolidation involved?'),
    option('rack_range', 'Rack requirement', [['1_to_3', '1–3'], ['4_to_10', '4–10'], ['11_to_25', '11–25'], ['over_25', 'Over 25'], ['unknown', 'Unknown']]),
    option('power_category', 'Power category', [['standard', 'Standard'], ['high_density', 'High density'], ['ai_hpc', 'AI / HPC'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    ynu('resilience', 'Resilience required?'), ynu('connectivity', 'Connectivity required?'), ynu('cloud_interconnect', 'Cloud interconnect required?'), ynu('sovereignty', 'Sovereignty relevant?'), ynu('migration', 'Migration involved?'), ynu('growth', 'Capacity growth expected?'),
  ]),
  security: module('security', [
    option('primary_driver', 'Primary security driver', [['risk_reduction', 'Risk reduction'], ['compliance', 'Compliance'], ['transformation', 'Transformation'], ['refresh', 'Technology refresh'], ['incident_readiness', 'Incident readiness'], ['unknown', 'Unknown']]),
    ynu('compliance', 'Compliance involved?'), ynu('identity', 'Identity dependency?'), ynu('secure_access', 'Secure access required?'), ynu('network_security', 'Network security involved?'),
    ynu('cloud_security', 'Cloud security involved?'), ynu('monitoring', 'Security monitoring required?'), ynu('managed_security', 'Managed security required?'),
    ynu('incident_readiness', 'Incident readiness required?'), ynu('tool_complexity', 'Tool or vendor complexity?'),
  ]),
  unified_communications: module('unified_communications', [
    option('voice_importance', 'Voice importance', [['low', 'Low'], ['important', 'Important'], ['business_critical', 'Business critical'], ['unknown', 'Unknown']]),
    option('platform', 'Collaboration platform category', [['teams', 'Microsoft Teams'], ['other_cloud', 'Other cloud collaboration'], ['legacy', 'Legacy platform'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    ynu('hybrid_workforce', 'Hybrid workforce?'), ynu('legacy_pbx', 'Legacy PBX involved?'), ynu('integration', 'Integration required?'), option('user_scale', 'User scale', users),
    option('calling_model', 'Calling model', [['cloud', 'Cloud calling'], ['on_premises', 'On-premises'], ['hybrid', 'Hybrid'], ['unknown', 'Unknown']]), ynu('resilience', 'Voice resilience required?'),
    option('support_model', 'Support model', [['customer', 'Customer operated'], ['managed', 'Managed service'], ['co_managed', 'Co-managed'], ['unknown', 'Unknown']]),
  ]),
  mobile_5g: module('mobile_5g', [ynu('mobile_workforce', 'Mobile workforce?'), ynu('temporary_sites', 'Temporary sites required?'), ynu('backup_connectivity', 'Backup connectivity required?'), ynu('private_network', 'Private network interest?'), ynu('field_applications', 'Field applications involved?'), ynu('coverage_dependency', 'Coverage dependency understood?'), ynu('resilience', 'Resilience required?'), ynu('rapid_deployment', 'Rapid deployment required?')]),
  iot: module('iot', [
    multi('asset_types', 'Asset type categories', [['vehicles', 'Vehicles'], ['equipment', 'Equipment'], ['infrastructure', 'Infrastructure'], ['environmental', 'Environmental'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    option('mobility', 'Asset mobility', [['fixed', 'Fixed'], ['mobile', 'Mobile'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    option('telemetry', 'Telemetry frequency', [['real_time', 'Real time'], ['frequent', 'Frequent'], ['periodic', 'Periodic'], ['event_driven', 'Event driven'], ['unknown', 'Unknown']]),
    ynu('connectivity', 'Connectivity required?'), multi('environment', 'Coverage environment', [['indoor', 'Indoor'], ['outdoor', 'Outdoor'], ['remote', 'Remote'], ['industrial', 'Industrial'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    option('business_outcome', 'Primary outcome', [['visibility', 'Visibility'], ['efficiency', 'Efficiency'], ['automation', 'Automation'], ['safety', 'Safety'], ['unknown', 'Unknown']]),
    option('data_handling', 'Data handling', [['edge', 'Edge'], ['cloud', 'Cloud'], ['hybrid', 'Hybrid'], ['unknown', 'Unknown']]),
    option('asset_scale', 'Asset scale', [['under_100', 'Under 100'], ['100_to_1000', '100–1,000'], ['1001_to_10000', '1,001–10,000'], ['over_10000', 'Over 10,000'], ['unknown', 'Unknown']]),
    option('criticality', 'Operational criticality', [['standard', 'Standard'], ['important', 'Important'], ['critical', 'Critical'], ['unknown', 'Unknown']]),
  ]),
  managed_services: module('managed_services', [
    option('operations_model', 'Current operations model', [['customer', 'Customer managed'], ['supplier', 'Supplier managed'], ['co_managed', 'Co-managed'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    ynu('skills_gap', 'Skills gap present?'), ynu('monitoring', 'Monitoring required?'), ynu('incident_handling', 'Incident handling required?'), ynu('service_management', 'Service management required?'),
    ynu('reporting', 'Reporting required?'), ynu('governance', 'Governance required?'), ynu('supplier_consolidation', 'Supplier consolidation required?'),
    option('support_coverage', 'Support coverage', [['business_hours', 'Business hours'], ['extended', 'Extended hours'], ['always_on', 'Always on'], ['unknown', 'Unknown']]), ynu('transformation_support', 'Transformation support required?'),
  ]),
  ai_data: module('ai_data', [
    option('ai_stage', 'AI stage', [['exploring', 'Exploring'], ['proof_of_concept', 'Proof of concept'], ['pilot', 'Pilot'], ['production', 'Production'], ['scaling', 'Scaling'], ['unknown', 'Unknown']]),
    option('data_readiness', 'Data readiness', [['strong', 'Strong'], ['partial', 'Partial'], ['weak', 'Weak'], ['unknown', 'Unknown']]),
    option('infrastructure_readiness', 'AI infrastructure readiness', [['ready', 'Ready'], ['partial', 'Partial'], ['not_ready', 'Not ready'], ['unknown', 'Unknown']]),
    option('governance', 'AI governance', [['defined', 'Defined'], ['partial', 'Partial'], ['undefined', 'Undefined'], ['unknown', 'Unknown']]),
    ynu('cloud_dependency', 'Cloud dependency?'), ynu('security_requirement', 'Security requirement?'),
  ]),
}

export function createInitialTechnicalDiscovery() {
  return {
    common: {},
    capabilities: {},
    presalesAddedCapabilityIds: [],
    assumptions: {},
    risks: {},
    dependencies: [],
  }
}
