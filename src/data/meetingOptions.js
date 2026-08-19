export const meetingPriorities = [
  {
    id: 'reliable-connectivity',
    label: 'Reliable Connectivity',
    icon: 'wifi',
    keywords: ['connectivity', 'network', 'availability', 'signal', 'coverage', 'sites', 'fixed', 'mobile', 'wan', '5g'],
  },
  {
    id: 'operational-resilience',
    label: 'Operational Resilience',
    icon: 'shield-check',
    keywords: ['downtime', 'outage', 'disruption', 'continuity', 'resilience', 'resilient', 'availability', 'critical', 'failover', 'risk'],
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'lock',
    keywords: ['secure', 'security', 'cybersecurity', 'risk', 'data', 'access', 'devices', 'sase', 'ot', 'payment'],
  },
  {
    id: 'digital-transformation',
    label: 'Digital Transformation',
    icon: 'cloud-cog',
    keywords: ['legacy', 'cloud', 'digital', 'transformation', 'scaling', 'applications', 'platforms', 'edge', 'modernisation'],
  },
  {
    id: 'workforce-productivity',
    label: 'Workforce Productivity',
    icon: 'users',
    keywords: ['employees', 'drivers', 'field teams', 'collaboration', 'mobile workforce', 'communications', 'productivity', 'users', 'colleagues'],
  },
  {
    id: 'iot-connected-operations',
    label: 'IoT & Connected Operations',
    icon: 'radio-tower',
    keywords: ['iot', 'assets', 'machinery', 'tracking', 'sensors', 'vehicles', 'connected', 'equipment', 'telemetry', 'monitoring'],
  },
]

export const conversationStages = [
  {
    id: 'early-discovery',
    label: 'Early Discovery',
    description: 'Use when the customer challenge is still being understood.',
    icon: 'search',
    guidance: 'Focus on understanding the business problem before discussing solutions.',
    behaviours: [
      'Lead with Discovery Questions.',
      'Understand operational impact.',
      'Clarify what happens if nothing changes.',
    ],
  },
  {
    id: 'opportunity-shaping',
    label: 'Opportunity Shaping',
    description: 'Use when Sales is connecting customer needs to possible solution areas.',
    icon: 'shapes',
    guidance: 'Connect the customer challenge to measurable business outcomes and relevant Vodafone capabilities.',
    behaviours: [
      'Confirm desired outcomes.',
      'Identify wider solution areas.',
      'Engage Presales early where multiple technologies are involved.',
    ],
  },
  {
    id: 'solution-validation',
    label: 'Solution Validation',
    description: 'Use when technical confidence, architecture or objections need to be addressed.',
    icon: 'badge-check',
    guidance: 'Build technical confidence and remove barriers to customer decision-making.',
    behaviours: [
      'Validate architecture.',
      'Address technical objections.',
      'Confirm resilience, security and operational requirements.',
    ],
  },
]
