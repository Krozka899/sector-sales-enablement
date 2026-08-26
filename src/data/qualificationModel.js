export const understandingOptions = [
  { id: 'yes', label: 'Yes' },
  { id: 'partial', label: 'Partial' },
  { id: 'no', label: 'No' },
  { id: 'unknown', label: 'Unknown' },
]

export const yesNoUnknownOptions = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'unknown', label: 'Unknown' },
]

const horizons = [
  ['immediate', 'Immediate'], ['under_3_months', 'Under 3 months'], ['3_to_6_months', '3–6 months'],
  ['6_to_12_months', '6–12 months'], ['over_12_months', 'Over 12 months'], ['unknown', 'Unknown'],
].map(([id, label]) => ({ id, label }))

const statusField = (id, label) => ({ id, label, type: 'single', options: understandingOptions, gapValues: ['no'] })
const yesNoField = (id, label, gapWhenNo = false) => ({ id, label, type: 'single', options: yesNoUnknownOptions, gapValues: gapWhenNo ? ['no'] : [] })
const optionField = (id, label, options, gapValues = []) => ({ id, label, type: 'single', options: options.map(([optionId, optionLabel]) => ({ id: optionId, label: optionLabel })), gapValues })
const multiField = (id, label, options) => ({ id, label, type: 'multi', options: options.map(([optionId, optionLabel]) => ({ id: optionId, label: optionLabel })) })

