export const discoveryStatusOptions = [
  ['understood', 'Understood'], ['partially_understood', 'Partially understood'], ['gap', 'Gap'], ['unknown', 'Unknown'], ['not_applicable', 'Not applicable'],
].map(([id, label]) => ({ id, label }))

const yesNoUnknown = [['yes', 'Yes'], ['no', 'No'], ['unknown', 'Unknown']]
const yesPartialNoUnknown = [['yes', 'Yes'], ['partial', 'Partial'], ['no', 'No'], ['unknown', 'Unknown']]
const option = (id, label, values) => ({ id, label, type: 'single', options: values.map(([value, text]) => ({ id: value, label: text })) })
const multi = (id, label, values) => ({ id, label, type: 'multi', options: values.map(([value, text]) => ({ id: value, label: text })) })
const ynu = (id, label) => option(id, label, yesNoUnknown)
const statusField = option('discovery_status', 'Discovery area status', discoveryStatusOptions.map(({ id, label }) => [id, label]))
const section = (id, label, group, fields) => ({ id, label, group, fields: [statusField, ...fields] })

const sites = [['1', '1'], ['2_to_10', '2–10'], ['11_to_50', '11–50'], ['51_to_100', '51–100'], ['101_to_500', '101–500'], ['over_500', 'Over 500'], ['unknown', 'Unknown']]
const users = [['under_100', 'Under 100'], ['100_to_500', '100–500'], ['501_to_1000', '501–1,000'], ['1001_to_5000', '1,001–5,000'], ['over_5000', 'Over 5,000'], ['unknown', 'Unknown']]

