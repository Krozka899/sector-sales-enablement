import { capabilityDiscoveryModules } from '../data/capabilityDiscovery.js'
import { commonDiscoverySections } from '../data/presalesDiscovery.js'
import { qualificationSections } from '../data/qualificationModel.js'
import { createTechnicalFieldGaps } from './presalesDiscovery.js'

export const journeyStageOrder = ['explore', 'discover', 'shape', 'prepare', 'qualify', 'presales']

const stageLabels = {
  explore: 'Explore', discover: 'Discover', shape: 'Shape', prepare: 'Prepare', qualify: 'Qualify', presales: 'Presales',
}

function hasAnswer(value) {
  return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== ''
}

function ratio(addressed, expected) {
  return expected ? Math.round((addressed / expected) * 100) : 0
}

function statusForPercentage(percentage) {
  if (percentage === 100) return 'complete'
  if (percentage > 0) return 'partial'
  return 'not_started'
}

function qualificationProgress(state) {
  const sections = qualificationSections.map((section) => {
    const answers = state.qualification[section.id] ?? {}
    const addressed = section.fields.filter((field) => hasAnswer(answers[field.id])).length
    const percentage = ratio(addressed, section.fields.length)
    return { id: section.id, label: section.label, addressed, expected: section.fields.length, percentage, status: statusForPercentage(percentage) }
  })
  const addressed = sections.reduce((total, section) => total + section.addressed, 0)
  const expected = sections.reduce((total, section) => total + section.expected, 0)
  return { addressed, expected, percentage: ratio(addressed, expected), sections }
}

function presalesProgress(state) {
  const capabilityIds = [...new Set([...(state.selectedCapabilityIds ?? []), ...(state.technicalDiscovery.presalesAddedCapabilityIds ?? [])])]
  const common = commonDiscoverySections.map((section) => {
    const answers = state.technicalDiscovery.common[section.id] ?? {}
    const addressed = Object.hasOwn(answers, 'discovery_status') ? 1 : 0
    return { id: `common:${section.id}`, label: section.label, status: addressed ? 'complete' : 'not_started', addressed, expected: 1 }
  })
  const capabilities = capabilityIds.filter((id) => capabilityDiscoveryModules[id]).map((id) => {
    const answers = state.technicalDiscovery.capabilities[id] ?? {}
    const addressed = Object.hasOwn(answers, 'discovery_status') ? 1 : 0
    return { id: `capability:${id}`, label: capabilityDiscoveryModules[id].label, status: addressed ? 'complete' : 'not_started', addressed, expected: 1 }
  })
  const governance = [
    { id: 'assumptions', label: 'Assumptions', addressed: Object.keys(state.technicalDiscovery.assumptions).length ? 1 : 0 },
    { id: 'risks', label: 'Risks', addressed: Object.keys(state.technicalDiscovery.risks).length ? 1 : 0 },
    { id: 'dependencies', label: 'Dependencies', addressed: state.technicalDiscovery.dependencies.length ? 1 : 0 },
  ].map((item) => ({ ...item, expected: 1, status: item.addressed ? 'complete' : 'not_started' }))
  const sections = [
    { id: 'context', label: 'Context from Sales', addressed: state.handoverStatus === 'viewed' ? 1 : 0, expected: 1, status: state.handoverStatus === 'viewed' ? 'complete' : 'not_started' },
    ...common,
    ...capabilities,
    ...governance,
  ]
  const addressed = sections.reduce((total, section) => total + section.addressed, 0)
  const expected = sections.reduce((total, section) => total + section.expected, 0)
  return { addressed, expected, percentage: ratio(addressed, expected), sections, capabilityIds }
}

