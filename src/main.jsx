import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import { PostHogProvider } from '@posthog/react'
import './index.css'
import App from './App.jsx'
import { setAnalyticsClient } from './utils/analytics.js'

const posthogProjectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const posthogHost = import.meta.env.VITE_POSTHOG_HOST
const isPostHogConfigured = Boolean(posthogProjectToken && posthogHost)

if (isPostHogConfigured) {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    defaults: '2026-05-30',
    autocapture: false,
    rageclick: false,
    capture_pageview: false,
    capture_pageleave: false,
    capture_exceptions: false,
    capture_performance: false,
    capture_heatmaps: false,
    disable_session_recording: true,
    person_profiles: 'never',
  })

  setAnalyticsClient(posthog)
}

const application = isPostHogConfigured ? (
  <PostHogProvider client={posthog}>
    <App />
  </PostHogProvider>
) : (
  <App />
)

createRoot(document.getElementById('root')).render(
  <StrictMode>{application}</StrictMode>,
)
