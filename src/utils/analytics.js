import { ANALYTICS_EVENTS, ANALYTICS_EVENT_SCHEMA } from './analyticsEvents'

const DEBUG_STORAGE_KEY = 'sectorSalesAnalyticsDebug'
const APP_OPENED_MARKER_KEY = 'sectorSalesAnalyticsAppOpened'
const MAX_DEBUG_EVENTS = 200
const debugListeners = new Set()
const isDevelopment = Boolean(import.meta.env?.DEV)

let appOpenedInMemory = false
let analyticsClient = null

export function setAnalyticsClient(client) {
  analyticsClient = typeof client?.capture === 'function' ? client : null
}

function readSessionValue(key) {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeSessionValue(key, value) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // Analytics must never interrupt the application when storage is unavailable.
  }
}

function removeSessionValue(key) {
  try {
    window.sessionStorage.removeItem(key)
  } catch {
    // Analytics must never interrupt the application when storage is unavailable.
  }
}

export function getAnalyticsDebugEvents() {
  if (!isDevelopment) return []

  try {
    const storedEvents = JSON.parse(readSessionValue(DEBUG_STORAGE_KEY) || '[]')
    return Array.isArray(storedEvents) ? storedEvents : []
  } catch {
    return []
  }
}

function notifyDebugListeners(events) {
  debugListeners.forEach((listener) => listener(events))
}

function sanitiseProperties(eventName, properties) {
  const permittedProperties = ANALYTICS_EVENT_SCHEMA[eventName]?.properties ?? []

  return Object.fromEntries(
    permittedProperties
      .filter((property) => ['string', 'number', 'boolean'].includes(typeof properties[property]))
      .map((property) => [property, properties[property]]),
  )
}

export function trackEvent(eventName, properties = {}) {
  if (!ANALYTICS_EVENT_SCHEMA[eventName]) return

  const safeProperties = sanitiseProperties(eventName, properties)

  try {
    analyticsClient?.capture(eventName, safeProperties)
  } catch {
    // Analytics must never interrupt the application when the provider is unavailable.
  }

  if (!isDevelopment) return

  const event = {
    name: eventName,
    timestamp: new Date().toISOString(),
    properties: safeProperties,
  }

  console.info(`[Analytics] ${eventName}`, safeProperties)

  const events = [...getAnalyticsDebugEvents(), event].slice(-MAX_DEBUG_EVENTS)
  writeSessionValue(DEBUG_STORAGE_KEY, JSON.stringify(events))
  notifyDebugListeners(events)
}

export function trackAppOpened() {
  if (appOpenedInMemory || readSessionValue(APP_OPENED_MARKER_KEY)) return

  appOpenedInMemory = true
  writeSessionValue(APP_OPENED_MARKER_KEY, 'true')
  trackEvent(ANALYTICS_EVENTS.APP_OPENED)
}

export function subscribeToAnalyticsDebug(listener) {
  if (!isDevelopment) return () => {}

  debugListeners.add(listener)
  return () => debugListeners.delete(listener)
}

export function clearAnalyticsDebugEvents() {
  if (!isDevelopment) return

  removeSessionValue(DEBUG_STORAGE_KEY)
  removeSessionValue(APP_OPENED_MARKER_KEY)
  appOpenedInMemory = false
  notifyDebugListeners([])
}
