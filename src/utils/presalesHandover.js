import { businessImpacts, whyNowTriggers } from '../data/discoveryTaxonomies.js'
import { businessOutcomes, customerSituations, findTaxonomyItem, journeySectors, transformationThemes, vodafoneCapabilities } from '../data/journeyTaxonomies.js'
import { conversationStages } from '../data/meetingOptions.js'

function labelsFor(items, ids = []) {
  return ids.map((id) => findTaxonomyItem(items, id)?.label).filter(Boolean)
}

export function createPresalesHandover(journeyState, qualificationSummary, presalesRecommendation) {
  return {
    context: {
      sector: findTaxonomyItem(journeySectors, journeyState.sectorId)?.label ?? 'Not captured yet',
      primarySituation: findTaxonomyItem(customerSituations, journeyState.primarySituationId)?.label ?? 'Not captured yet',
      supportingSituations: labelsFor(customerSituations, journeyState.supportingSituationIds),
      whyNow: labelsFor(whyNowTriggers, journeyState.whyNowIds),
      businessImpact: labelsFor(businessImpacts, journeyState.businessImpactIds),
      primaryOutcome: findTaxonomyItem(businessOutcomes, journeyState.primaryOutcomeId)?.label ?? 'Not captured yet',
      otherOutcomes: labelsFor(businessOutcomes, journeyState.businessOutcomeIds.filter((id) => id !== journeyState.primaryOutcomeId)),
      transformationThemes: labelsFor(transformationThemes, journeyState.transformationThemeIds),
      capabilities: labelsFor(vodafoneCapabilities, journeyState.selectedCapabilityIds),
      conversationStage: findTaxonomyItem(conversationStages, journeyState.conversationStageId)?.label ?? 'Not captured yet',
    },
    discoveryCompleted: qualificationSummary.sections.filter((section) => section.status === 'complete').map((section) => section.label),
    qualification: qualificationSummary.sections,
    discoveryGaps: qualificationSummary.gaps,
    presalesEngagement: presalesRecommendation,
    recommendedNextAction: presalesRecommendation.nextAction,
  }
}
