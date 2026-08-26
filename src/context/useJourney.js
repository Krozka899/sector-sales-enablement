import { useContext } from 'react'
import { JourneyContextStore } from './journeyContextStore'

export function useJourney() {
  const context = useContext(JourneyContextStore)
  if (!context) throw new Error('useJourney must be used within JourneyProvider')
  return context
}
