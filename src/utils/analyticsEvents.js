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
  JOURNEY_STAGE_VIEWED: 'journey_stage_viewed',
  JOURNEY_MODE_SELECTED: 'journey_mode_selected',
  JOURNEY_SECTOR_SELECTED: 'journey_sector_selected',
  CUSTOMER_SITUATION_SELECTED: 'customer_situation_selected',
  BUSINESS_OUTCOME_SELECTED: 'business_outcome_selected',
  TRANSFORMATION_THEME_SELECTED: 'transformation_theme_selected',
  CAPABILITY_SELECTED: 'capability_selected',
  JOURNEY_RESET: 'journey_reset',
  WHY_NOW_SELECTED: 'why_now_selected',
  BUSINESS_IMPACT_SELECTED: 'business_impact_selected',
  CAPABILITY_RECOMMENDED: 'capability_recommended',
  SALES_DISCOVERY_PROGRESSED: 'sales_discovery_progressed',
  QUALIFICATION_STARTED: 'qualification_started',
  QUALIFICATION_SECTION_COMPLETED: 'qualification_section_completed',
  QUALIFICATION_COMPLETED: 'qualification_completed',
  PRESALES_RECOMMENDED: 'presales_recommended',
  PRESALES_HANDOVER_VIEWED: 'presales_handover_viewed',
  PRESALES_MODE_SELECTED: 'presales_mode_selected',
  TECHNICAL_DISCOVERY_STARTED: 'technical_discovery_started',
  TECHNICAL_DISCOVERY_SECTION_COMPLETED: 'technical_discovery_section_completed',
  CAPABILITY_DISCOVERY_STARTED: 'capability_discovery_started',
  CAPABILITY_DISCOVERY_COMPLETED: 'capability_discovery_completed',
  TECHNICAL_GAP_IDENTIFIED: 'technical_gap_identified',
  SPECIALIST_RECOMMENDED: 'specialist_recommended',
  WORKSHOP_RECOMMENDED: 'workshop_recommended',
  SOLUTION_SHAPING_PACK_GENERATED: 'solution_shaping_pack_generated',
  SOLUTION_SHAPING_PACK_COPIED: 'solution_shaping_pack_copied',
  PRESALES_READINESS_VIEWED: 'presales_readiness_viewed',
  HANDOVER_PREVIEW_VIEWED: 'handover_preview_viewed',
  HANDOVER_PACK_GENERATED: 'handover_pack_generated',
  HANDOVER_PACK_COPIED: 'handover_pack_copied',
  SOLUTION_SHAPING_READINESS_VIEWED: 'solution_shaping_readiness_viewed',
  NEXT_ENGAGEMENT_VIEWED: 'next_engagement_viewed',
  JOURNEY_PROGRESS_SAVED: 'journey_progress_saved',
  OPPORTUNITY_BRIEF_EXPORTED: 'opportunity_brief_exported',
  MEETING_BRIEF_EXPORTED: 'meeting_brief_exported',
  OPPORTUNITY_WORKSPACE_CREATED: 'opportunity_workspace_created',
  OPPORTUNITY_WORKSPACE_OPENED: 'opportunity_workspace_opened',
  OPPORTUNITY_WORKSPACE_DELETED: 'opportunity_workspace_deleted',
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
  [ANALYTICS_EVENTS.JOURNEY_STAGE_VIEWED]: {
    properties: ['stage'],
    businessQuestion: 'Which journey stages are opened?',
  },
  [ANALYTICS_EVENTS.JOURNEY_MODE_SELECTED]: {
    properties: ['mode'],
    businessQuestion: 'How often are the Sales and Presales foundations used?',
  },
  [ANALYTICS_EVENTS.JOURNEY_SECTOR_SELECTED]: {
    properties: ['sector'],
    businessQuestion: 'Which generic sector contexts start opportunity journeys?',
  },
  [ANALYTICS_EVENTS.CUSTOMER_SITUATION_SELECTED]: {
    properties: ['situation', 'sector', 'primary'],
    businessQuestion: 'Which controlled customer situations are selected?',
  },
  [ANALYTICS_EVENTS.BUSINESS_OUTCOME_SELECTED]: {
    properties: ['outcome', 'selected', 'primary'],
    businessQuestion: 'Which structured business outcomes are considered?',
  },
  [ANALYTICS_EVENTS.TRANSFORMATION_THEME_SELECTED]: {
    properties: ['theme', 'selected'],
    businessQuestion: 'Which transformation themes are considered?',
  },
  [ANALYTICS_EVENTS.CAPABILITY_SELECTED]: {
    properties: ['capability', 'selected'],
    businessQuestion: 'Which capability areas are selected during shaping?',
  },
  [ANALYTICS_EVENTS.JOURNEY_RESET]: {
    properties: ['context_present'],
    businessQuestion: 'How often do users deliberately restart an opportunity journey?',
  },
  [ANALYTICS_EVENTS.WHY_NOW_SELECTED]: {
    properties: ['trigger', 'sector'],
    businessQuestion: 'Which anonymous urgency triggers are identified?',
  },
  [ANALYTICS_EVENTS.BUSINESS_IMPACT_SELECTED]: {
    properties: ['impact'],
    businessQuestion: 'Which controlled business impacts are identified?',
  },
  [ANALYTICS_EVENTS.CAPABILITY_RECOMMENDED]: {
    properties: ['capability', 'sector'],
    businessQuestion: 'Which deterministic capability recommendations are accepted?',
  },
  [ANALYTICS_EVENTS.SALES_DISCOVERY_PROGRESSED]: {
    properties: ['stage'],
    businessQuestion: 'How far does structured Sales discovery progress?',
  },
  [ANALYTICS_EVENTS.QUALIFICATION_STARTED]: {
    properties: [],
    businessQuestion: 'How often does structured qualification begin?',
  },
  [ANALYTICS_EVENTS.QUALIFICATION_SECTION_COMPLETED]: {
    properties: ['section'],
    businessQuestion: 'Which qualification sections reach a strongly understood state?',
  },
  [ANALYTICS_EVENTS.QUALIFICATION_COMPLETED]: {
    properties: [],
    businessQuestion: 'How often is the full structured qualification strongly understood?',
  },
  [ANALYTICS_EVENTS.PRESALES_RECOMMENDED]: {
    properties: ['reason_category'],
    businessQuestion: 'Which broad rule category prompts Presales engagement?',
  },
  [ANALYTICS_EVENTS.PRESALES_HANDOVER_VIEWED]: {
    properties: [],
    businessQuestion: 'How often is the structured Presales handover reached?',
  },
  [ANALYTICS_EVENTS.PRESALES_MODE_SELECTED]: {
    properties: [],
    businessQuestion: 'How often is the Presales workspace selected?',
  },
  [ANALYTICS_EVENTS.TECHNICAL_DISCOVERY_STARTED]: {
    properties: [],
    businessQuestion: 'How often does common technical discovery begin?',
  },
  [ANALYTICS_EVENTS.TECHNICAL_DISCOVERY_SECTION_COMPLETED]: {
    properties: ['section'],
    businessQuestion: 'Which common technical-discovery areas reach an understood or not-applicable state?',
  },
  [ANALYTICS_EVENTS.CAPABILITY_DISCOVERY_STARTED]: {
    properties: ['capability'],
    businessQuestion: 'Which capability-specific discovery modules are opened?',
  },
  [ANALYTICS_EVENTS.CAPABILITY_DISCOVERY_COMPLETED]: {
    properties: ['capability'],
    businessQuestion: 'Which capability modules reach an understood or not-applicable state?',
  },
  [ANALYTICS_EVENTS.TECHNICAL_GAP_IDENTIFIED]: {
    properties: ['category'],
    businessQuestion: 'Which broad technical gap categories remain?',
  },
  [ANALYTICS_EVENTS.SPECIALIST_RECOMMENDED]: {
    properties: ['specialist_category'],
    businessQuestion: 'Which specialist capability categories are recommended?',
  },
  [ANALYTICS_EVENTS.WORKSHOP_RECOMMENDED]: {
    properties: ['workshop_type'],
    businessQuestion: 'Which structured next-action types are acknowledged?',
  },
  [ANALYTICS_EVENTS.SOLUTION_SHAPING_PACK_GENERATED]: {
    properties: [],
    businessQuestion: 'How often is the privacy-safe Solution-Shaping Pack generated?',
  },
  [ANALYTICS_EVENTS.SOLUTION_SHAPING_PACK_COPIED]: {
    properties: [],
    businessQuestion: 'How often is the structured pack successfully copied?',
  },
  [ANALYTICS_EVENTS.PRESALES_READINESS_VIEWED]: {
    properties: ['readiness_status', 'gap_count', 'capability_count'],
    businessQuestion: 'Which derived Sales to Presales readiness states are reviewed?',
  },
  [ANALYTICS_EVENTS.HANDOVER_PREVIEW_VIEWED]: {
    properties: ['readiness_status'],
    businessQuestion: 'How often is the structured handover preview reviewed?',
  },
  [ANALYTICS_EVENTS.HANDOVER_PACK_GENERATED]: {
    properties: ['readiness_status', 'next_engagement'],
    businessQuestion: 'How often is an anonymous Sales to Presales handover pack generated?',
  },
  [ANALYTICS_EVENTS.HANDOVER_PACK_COPIED]: {
    properties: ['readiness_status', 'next_engagement'],
    businessQuestion: 'How often is the generated handover pack successfully copied?',
  },
  [ANALYTICS_EVENTS.SOLUTION_SHAPING_READINESS_VIEWED]: {
    properties: ['readiness_status', 'gap_count'],
    businessQuestion: 'Which derived solution-shaping readiness states are reviewed?',
  },
  [ANALYTICS_EVENTS.NEXT_ENGAGEMENT_VIEWED]: {
    properties: ['next_engagement', 'readiness_status'],
    businessQuestion: 'Which deterministic next engagements are reviewed?',
  },
  [ANALYTICS_EVENTS.JOURNEY_PROGRESS_SAVED]: {
    properties: ['stage', 'completion_percentage'],
    businessQuestion: 'How often is structured journey progress saved locally?',
  },
  [ANALYTICS_EVENTS.OPPORTUNITY_BRIEF_EXPORTED]: {
    properties: ['readiness_status', 'next_engagement'],
    businessQuestion: 'How often is a privacy-safe opportunity brief exported?',
  },
  [ANALYTICS_EVENTS.MEETING_BRIEF_EXPORTED]: {
    properties: ['sector', 'priority', 'stage'],
    businessQuestion: 'How often is a privacy-safe meeting brief downloaded?',
  },
  [ANALYTICS_EVENTS.OPPORTUNITY_WORKSPACE_CREATED]: {
    properties: [],
    businessQuestion: 'How often is a new anonymous opportunity workspace created?',
  },
  [ANALYTICS_EVENTS.OPPORTUNITY_WORKSPACE_OPENED]: {
    properties: ['stage'],
    businessQuestion: 'At which Navigator stages are local workspaces reopened?',
  },
  [ANALYTICS_EVENTS.OPPORTUNITY_WORKSPACE_DELETED]: {
    properties: ['stage'],
    businessQuestion: 'At which Navigator stage are local prototype workspaces removed?',
  },
})
