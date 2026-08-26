import { useContext } from 'react'
import { OpportunityWorkspaceStore } from './opportunityWorkspaceStore'

export function useOpportunityWorkspaces() {
  const context = useContext(OpportunityWorkspaceStore)
  if (!context) throw new Error('useOpportunityWorkspaces must be used within OpportunityWorkspaceProvider')
  return context
}
