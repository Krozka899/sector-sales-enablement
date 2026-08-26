import { journeySectors } from '../data/journeyTaxonomies'

export function getJourneySectorId(sectorId) {
  return journeySectors.some((sector) => sector.id === sectorId) ? sectorId : null
}

export function getMeetingPrepSectorId(journeySectorId) {
  return getJourneySectorId(journeySectorId)
}
