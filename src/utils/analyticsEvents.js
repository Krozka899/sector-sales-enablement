export const ANALYTICS_EVENTS = Object.freeze({
  APP_OPENED: 'app_opened',
  SECTOR_SELECTED: 'sector_selected',
  CONVERSATION_TAB_SELECTED: 'conversation_tab_selected',
  MEETING_PREP_STARTED: 'meeting_prep_started',
  MEETING_SECTOR_SELECTED: 'meeting_sector_selected',
  MEETING_PRIORITY_SELECTED: 'meeting_priority_selected',
  MEETING_STAGE_SELECTED: 'meeting_stage_selected',
  MEETING_BRIEF_GENERATED: 'meeting_brief_generated',
  MEETING_BRIEF_COPIED: 'meeting_brief_copied',
  MEETING_PREP_RESET: 'meeting_prep_reset',
  MEETING_BRIEF_FEEDBACK: 'meeting_brief_feedback',
})

// This schema is both the event contract and concise internal documentation.
// The properties list is enforced by trackEvent so accidental extra data is discarded.
export const ANALYTICS_EVENT_SCHEMA = Object.freeze({
  [ANALYTICS_EVENTS.APP_OPENED]: {
    properties: [],
    businessQuestion: 'How many browser sessions opened the application?',
  },
  [ANALYTICS_EVENTS.SECTOR_SELECTED]: {
    properties: ['sector'],
    businessQuestion: 'Which sectors are explored most?',
  },
  [ANALYTICS_EVENTS.CONVERSATION_TAB_SELECTED]: {
    properties: ['sector', 'tab'],
    businessQuestion: 'Which Conversation Guide categories are used most?',
  },
  [ANALYTICS_EVENTS.MEETING_PREP_STARTED]: {
    properties: [],
    businessQuestion: 'How many sessions show intent to prepare for a meeting?',
  },
  [ANALYTICS_EVENTS.MEETING_SECTOR_SELECTED]: {
    properties: ['sector'],
    businessQuestion: 'Which sectors are selected during meeting preparation?',
  },
  [ANALYTICS_EVENTS.MEETING_PRIORITY_SELECTED]: {
    properties: ['priority'],
    businessQuestion: 'Which customer priorities are prepared for most?',
  },
  [ANALYTICS_EVENTS.MEETING_STAGE_SELECTED]: {
    properties: ['stage'],
    businessQuestion: 'At which conversation stages is the tool used?',
  },
  [ANALYTICS_EVENTS.MEETING_BRIEF_GENERATED]: {
    properties: ['sector', 'priority', 'stage'],
    businessQuestion: 'How many sessions progress into active meeting preparation?',
  },
  [ANALYTICS_EVENTS.MEETING_BRIEF_COPIED]: {
    properties: ['sector', 'priority', 'stage'],
    businessQuestion: 'How many generated briefs show high engagement through copying?',
  },
  [ANALYTICS_EVENTS.MEETING_PREP_RESET]: {
    properties: ['brief_generated'],
    businessQuestion: 'How often do users start another preparation flow?',
  },
  [ANALYTICS_EVENTS.MEETING_BRIEF_FEEDBACK]: {
    properties: ['rating', 'reason', 'sector', 'priority', 'stage'],
    businessQuestion: 'Did users find the generated meeting brief useful, and why?',
  },
})
