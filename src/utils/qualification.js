import { qualificationSections } from '../data/qualificationModel.js'

function hasValue(value) {
  return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== ''
}

export function getQualificationSectionStatus(section, answers = {}) {
  const answeredFields = section.fields.filter((field) => hasValue(answers[field.id]))
  if (!answeredFields.length) return 'not_started'
  if (answeredFields.length < section.fields.length) return 'partial'

  if (answeredFields.some((field) => field.gapValues?.includes(answers[field.id]))) return 'gap'
  const values = answeredFields.flatMap((field) => Array.isArray(answers[field.id]) ? answers[field.id] : [answers[field.id]])
  if (values.some((value) => ['partial', 'unknown'].includes(value))) return 'partial'
  return 'complete'
}

export function createQualificationSummary(qualification) {
  const sections = qualificationSections.map((section) => ({
    id: section.id,
    label: section.label,
    status: getQualificationSectionStatus(section, qualification[section.id]),
  }))
  const gaps = sections.filter((section) => section.status !== 'complete').map((section) => ({
    sectionId: section.id,
    label: section.label,
    status: section.status,
  }))
  const startedCount = sections.filter((section) => section.status !== 'not_started').length
  const completeCount = sections.filter((section) => section.status === 'complete').length

  return {
    sections,
    gaps,
    startedCount,
    completeCount,
    status: completeCount === sections.length ? 'ready' : 'gaps_remain',
    label: completeCount === sections.length ? 'Ready for Presales' : 'Discovery gaps remain',
  }
}
