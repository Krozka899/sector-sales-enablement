import { sectors } from './sectors.js'
import { capabilityKnowledge } from './capabilityKnowledge.js'

export const journeySectors = sectors

export const vodafoneCapabilities = Object.entries(capabilityKnowledge).map(([id, knowledge]) => ({ id, label: knowledge.label }))

export const businessOutcomes = [
  { id: 'grow_revenue', label: 'Grow Revenue' },
  { id: 'reduce_cost', label: 'Reduce Cost' },
  { id: 'improve_security', label: 'Improve Security' },
  { id: 'increase_resilience', label: 'Increase Resilience' },
  { id: 'accelerate_transformation', label: 'Accelerate Transformation' },
]

export const transformationThemes = [
  { id: 'cloud_ai_transformation', label: 'Cloud & AI Transformation' },
  { id: 'network_modernisation', label: 'Network Modernisation' },
  { id: 'security_transformation', label: 'Security Transformation' },
  { id: 'workforce_transformation', label: 'Workforce Transformation' },
  { id: 'operational_efficiency', label: 'Operational Efficiency' },
  { id: 'business_resilience', label: 'Business Resilience' },
]

export const customerSituations = [
  { id: 'costs_are_increasing', label: 'Our costs are increasing' },
  { id: 'too_many_suppliers', label: 'We have too many suppliers' },
  { id: 'sites_keep_losing_connectivity', label: 'Our sites keep losing connectivity' },
  { id: 'moving_to_cloud', label: "We're moving applications to cloud" },
  { id: 'cyber_security_concerns', label: "We're concerned about cyber security" },
  { id: 'data_centre_exit', label: "We're closing or consolidating a data centre" },
  { id: 'resilience_improvement', label: 'We need better resilience' },
  { id: 'ai_adoption', label: 'We want to use AI' },
  { id: 'opening_new_locations', label: "We're opening new or temporary locations" },
  { id: 'ageing_infrastructure', label: 'Our infrastructure is ageing' },
  { id: 'distributed_workforce', label: 'Our workforce is becoming more distributed' },
  { id: 'cloud_cost_concerns', label: 'Cloud costs are difficult to control' },
  { id: 'poor_application_performance', label: 'Users are experiencing poor application performance' },
  { id: 'network_complexity', label: 'Our network is becoming difficult to manage' },
  { id: 'regulatory_compliance', label: 'Compliance or governance requirements are increasing' },
  { id: 'acquisition_integration', label: 'We are acquiring or integrating businesses' },
  { id: 'skills_resource_constraints', label: "We don't have enough specialist resource" },
  { id: 'operational_visibility', label: 'We need better operational visibility' },
  { id: 'modernise_collaboration', label: 'We need to modernise voice and collaboration' },
  { id: 'connect_assets', label: 'We need better visibility or connectivity for assets' },
]

export const presalesSections = [
  'Common Technical Discovery',
  'Capability-Specific Discovery',
  'Requirements',
  'Risks',
  'Assumptions',
  'Dependencies',
  'Specialists',
  'Workshop Recommendation',
  'Solution-Shaping Pack',
]

export function findTaxonomyItem(items, id) {
  return items.find((item) => item.id === id)
}
