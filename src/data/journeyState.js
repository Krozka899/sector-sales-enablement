import { createInitialQualification } from './qualificationModel.js'

export function createEmptyJourneyState() {
  return {
    mode: 'sales',
    journeyStage: 'explore',
    lastSalesStage: 'explore',
    sectorId: null,
    primarySituationId: null,
    supportingSituationIds: [],
    whyNowIds: [],
    businessImpactIds: [],
    businessOutcomeIds: [],
    primaryOutcomeId: null,
    transformationThemeIds: [],
    selectedCapabilityIds: [],
    conversationStageId: null,
    qualification: createInitialQualification(),
    technicalDiscovery: {
      common: {},
      capabilities: {},
      presalesAddedCapabilityIds: [],
      assumptions: {},
      risks: {},
      dependencies: [],
    },
    presalesRequired: null,
    handoverStatus: 'not_started',
  }
}

export function normaliseJourneyState(savedState) {
  const empty = createEmptyJourneyState()
  if (!savedState || typeof savedState !== 'object') return empty
  return {
    ...empty,
    ...savedState,
    qualification: { ...empty.qualification, ...savedState.qualification },
    technicalDiscovery: {
      ...empty.technicalDiscovery,
      ...savedState.technicalDiscovery,
      common: { ...empty.technicalDiscovery.common, ...savedState.technicalDiscovery?.common },
      capabilities: { ...empty.technicalDiscovery.capabilities, ...savedState.technicalDiscovery?.capabilities },
      assumptions: { ...empty.technicalDiscovery.assumptions, ...savedState.technicalDiscovery?.assumptions },
      risks: { ...empty.technicalDiscovery.risks, ...savedState.technicalDiscovery?.risks },
    },
  }
}
