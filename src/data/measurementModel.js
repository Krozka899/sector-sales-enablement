import { ANALYTICS_EVENTS } from '../utils/analyticsEvents.js'

export const successAreas = [
  {
    id: 'adoption',
    title: 'Adoption',
    question: 'Are Sales teams using the experience?',
    measures: ['Application opens', 'Sector exploration', 'Opportunity journeys started', 'Meeting preparation started'],
  },
  {
    id: 'engagement',
    title: 'Engagement',
    question: 'Are users progressing beyond browsing?',
    measures: ['Discovery activity', 'Meeting briefs generated', 'Meeting briefs copied', 'Qualification progression', 'Presales engagement'],
  },
  {
    id: 'value',
    title: 'Value',
    question: 'Is the experience helping customer conversations?',
    measures: ['Useful meeting brief feedback', 'Presales-ready opportunities', 'Capability expansion', 'Stronger Sales → Presales handovers'],
  },
]

export const engagementFunnel = [
  { label: 'Application Opened', event: ANALYTICS_EVENTS.APP_OPENED, signal: 'Reach' },
  { label: 'Sector Explored', event: ANALYTICS_EVENTS.SECTOR_SELECTED, signal: 'Exploration' },
  { label: 'Opportunity Journey Started', event: ANALYTICS_EVENTS.JOURNEY_SECTOR_SELECTED, signal: 'Intent' },
  { label: 'Meeting Preparation Started', event: ANALYTICS_EVENTS.MEETING_PREP_STARTED, signal: 'Active usage' },
  { label: 'Meeting Brief Generated', event: ANALYTICS_EVENTS.MEETING_BRIEF_GENERATED, signal: 'Active usage' },
  { label: 'Meeting Brief Copied', event: ANALYTICS_EVENTS.MEETING_BRIEF_COPIED, signal: 'High engagement' },
  { label: 'Presales Engaged', event: ANALYTICS_EVENTS.PRESALES_HANDOVER_VIEWED, signal: 'Presales engagement' },
  { label: 'Useful Feedback', event: ANALYTICS_EVENTS.MEETING_BRIEF_FEEDBACK, signal: 'Perceived value', propertyFilter: 'rating = useful' },
]

export const journeyInsightStages = [
  { id: 'explore', label: 'Explore', signal: 'Sales is identifying relevant sector context.' },
  { id: 'discover', label: 'Discover', signal: 'Business challenges and outcomes are being explored.' },
  { id: 'shape', label: 'Shape', signal: 'Relevant Vodafone capabilities are being considered.' },
  { id: 'prepare', label: 'Prepare', signal: 'A customer conversation is being actively prepared.' },
  { id: 'qualify', label: 'Qualify', signal: 'The opportunity has sufficient structure for deeper engagement.' },
  { id: 'presales', label: 'Presales', signal: 'Technical expertise has been brought into the opportunity.' },
]

export const presalesSignals = [
  'Presales engagement by journey stage',
  'Capability combinations leading to Presales',
  'Qualification readiness',
  'Specialist and workshop recommendations',
  'Presales handover generation',
]

export const meetingValueSignals = [
  'Meeting briefs generated',
  'Meeting briefs copied',
  'Feedback submitted',
  'Useful rating',
  'Structured reasons the brief helped',
  'Structured reasons the brief could improve',
]

export const reportingLevels = ['Reach', 'Exploration', 'Intent', 'Active Usage', 'High Engagement', 'Presales Engagement', 'Perceived Value']

export const emptyAggregateMeasurement = Object.freeze({
  funnelCounts: {},
  capabilityInterest: [],
  sectorInterest: [],
  priorityInterest: [],
})
