import { ANALYTICS_EVENTS } from './analyticsEvents.js'

function countEvents(events, eventName, predicate = () => true) {
  return events.filter((event) => event.name === eventName && predicate(event)).length
}

export function deriveDevelopmentSessionMetrics(events = []) {
  const sectorValues = events.flatMap((event) => {
    if (![ANALYTICS_EVENTS.SECTOR_SELECTED, ANALYTICS_EVENTS.JOURNEY_SECTOR_SELECTED, ANALYTICS_EVENTS.MEETING_SECTOR_SELECTED].includes(event.name)) return []
    return event.properties?.sector ? [event.properties.sector] : []
  })

  return [
    { id: 'events', label: 'Events recorded', value: events.length },
    { id: 'sectors', label: 'Sectors explored', value: new Set(sectorValues).size },
    { id: 'meeting-prep', label: 'Meeting prep started', value: countEvents(events, ANALYTICS_EVENTS.MEETING_PREP_STARTED) },
    { id: 'briefs-generated', label: 'Briefs generated', value: countEvents(events, ANALYTICS_EVENTS.MEETING_BRIEF_GENERATED) },
    { id: 'briefs-copied', label: 'Briefs copied', value: countEvents(events, ANALYTICS_EVENTS.MEETING_BRIEF_COPIED) },
    { id: 'feedback', label: 'Feedback submitted', value: countEvents(events, ANALYTICS_EVENTS.MEETING_BRIEF_FEEDBACK) },
    { id: 'useful-feedback', label: 'Useful feedback', value: countEvents(events, ANALYTICS_EVENTS.MEETING_BRIEF_FEEDBACK, (event) => event.properties?.rating === 'useful') },
    { id: 'presales', label: 'Presales engaged', value: countEvents(events, ANALYTICS_EVENTS.PRESALES_HANDOVER_VIEWED) },
  ]
}

