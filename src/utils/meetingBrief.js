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

export function createMeetingBrief(sector, priority, stage) {
  return {
    sector,
    priority,
    stage,
    challenges: selectRelevantItems(sector.challenges, priority.keywords, 3, 2),
    outcomes: selectRelevantItems(sector.outcomes, priority.keywords, 3, 2),
    capabilities: selectRelevantItems(sector.capabilities, priority.keywords, 3, 2),
    questions: selectRelevantItems(sector.questions, priority.keywords),
  }
}

function formatBulletList(items, ordered = false) {
  return items.map((item, index) => `${ordered ? `${index + 1}.` : '-'} ${item}`).join('\n')
}

export function formatMeetingBrief(brief) {
  return [
    'Sector Sales Enablement — Meeting Brief',
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
  ].join('\n')
}
