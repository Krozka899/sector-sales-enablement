import { useMemo } from 'react'
import { createPresalesWorkspaceSummary } from '../utils/presalesDiscovery'
import { useJourney } from './useJourney'

export function usePresalesSummary() {
  const { state, qualificationSummary } = useJourney()
  return useMemo(() => createPresalesWorkspaceSummary(state, qualificationSummary), [qualificationSummary, state])
}
