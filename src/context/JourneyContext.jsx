import { useEffect, useMemo, useReducer, useRef } from 'react'
import { createEmptyJourneyState, normaliseJourneyState } from '../data/journeyState'
import { createQualificationSummary } from '../utils/qualification'
import { createPresalesRecommendation, createRecommendations } from '../utils/recommendationRules'
import { JourneyContextStore } from './journeyContextStore'

function toggleId(ids, id) {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
}

function toggleExclusiveId(ids, id, exclusiveIds = ['unknown']) {
  if (exclusiveIds.includes(id)) return ids.includes(id) ? [] : [id]
  return toggleId(ids.filter((item) => !exclusiveIds.includes(item)), id)
}

function setExclusiveRecordValue(record, id, value, exclusiveId) {
  if (id === exclusiveId) return { [exclusiveId]: value }
  const next = { ...record, [id]: value }
  delete next[exclusiveId]
  return next
}

function journeyReducer(state, action) {
  switch (action.type) {
    case 'set_mode':
      return { ...state, mode: action.mode }
    case 'set_stage':
      return {
        ...state,
        journeyStage: action.stage,
        lastSalesStage: action.stage === 'presales' ? state.lastSalesStage : action.stage,
        handoverStatus: action.stage === 'presales' ? 'viewed' : state.handoverStatus,
      }
    case 'set_sector':
      if (state.sectorId === action.sectorId) return state
      return {
        ...createEmptyJourneyState(),
        sectorId: action.sectorId,
      }
    case 'set_primary_situation':
      return {
        ...state,
        primarySituationId: action.situationId,
        supportingSituationIds: state.supportingSituationIds.filter((id) => id !== action.situationId),
      }
    case 'toggle_supporting_situation': {
      if (action.situationId === state.primarySituationId) return state
      const nextIds = toggleId(state.supportingSituationIds, action.situationId)
      return { ...state, supportingSituationIds: nextIds.slice(-2) }
    }
    case 'toggle_why_now':
      return { ...state, whyNowIds: toggleExclusiveId(state.whyNowIds, action.triggerId) }
    case 'toggle_business_impact':
      return { ...state, businessImpactIds: toggleExclusiveId(state.businessImpactIds, action.impactId) }
    case 'toggle_outcome': {
      const businessOutcomeIds = toggleId(state.businessOutcomeIds, action.outcomeId)
      return {
        ...state,
        businessOutcomeIds,
        primaryOutcomeId: businessOutcomeIds.includes(state.primaryOutcomeId) ? state.primaryOutcomeId : null,
      }
    }
    case 'set_primary_outcome':
      return {
        ...state,
        primaryOutcomeId: action.outcomeId,
        businessOutcomeIds: state.businessOutcomeIds.includes(action.outcomeId) ? state.businessOutcomeIds : [...state.businessOutcomeIds, action.outcomeId],
      }
    case 'toggle_theme':
      return { ...state, transformationThemeIds: toggleId(state.transformationThemeIds, action.themeId) }
    case 'toggle_capability':
      return { ...state, selectedCapabilityIds: toggleId(state.selectedCapabilityIds, action.capabilityId) }
    case 'set_conversation_stage':
      return { ...state, conversationStageId: action.conversationStageId }
    case 'set_qualification_value':
      return {
        ...state,
        qualification: {
          ...state.qualification,
          [action.sectionId]: { ...state.qualification[action.sectionId], [action.fieldId]: action.value },
        },
      }
    case 'toggle_qualification_value': {
      const currentValues = state.qualification[action.sectionId]?.[action.fieldId] ?? []
      return {
        ...state,
        qualification: {
          ...state.qualification,
          [action.sectionId]: {
            ...state.qualification[action.sectionId],
            [action.fieldId]: toggleExclusiveId(currentValues, action.value, ['unknown', 'none_identified']),
          },
        },
      }
    }
    case 'set_technical_value': {
      const area = state.technicalDiscovery[action.scope][action.areaId] ?? {}
      return {
        ...state,
        technicalDiscovery: {
          ...state.technicalDiscovery,
          [action.scope]: {
            ...state.technicalDiscovery[action.scope],
            [action.areaId]: { ...area, [action.fieldId]: action.value },
          },
        },
      }
    }
    case 'toggle_technical_value': {
      const area = state.technicalDiscovery[action.scope][action.areaId] ?? {}
      const currentValues = area[action.fieldId] ?? []
      return {
        ...state,
        technicalDiscovery: {
          ...state.technicalDiscovery,
          [action.scope]: {
            ...state.technicalDiscovery[action.scope],
            [action.areaId]: { ...area, [action.fieldId]: toggleExclusiveId(currentValues, action.value, ['unknown', 'none']) },
          },
        },
      }
    }
    case 'add_presales_capability':
      return {
        ...state,
        technicalDiscovery: {
          ...state.technicalDiscovery,
          presalesAddedCapabilityIds: state.technicalDiscovery.presalesAddedCapabilityIds.includes(action.capabilityId)
            ? state.technicalDiscovery.presalesAddedCapabilityIds
            : [...state.technicalDiscovery.presalesAddedCapabilityIds, action.capabilityId],
        },
      }
    case 'clear_capability_discovery': {
      const capabilities = { ...state.technicalDiscovery.capabilities }
      delete capabilities[action.capabilityId]
      return { ...state, technicalDiscovery: { ...state.technicalDiscovery, capabilities } }
    }
    case 'set_assumption_status':
      return {
        ...state,
        technicalDiscovery: {
          ...state.technicalDiscovery,
          assumptions: setExclusiveRecordValue(state.technicalDiscovery.assumptions, action.assumptionId, action.status, 'none_identified'),
        },
      }
    case 'set_risk_impact':
      return { ...state, technicalDiscovery: { ...state.technicalDiscovery, risks: { ...state.technicalDiscovery.risks, [action.riskId]: action.impact } } }
    case 'toggle_dependency':
      return { ...state, technicalDiscovery: { ...state.technicalDiscovery, dependencies: toggleExclusiveId(state.technicalDiscovery.dependencies, action.dependencyId, ['none_identified']) } }
    case 'reset':
      return createEmptyJourneyState()
    default:
      return state
  }
}

