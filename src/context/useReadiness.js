import { useMemo } from 'react'
import { evaluateSalesReadiness, evaluateSolutionShapingReadiness } from '../utils/readiness'
import { recommendNextEngagement } from '../utils/nextEngagement'
import { useJourney } from './useJourney'
import { usePresalesSummary } from './usePresalesSummary'

export function useReadiness() {
  const { state } = useJourney()
  const presalesSummary = usePresalesSummary()
  return useMemo(() => {
    const sales = evaluateSalesReadiness(state)
    const solution = evaluateSolutionShapingReadiness(state, presalesSummary)
    return { sales, solution, nextEngagement: recommendNextEngagement(state, sales, solution) }
  }, [presalesSummary, state])
}
