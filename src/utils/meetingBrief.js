function scoreItem(item, keywords) {
  const normalisedItem = item.toLowerCase()

  return keywords.reduce((score, keyword) => {
    return score + (normalisedItem.includes(keyword.toLowerCase()) ? 1 : 0)
  }, 0)
}

export function selectRelevantItems(items, keywords, count = 3, fallbackCount = count) {
  const scoredItems = items.map((item, index) => ({ item, index, score: scoreItem(item, keywords) }))

  if (!scoredItems.some(({ score }) => score > 0)) {
    return items.slice(0, fallbackCount)
  }

  return scoredItems
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .map(({ item }) => item)
}

export function createMeetingBrief(sector, priority, stage, journeyState = null, presalesRecommendation = null, navigatorReference = null) {
  const brief = {
    navigatorReference,
    sector,
    priority,
    stage,
    challenges: selectRelevantItems(sector.challenges, priority.keywords, 3, 2),
    outcomes: selectRelevantItems(sector.outcomes, priority.keywords, 3, 2),
    capabilities: selectRelevantItems(sector.capabilities, priority.keywords, 3, 2),
    questions: selectRelevantItems(sector.questions, priority.keywords),
  }

  if (!journeyState?.primarySituationId) return brief

  const capabilityIds = journeyState.selectedCapabilityIds ?? []
  return {
    ...brief,
    journeyContext: {
      primarySituation: findTaxonomyItem(customerSituations, journeyState.primarySituationId)?.label,
      primaryOutcome: findTaxonomyItem(businessOutcomes, journeyState.primaryOutcomeId)?.label,
      outcomes: journeyState.businessOutcomeIds.map((id) => findTaxonomyItem(businessOutcomes, id)?.label).filter(Boolean),
      themes: journeyState.transformationThemeIds.map((id) => findTaxonomyItem(transformationThemes, id)?.label).filter(Boolean),
    },
    journeyCapabilities: capabilityIds.map((id) => findTaxonomyItem(vodafoneCapabilities, id)?.label).filter(Boolean),
    vodafoneAngles: capabilityIds.map((id) => ({ label: findTaxonomyItem(vodafoneCapabilities, id)?.label, angle: capabilityKnowledge[id]?.angle })).filter((item) => item.label && item.angle),
    journeyQuestions: getDiscoveryQuestions(capabilityIds, 8).map((item) => item.question),
    presalesGuidance: presalesRecommendation,
    nextStep: presalesRecommendation?.nextAction ?? 'Discovery Session',
  }
}

function formatBulletList(items, ordered = false) {
  return items.map((item, index) => `${ordered ? `${index + 1}.` : '-'} ${item}`).join('\n')
}

export function formatMeetingBrief(brief) {
  const content = [
    'Sector Sales Enablement — Meeting Brief',
    ...(brief.navigatorReference ? ['', 'Navigator Reference:', brief.navigatorReference] : []),
    '',
    'Sector:',
    brief.sector.name,
    '',
    'Priority:',
    brief.priority.label,
    '',
    'Conversation Stage:',
    brief.stage.label,
    '',
    'Likely Customer Challenges:',
    formatBulletList(brief.challenges),
    '',
    'Business Outcomes:',
    formatBulletList(brief.outcomes),
    '',
    'Vodafone Angles:',
    formatBulletList(brief.capabilities),
    '',
    'Discovery Questions:',
    formatBulletList(brief.questions, true),
    '',
    'Conversation Guidance:',
    brief.stage.guidance,
    formatBulletList(brief.stage.behaviours),
  ]

  if (brief.journeyContext) {
    content.push(
      '', 'Primary Business Situation:', brief.journeyContext.primarySituation,
      '', 'Primary Business Outcome:', brief.journeyContext.primaryOutcome ?? 'Not captured yet',
      '', 'Transformation Themes:', formatBulletList(brief.journeyContext.themes),
      '', 'Relevant Vodafone Capability Areas:', formatBulletList(brief.journeyCapabilities),
      '', 'Vodafone Angles to Consider:', formatBulletList(brief.vodafoneAngles.map((item) => `${item.label}: ${item.angle}`)),
      '', 'Additional Discovery Questions:', formatBulletList(brief.journeyQuestions, true),
      '', 'Presales Engagement Guidance:', brief.presalesGuidance?.headline ?? 'Continue Sales discovery',
      '', 'Recommended Next Step:', brief.nextStep,
    )
  }

  return content.join('\n')
}
import { capabilityKnowledge } from '../data/capabilityKnowledge.js'
import { getDiscoveryQuestions } from '../data/discoveryQuestions.js'
import { businessOutcomes, customerSituations, findTaxonomyItem, transformationThemes, vodafoneCapabilities } from '../data/journeyTaxonomies.js'
