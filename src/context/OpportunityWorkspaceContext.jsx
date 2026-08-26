import { useCallback, useEffect, useMemo, useState } from 'react'
import { createNavigatorReference, createWorkspace, loadWorkspaceRegistry, persistWorkspaceRegistry } from '../utils/workspaceStorage'
import { OpportunityWorkspaceStore } from './opportunityWorkspaceStore'

export function OpportunityWorkspaceProvider({ children }) {
  const [registry, setRegistry] = useState(loadWorkspaceRegistry)

  useEffect(() => {
    try { persistWorkspaceRegistry(registry) } catch { /* Local storage may be disabled; in-memory workspaces still function. */ }
  }, [registry])

  const createOpportunityWorkspace = useCallback(() => {
    const reference = createNavigatorReference(registry.nextSequence)
    const workspace = createWorkspace(reference)
    setRegistry((current) => ({
      ...current,
      nextSequence: Math.max(current.nextSequence, registry.nextSequence + 1),
      activeWorkspaceId: reference,
      workspaces: { ...current.workspaces, [reference]: workspace },
    }))
    return reference
  }, [registry.nextSequence])

  const openWorkspace = useCallback((workspaceId) => setRegistry((current) => current.workspaces[workspaceId] ? { ...current, activeWorkspaceId: workspaceId } : current), [])
  const closeWorkspace = useCallback(() => setRegistry((current) => ({ ...current, activeWorkspaceId: null })), [])

  const deleteWorkspace = useCallback((workspaceId) => setRegistry((current) => {
    if (!current.workspaces[workspaceId]) return current
    const workspaces = { ...current.workspaces }
    delete workspaces[workspaceId]
    return { ...current, activeWorkspaceId: current.activeWorkspaceId === workspaceId ? null : current.activeWorkspaceId, workspaces }
  }), [])

  const updateActiveWorkspaceState = useCallback((state) => setRegistry((current) => {
    const workspaceId = current.activeWorkspaceId
    if (!workspaceId || !current.workspaces[workspaceId]) return current
    return { ...current, workspaces: { ...current.workspaces, [workspaceId]: { ...current.workspaces[workspaceId], state, updatedAt: new Date().toISOString() } } }
  }), [])

  const saveActiveWorkspace = useCallback(() => {
    const workspaceId = registry.activeWorkspaceId
    if (!workspaceId || !registry.workspaces[workspaceId]) return null
    const next = { ...registry, workspaces: { ...registry.workspaces, [workspaceId]: { ...registry.workspaces[workspaceId], updatedAt: new Date().toISOString() } } }
    persistWorkspaceRegistry(next)
    setRegistry(next)
    return next.workspaces[workspaceId].navigatorReference
  }, [registry])

  const activeWorkspace = registry.activeWorkspaceId ? registry.workspaces[registry.activeWorkspaceId] ?? null : null
  const value = useMemo(() => ({
    workspaces: Object.values(registry.workspaces),
    activeWorkspaceId: registry.activeWorkspaceId,
    activeWorkspace,
    createOpportunityWorkspace,
    openWorkspace,
    closeWorkspace,
    deleteWorkspace,
    updateActiveWorkspaceState,
    saveActiveWorkspace,
  }), [activeWorkspace, createOpportunityWorkspace, deleteWorkspace, openWorkspace, closeWorkspace, registry.activeWorkspaceId, registry.workspaces, saveActiveWorkspace, updateActiveWorkspaceState])

  return <OpportunityWorkspaceStore.Provider value={value}>{children}</OpportunityWorkspaceStore.Provider>
}