export function JourneyProvider({ children, initialState = null, workspaceKey = 'standalone', onStateChange }) {
  const [state, dispatch] = useReducer(journeyReducer, initialState, normaliseJourneyState)
  const initialRender = useRef(true)

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false
      return
    }
    onStateChange?.(state)
  }, [onStateChange, state, workspaceKey])
  const qualificationSummary = useMemo(() => createQualificationSummary(state.qualification), [state.qualification])

  const progress = useMemo(() => ({
    explore: Boolean(state.sectorId),
    discover: Boolean(state.primarySituationId && state.whyNowIds.length && state.businessImpactIds.length),
    shape: Boolean(state.primaryOutcomeId && state.transformationThemeIds.length && state.selectedCapabilityIds.length),
    prepare: Boolean(state.conversationStageId),
    qualify: qualificationSummary.status === 'ready',
    presales: state.handoverStatus === 'viewed',
  }), [qualificationSummary.status, state])

  const recommendations = useMemo(() => createRecommendations(state), [state])
  const presalesRecommendation = useMemo(() => createPresalesRecommendation(state, qualificationSummary), [qualificationSummary, state])

  const value = useMemo(() => ({
    state,
    progress,
    recommendations,
    qualificationSummary,
    presalesRecommendation,
    setMode: (mode) => dispatch({ type: 'set_mode', mode }),
    setStage: (stage) => dispatch({ type: 'set_stage', stage }),
    setSector: (sectorId) => dispatch({ type: 'set_sector', sectorId }),
    setPrimarySituation: (situationId) => dispatch({ type: 'set_primary_situation', situationId }),
    toggleSupportingSituation: (situationId) => dispatch({ type: 'toggle_supporting_situation', situationId }),
    toggleWhyNow: (triggerId) => dispatch({ type: 'toggle_why_now', triggerId }),
    toggleBusinessImpact: (impactId) => dispatch({ type: 'toggle_business_impact', impactId }),
    toggleOutcome: (outcomeId) => dispatch({ type: 'toggle_outcome', outcomeId }),
    setPrimaryOutcome: (outcomeId) => dispatch({ type: 'set_primary_outcome', outcomeId }),
    toggleTheme: (themeId) => dispatch({ type: 'toggle_theme', themeId }),
    toggleCapability: (capabilityId) => dispatch({ type: 'toggle_capability', capabilityId }),
    setConversationStage: (conversationStageId) => dispatch({ type: 'set_conversation_stage', conversationStageId }),
    setQualificationValue: (sectionId, fieldId, answer) => dispatch({ type: 'set_qualification_value', sectionId, fieldId, value: answer }),
    toggleQualificationValue: (sectionId, fieldId, answer) => dispatch({ type: 'toggle_qualification_value', sectionId, fieldId, value: answer }),
    setTechnicalValue: (scope, areaId, fieldId, answer) => dispatch({ type: 'set_technical_value', scope, areaId, fieldId, value: answer }),
    toggleTechnicalValue: (scope, areaId, fieldId, answer) => dispatch({ type: 'toggle_technical_value', scope, areaId, fieldId, value: answer }),
    addPresalesCapability: (capabilityId) => dispatch({ type: 'add_presales_capability', capabilityId }),
    clearCapabilityDiscovery: (capabilityId) => dispatch({ type: 'clear_capability_discovery', capabilityId }),
    setAssumptionStatus: (assumptionId, status) => dispatch({ type: 'set_assumption_status', assumptionId, status }),
    setRiskImpact: (riskId, impact) => dispatch({ type: 'set_risk_impact', riskId, impact }),
    toggleDependency: (dependencyId) => dispatch({ type: 'toggle_dependency', dependencyId }),
    resetJourney: () => dispatch({ type: 'reset' }),
  }), [presalesRecommendation, progress, qualificationSummary, recommendations, state])

  return <JourneyContextStore.Provider value={value}>{children}</JourneyContextStore.Provider>
}
