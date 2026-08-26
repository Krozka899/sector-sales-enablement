import { createEmptyJourneyState, normaliseJourneyState } from '../data/journeyState.js'

export const WORKSPACE_STORAGE_KEY = 'vodafoneOpportunityNavigatorWorkspaces'
const LEGACY_JOURNEY_STORAGE_KEY = 'sectorSalesEnablementJourneyV1'
const STORAGE_VERSION = 1

function hasJourneyContext(state) {
  return Boolean(state?.sectorId || state?.primarySituationId || state?.businessOutcomeIds?.length || state?.selectedCapabilityIds?.length || Object.values(state?.qualification ?? {}).some((section) => Object.keys(section).length))
}

export function createNavigatorReference(sequence, year = new Date().getFullYear()) {
  return `NAV-${year}-${String(sequence).padStart(4, '0')}`
}

export function createWorkspace(reference, now = new Date().toISOString(), state = createEmptyJourneyState()) {
  return {
    workspaceId: reference,
    navigatorReference: reference,
    crmOpportunityReference: null,
    workingLabelId: null,
    createdAt: now,
    updatedAt: now,
    state: normaliseJourneyState(state),
  }
}

function emptyRegistry() {
  return { version: STORAGE_VERSION, nextSequence: 1, activeWorkspaceId: null, workspaces: {} }
}

export function loadWorkspaceRegistry(storage = window.localStorage) {
  const empty = emptyRegistry()
  try {
    const stored = JSON.parse(storage.getItem(WORKSPACE_STORAGE_KEY))
    if (stored?.version === STORAGE_VERSION && stored.workspaces && typeof stored.workspaces === 'object') {
      const workspaces = Object.fromEntries(Object.entries(stored.workspaces).map(([id, workspace]) => [id, {
        ...workspace,
        workspaceId: id,
        navigatorReference: workspace.navigatorReference ?? id,
        crmOpportunityReference: null,
        state: normaliseJourneyState(workspace.state),
      }]))
      return { ...empty, ...stored, workspaces }
    }
  } catch {
    // Invalid local prototype data is ignored so the application can start safely.
  }

  try {
    const legacy = JSON.parse(storage.getItem(LEGACY_JOURNEY_STORAGE_KEY))
    if (legacy?.version === 1 && hasJourneyContext(legacy.state)) {
      const reference = createNavigatorReference(1)
      return { ...empty, nextSequence: 2, activeWorkspaceId: reference, workspaces: { [reference]: createWorkspace(reference, new Date().toISOString(), legacy.state) }, migratedLegacyJourney: true }
    }
  } catch {
    // Legacy migration is best-effort and never blocks a clean start.
  }
  return empty
}

export function persistWorkspaceRegistry(registry, storage = window.localStorage) {
  // Prototype-only local persistence. This is not a production system of record.
  // A future enterprise implementation should use authenticated users, approved
  // shared persistence and a CRM-owned opportunity reference without copying identity.
  const safeRegistry = { version: STORAGE_VERSION, nextSequence: registry.nextSequence, activeWorkspaceId: registry.activeWorkspaceId, workspaces: registry.workspaces }
  storage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(safeRegistry))
  if (registry.migratedLegacyJourney) storage.removeItem(LEGACY_JOURNEY_STORAGE_KEY)
}