export const qualificationSections = [
  {
    id: 'business', label: 'Business', description: 'Confirm the problem, urgency, impact and intended outcome.',
    fields: [
      statusField('problem_understood', 'Business problem understood?'), statusField('why_now_understood', 'Why now understood?'),
      statusField('impact_understood', 'Business impact understood?'), statusField('outcomes_selected', 'Desired outcomes selected?'),
      statusField('success_understood', 'Success criteria understood?'), statusField('consequence_understood', 'Consequence of doing nothing understood?'),
    ],
  },
  {
    id: 'need', label: 'Need', description: 'Establish the current pain and desired future state.',
    fields: [
      statusField('need_defined', 'Need clearly defined?'), statusField('pain_understood', 'Current pain understood?'),
      statusField('future_state_understood', 'Desired future state understood?'), statusField('priority_confirmed', 'Business priority confirmed?'),
      yesNoField('programme_involved', 'Transformation programme involved?'),
    ],
  },
  {
    id: 'technical', label: 'Technical', description: 'High-level Sales discovery only; detailed design remains with Presales.',
    fields: [
      statusField('environment_understood', 'Current environment understood?'), statusField('providers_understood', 'Existing providers understood?'),
      statusField('critical_workloads_understood', 'Critical applications or workloads understood?'), statusField('resilience_identified', 'Resilience requirement understood?'),
      statusField('security_identified', 'Security requirements identified?'), statusField('compliance_identified', 'Compliance requirements identified?'),
      statusField('cloud_identified', 'Cloud involvement identified?'), statusField('operating_model_understood', 'Operational model understood?'),
    ],
  },
  {
    id: 'scale', label: 'Scale', description: 'Use anonymous ranges rather than exact estate details.',
    fields: [
      optionField('sites', 'Approximate number of sites', [['1', '1'], ['2_to_10', '2–10'], ['11_to_50', '11–50'], ['51_to_100', '51–100'], ['101_to_500', '101–500'], ['over_500', 'Over 500'], ['unknown', 'Unknown']]),
      optionField('users', 'Approximate number of users', [['under_100', 'Under 100'], ['100_to_500', '100–500'], ['501_to_1000', '501–1,000'], ['1001_to_5000', '1,001–5,000'], ['over_5000', 'Over 5,000'], ['unknown', 'Unknown']]),
    ],
  },
  {
    id: 'commercial', label: 'Commercial Readiness', description: 'Establish readiness without collecting monetary values.',
    fields: [
      yesNoField('budget_understood', 'Budget understood?', true),
      optionField('funding_status', 'Funding status', [['approved', 'Approved'], ['expected', 'Expected'], ['not_confirmed', 'Not confirmed'], ['unknown', 'Unknown']], ['not_confirmed']),
      yesNoField('commercial_model_understood', 'Commercial model understood?', true), yesNoField('renewal_relevant', 'Existing contract or renewal relevant?'),
      yesNoField('business_case_required', 'Business case required?'),
    ],
  },
  {
    id: 'procurement', label: 'Procurement', description: 'Clarify the route without collecting procurement contacts.',
    fields: [
      optionField('route_understood', 'Procurement route', [['understood', 'Understood'], ['not_understood', 'Not understood'], ['unknown', 'Unknown']], ['not_understood']),
      yesNoField('formal_rfp_expected', 'Formal RFP or RFQ expected?'), yesNoField('framework_involved', 'Framework involved?'),
      yesNoField('competitive_process', 'Competitive process expected?'), yesNoField('decision_process_understood', 'Decision process understood?', true),
    ],
  },
  {
    id: 'competition', label: 'Competition', description: 'Capture only high-level competitive context.',
    fields: [
      optionField('competition_status', 'Competition status', [['incumbent_only', 'Incumbent only'], ['competitive', 'Competitive'], ['likely_competitive', 'Likely competitive'], ['unknown', 'Unknown']]),
      optionField('provider_change', 'Current provider direction', [['retain', 'Retain'], ['replace', 'Replace'], ['consolidate', 'Consolidate'], ['unknown', 'Unknown']]),
    ],
  },
  {
    id: 'stakeholders', label: 'Stakeholders', description: 'Select roles only; never enter names or contact details.',
    fields: [
      multiField('roles', 'Stakeholder roles involved', [['executive_sponsor', 'Executive sponsor'], ['cio_cto', 'CIO / CTO'], ['infrastructure', 'Infrastructure'], ['network', 'Network'], ['cloud', 'Cloud'], ['security', 'Security'], ['operations', 'Operations'], ['finance', 'Finance'], ['procurement', 'Procurement'], ['transformation', 'Transformation'], ['business_owner', 'Business owner'], ['other_role', 'Other role'], ['unknown', 'Unknown']]),
      yesNoField('economic_buyer_identified', 'Economic buyer role identified?', true), yesNoField('technical_decision_maker_identified', 'Technical decision-maker role identified?', true),
    ],
  },
  {
    id: 'timescale', label: 'Timescale', description: 'Use safe ranges; no exact customer dates are required.',
    fields: [
      { id: 'decision_horizon', label: 'Decision horizon', type: 'single', options: horizons },
      { id: 'live_horizon', label: 'Required live horizon', type: 'single', options: horizons },
      optionField('driver', 'Primary driver', [['renewal', 'Renewal'], ['transformation', 'Transformation'], ['regulation', 'Regulation'], ['migration', 'Migration'], ['acquisition', 'Acquisition'], ['growth', 'Growth'], ['operational_issue', 'Operational issue'], ['security', 'Security'], ['data_centre_exit', 'Data centre exit'], ['new_sites', 'New sites'], ['other_structured', 'Other structured driver'], ['unknown', 'Unknown']]),
    ],
  },
  {
    id: 'success', label: 'Success Criteria', description: 'Select the outcomes that would demonstrate success.',
    fields: [multiField('criteria', 'Success criteria', [['improved_availability', 'Improved availability'], ['better_application_performance', 'Better application performance'], ['reduced_operational_complexity', 'Reduced operational complexity'], ['lower_cost', 'Lower cost'], ['improved_security', 'Improved security'], ['faster_change', 'Faster change'], ['cloud_enablement', 'Cloud enablement'], ['improved_user_experience', 'Improved user experience'], ['improved_visibility', 'Improved visibility'], ['supplier_simplification', 'Supplier simplification'], ['improved_resilience', 'Improved resilience'], ['faster_site_deployment', 'Faster site deployment'], ['regulatory_compliance', 'Regulatory compliance'], ['workforce_productivity', 'Workforce productivity'], ['automation', 'Automation'], ['growth_enablement', 'Growth enablement']])],
  },
  {
    id: 'constraints', label: 'Constraints', description: 'Record only controlled constraint categories.',
    fields: [multiField('items', 'Known constraints', [['existing_contract', 'Existing contract'], ['budget_constraint', 'Budget constraint'], ['implementation_timeline', 'Implementation timeline'], ['skills_gap', 'Skills gap'], ['legacy_technology', 'Legacy technology'], ['compliance', 'Compliance'], ['sovereignty', 'Sovereignty'], ['limited_internal_resource', 'Limited internal resource'], ['third_party_dependency', 'Third-party dependency'], ['site_access', 'Site access'], ['technology_dependency', 'Technology dependency'], ['migration_complexity', 'Migration complexity'], ['none_identified', 'None identified'], ['unknown', 'Unknown']])],
  },
  {
    id: 'risk', label: 'Risk', description: 'Capture high-level categories without confidential descriptions.',
    fields: [multiField('items', 'Potential risks', [['unclear_requirement', 'Unclear requirement'], ['aggressive_timeline', 'Aggressive timeline'], ['multiple_dependencies', 'Multiple dependencies'], ['complex_migration', 'Complex migration'], ['compliance_risk', 'Compliance risk'], ['security_risk', 'Security risk'], ['commercial_uncertainty', 'Commercial uncertainty'], ['procurement_uncertainty', 'Procurement uncertainty'], ['stakeholder_alignment', 'Stakeholder alignment'], ['technical_complexity', 'Technical complexity'], ['operational_change', 'Operational change'], ['none_identified', 'None identified']])],
  },
  {
    id: 'presales_readiness', label: 'Presales Readiness', description: 'Identify the kind of technical support likely to be needed.',
    fields: [
      yesNoField('requirements_unclear', 'Customer requirements still unclear?'), yesNoField('workshop_needed', 'Technical workshop likely needed?'),
      yesNoField('architecture_needed', 'Architecture or design required?'), yesNoField('third_parties_involved', 'Third parties involved?'),
      yesNoField('service_requirements', 'Service or SLA requirements need definition?'),
    ],
  },
]

export function createInitialQualification() {
  return Object.fromEntries(qualificationSections.map((section) => [section.id, {}]))
}