function salesGaps(state, qualification, currentStageIndex) {
  const gaps = []
  const add = (stage, sectionId, label, status = 'Not answered') => gaps.push({ id: `${stage}:${sectionId}`, stage, sectionId, label, status })
  if (currentStageIndex >= 0 && !state.sectorId) add('explore', 'sector', 'Sector context')
  if (currentStageIndex >= 1) {
    if (!state.primarySituationId) add('discover', 'situation', 'Primary customer situation')
    if (!state.whyNowIds.length) add('discover', 'why_now', 'What is driving the need now')
    if (!state.businessImpactIds.length) add('discover', 'business_impact', 'Impact if nothing changes')
  }
  if (currentStageIndex >= 2) {
    if (!state.primaryOutcomeId) add('shape', 'outcomes', 'Primary business outcome')
    if (!state.transformationThemeIds.length) add('shape', 'themes', 'Transformation themes')
    if (!state.selectedCapabilityIds.length) add('shape', 'capabilities', 'Capabilities to explore')
  }
  if (currentStageIndex >= 3 && !state.conversationStageId) add('prepare', 'conversation', 'Conversation stage')
  if (currentStageIndex >= 4) {
    qualification.sections.forEach((section) => {
      if (section.percentage === 100) return
      add('qualify', section.id, section.label, section.percentage ? 'Partially addressed' : 'Not addressed')
    })
    qualificationSections.forEach((section) => {
      const answers = state.qualification[section.id] ?? {}
      section.fields.forEach((field) => {
        const value = answers[field.id]
        const values = Array.isArray(value) ? value : [value]
        if (values.includes('unknown')) add('qualify', section.id, field.label, 'Unknown')
        else if (values.includes('partial')) add('qualify', section.id, field.label, 'Partial')
      })
    })
  }
  return gaps
}

function technicalGaps(state, presales, currentStageIndex) {
  if (currentStageIndex < 5) return []
  const gaps = []
  const push = (id, sectionId, label, status) => gaps.push({ id, stage: 'presales', sectionId, label, status })
  createTechnicalFieldGaps(state).forEach((gap) => push(`presales:${gap.id}`, gap.sectionId, gap.label, gap.status))
  commonDiscoverySections.forEach((section) => {
    const answers = state.technicalDiscovery.common[section.id] ?? {}
    const status = answers.discovery_status
    if (!status || ['unknown', 'partially_understood', 'gap'].includes(status)) push(`presales:common:${section.id}`, `common:${section.id}`, section.label, status ? status.replaceAll('_', ' ') : 'Not addressed')
  })
  presales.capabilityIds.forEach((id) => {
    const status = state.technicalDiscovery.capabilities[id]?.discovery_status
    if (!status || ['unknown', 'partially_understood', 'gap'].includes(status)) push(`presales:capability:${id}`, `capability:${id}`, `${capabilityDiscoveryModules[id]?.label} discovery`, status ? status.replaceAll('_', ' ') : 'Not addressed')
  })
  return gaps
}

// Each major stage contributes equally. Within a stage, only meaningful expected
// structured answers count. Explicit Unknown values count as addressed; absence does not.
export function createJourneyProgress(state) {
  const qualification = qualificationProgress(state)
  const presales = presalesProgress(state)
  const rawStages = {
    explore: { addressed: state.sectorId ? 1 : 0, expected: 1 },
    discover: { addressed: [state.primarySituationId, state.whyNowIds.length, state.businessImpactIds.length].filter(Boolean).length, expected: 3 },
    shape: { addressed: [state.primaryOutcomeId, state.transformationThemeIds.length, state.selectedCapabilityIds.length].filter(Boolean).length, expected: 3 },
    prepare: { addressed: state.conversationStageId ? 1 : 0, expected: 1 },
    qualify: qualification,
    presales,
  }
  const stages = journeyStageOrder.map((id) => {
    const percentage = rawStages[id].percentage ?? ratio(rawStages[id].addressed, rawStages[id].expected)
    return { id, label: stageLabels[id], ...rawStages[id], percentage, status: statusForPercentage(percentage) }
  })
  const overallPercentage = Math.round(stages.reduce((total, stage) => total + stage.percentage, 0) / stages.length)
  const currentStageIndex = Math.max(0, journeyStageOrder.indexOf(state.journeyStage))
  const gaps = [...salesGaps(state, qualification, currentStageIndex), ...technicalGaps(state, presales, currentStageIndex)]
  return { overallPercentage, stages, qualification, presales, gaps }
}