export const commonDiscoverySections = [
  section('current_environment', 'Current Environment', 'technical', [
    option('hosting_model', 'Hosting model', [['on_premises', 'On-premises'], ['public_cloud', 'Public cloud'], ['private_cloud', 'Private cloud'], ['colocation', 'Colocation'], ['hybrid', 'Hybrid'], ['multi_cloud', 'Multi-cloud'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    multi('cloud_platforms', 'Cloud platforms', [['azure', 'Azure'], ['aws', 'AWS'], ['gcp', 'GCP'], ['other_cloud', 'Other cloud'], ['none', 'None'], ['unknown', 'Unknown']]),
    option('network_model', 'Network model', [['mpls_ipvpn', 'MPLS / IPVPN'], ['internet_vpn', 'Internet VPN'], ['sd_wan', 'SD-WAN'], ['direct_internet', 'Direct internet'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    option('security_model', 'Security model', [['centralised', 'Centralised'], ['distributed', 'Distributed'], ['cloud_delivered', 'Cloud delivered'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    option('operations_model', 'Operations model', [['customer_managed', 'Customer managed'], ['supplier_managed', 'Supplier managed'], ['co_managed', 'Co-managed'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
  ]),
  section('architecture_model', 'Architecture Model', 'technical', [multi('patterns', 'Generic architecture patterns', [['centralised', 'Centralised'], ['distributed', 'Distributed'], ['hub_and_spoke', 'Hub and spoke'], ['cloud_centric', 'Cloud centric'], ['hybrid', 'Hybrid'], ['branch_heavy', 'Branch heavy'], ['remote_site_heavy', 'Remote-site heavy'], ['edge_enabled', 'Edge enabled'], ['multi_region', 'Multi-region'], ['mixed', 'Mixed'], ['unknown', 'Unknown']])]),
  section('scale', 'Scale', 'technical', [
    option('sites', 'Site range', sites), option('users', 'User range', users),
    option('workloads', 'Workload range', [['under_10', 'Under 10'], ['10_to_50', '10–50'], ['51_to_200', '51–200'], ['201_to_500', '201–500'], ['over_500', 'Over 500'], ['unknown', 'Unknown']]),
    option('data_scale', 'Data scale', [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large'], ['very_large', 'Very large'], ['unknown', 'Unknown']]),
  ]),
  section('availability_resilience', 'Availability / Resilience', 'technical', [
    option('business_criticality', 'Business criticality', [['standard', 'Standard'], ['important', 'Important'], ['business_critical', 'Business critical'], ['mission_critical', 'Mission critical'], ['unknown', 'Unknown']]),
    option('availability_expectation', 'Availability expectation', [['standard', 'Standard'], ['high_availability', 'High availability'], ['multi_site_resilience', 'Multi-site resilience'], ['multi_region_resilience', 'Multi-region resilience'], ['unknown', 'Unknown']]),
    option('rto_requirement', 'RTO requirement', [['under_15_minutes', 'Under 15 minutes'], ['under_1_hour', 'Under 1 hour'], ['under_4_hours', 'Under 4 hours'], ['same_day', 'Same day'], ['next_business_day', 'Next business day'], ['unknown', 'Unknown']]),
    option('rpo_requirement', 'RPO requirement', [['near_zero', 'Near zero'], ['under_15_minutes', 'Under 15 minutes'], ['under_1_hour', 'Under 1 hour'], ['under_4_hours', 'Under 4 hours'], ['same_day', 'Same day'], ['unknown', 'Unknown']]),
    ynu('backup_connectivity_required', 'Backup connectivity required?'), ynu('disaster_recovery_required', 'Disaster recovery required?'),
  ]),
  section('security', 'Security', 'security', [
    ynu('identity_dependency', 'Identity dependency?'), option('zero_trust_requirement', 'Zero Trust requirement', [['yes', 'Yes'], ['no', 'No'], ['emerging', 'Emerging'], ['unknown', 'Unknown']]),
    ynu('network_segmentation_required', 'Network segmentation required?'), option('encryption_requirement', 'Encryption requirement', [['in_transit', 'In transit'], ['at_rest', 'At rest'], ['both', 'Both'], ['standard_controls', 'Standard controls'], ['unknown', 'Unknown']]),
    ynu('security_monitoring_required', 'Security monitoring required?'), ynu('secure_remote_access_required', 'Secure remote access required?'), ynu('managed_security_interest', 'Managed security interest?'),
  ]),
  section('compliance_governance', 'Compliance / Governance', 'governance', [multi('categories', 'Applicable categories', [['data_residency', 'Data residency'], ['sovereignty', 'Sovereignty'], ['regulatory_compliance', 'Regulatory compliance'], ['industry_standard', 'Industry standard'], ['internal_governance', 'Internal governance'], ['security_assurance', 'Security assurance'], ['audit_requirement', 'Audit requirement'], ['none_identified', 'None identified'], ['unknown', 'Unknown']])]),
  section('connectivity', 'Connectivity', 'technical', [
    option('site_range', 'Number of sites range', sites),
    multi('access_types', 'Access types', [['fibre', 'Fibre'], ['ethernet', 'Ethernet'], ['internet', 'Internet'], ['mobile', 'Mobile'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    ynu('private_cloud_connectivity_required', 'Private cloud connectivity required?'), ynu('internet_breakout_required', 'Internet breakout required?'), ynu('diverse_routing_required', 'Diverse routing required?'),
    ynu('backup_connectivity_required', 'Backup connectivity required?'),
    option('bandwidth_range', 'Bandwidth range', [['under_100mbps', 'Under 100 Mbps'], ['100mbps_to_1gbps', '100 Mbps–1 Gbps'], ['1_to_10gbps', '1–10 Gbps'], ['over_10gbps', 'Over 10 Gbps'], ['mixed', 'Mixed'], ['unknown', 'Unknown']]),
    ynu('bandwidth_growth_expected', 'Bandwidth growth expected?'), ynu('application_prioritisation_required', 'Application prioritisation required?'), ynu('network_visibility_required', 'Network visibility required?'),
    ynu('resilience_required', 'Connectivity resilience required?'), ynu('migration_renewal_relevant', 'Migration or renewal relevant?'),
  ]),
  section('cloud', 'Cloud', 'technical', [
    option('cloud_strategy', 'Cloud strategy', [['single_cloud', 'Single cloud'], ['multi_cloud', 'Multi-cloud'], ['hybrid', 'Hybrid'], ['cloud_first', 'Cloud first'], ['workload_specific', 'Workload specific'], ['early_stage', 'Early stage'], ['unknown', 'Unknown']]),
    ynu('migration_involved', 'Migration involved?'), option('governance_defined', 'Governance defined?', [['defined', 'Defined'], ['partial', 'Partial'], ['undefined', 'Undefined'], ['unknown', 'Unknown']]), option('landing_zone_present', 'Landing zone present?', yesPartialNoUnknown),
    ynu('cost_governance_required', 'Cost governance required?'), ynu('private_connectivity_required', 'Private connectivity required?'), ynu('managed_cloud_required', 'Managed cloud required?'),
  ]),
  section('operations', 'Operations', 'operations', [ynu('monitoring_required', 'Monitoring required?'), ynu('operational_visibility_required', 'Operational visibility required?'), ynu('supplier_simplification_required', 'Supplier simplification required?')]),
  section('migration_change', 'Migration / Change', 'migration', [
    multi('strategy', 'Migration strategy patterns', [['rehost', 'Rehost'], ['replatform', 'Replatform'], ['refactor', 'Refactor'], ['replace', 'Replace'], ['retire', 'Retire'], ['retain', 'Retain'], ['mixed', 'Mixed'], ['not_yet_defined', 'Not yet defined'], ['unknown', 'Unknown']]),
    option('complexity', 'Change complexity', [['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['very_high', 'Very high'], ['unknown', 'Unknown']]),
    option('wave_model', 'Migration wave model', [['single_event', 'Single event'], ['phased', 'Phased'], ['site_by_site', 'Site by site'], ['workload_by_workload', 'Workload by workload'], ['unknown', 'Unknown']]),
  ]),
  section('service_management', 'Service Management', 'operations', [ynu('service_management_required', 'Service management required?'), ynu('reporting_required', 'Reporting required?'), ynu('governance_required', 'Service governance required?')]),
  section('support', 'Support', 'operations', [
    option('support_model', 'Support model', [['customer_operated', 'Customer operated'], ['managed_service', 'Managed service'], ['co_managed', 'Co-managed'], ['not_defined', 'Not defined'], ['unknown', 'Unknown']]),
    option('coverage', 'Support coverage', [['business_hours', 'Business hours'], ['extended_hours', 'Extended hours'], ['always_on', 'Always on'], ['not_defined', 'Not defined'], ['unknown', 'Unknown']]),
  ]),
]

export const assumptionOptions = [
  ['customer_internal_resources_available', 'Internal resources will be available'], ['existing_connectivity_available', 'Existing connectivity is available'],
  ['cloud_environment_available', 'Cloud environment is available'], ['identity_platform_available', 'Identity platform is available'], ['migration_window_available', 'Migration window will be available'],
  ['contract_allows_change', 'Existing contract allows change'], ['application_owners_available', 'Application-owner roles will be available'],
  ['security_review_required', 'Security review is required'], ['delivery_dependencies_exist', 'Delivery dependencies exist'], ['none_identified', 'None identified'],
].map(([id, label]) => ({ id, label }))

export const assumptionStatuses = [['accepted', 'Accepted'], ['needs_validation', 'Needs validation'], ['not_applicable', 'Not applicable']].map(([id, label]) => ({ id, label }))

export const technicalRiskOptions = [
  'unclear_architecture', 'incomplete_requirements', 'unsupported_dependency', 'resilience_gap', 'migration_complexity', 'security_dependency', 'compliance_dependency',
  'third_party_dependency', 'connectivity_lead_time', 'cloud_readiness', 'skills_gap', 'aggressive_timeline', 'operational_change', 'legacy_constraint', 'unknown_capacity',
].map((id) => ({ id, label: id.replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase()) }))

export const dependencyOptions = [
  'identity', 'network', 'cloud', 'security', 'data_centre', 'third_party_supplier', 'customer_internal_team', 'procurement', 'delivery', 'service_management',
  'application_team', 'data_platform', 'compliance', 'commercial', 'none_identified',
].map((id) => ({ id, label: id.replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase()) }))

export const riskImpactOptions = [['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['unknown', 'Unknown']].map(([id, label]) => ({ id, label }))

export { multi, option, section, sites, users, ynu }
