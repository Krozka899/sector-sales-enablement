import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import Benefits from './components/Benefits'
import EngagementModel from './components/EngagementModel'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import Hero from './components/Hero'
import MeetingPrep from './components/MeetingPrep'
import AppShell from './components/AppShell'
import OpportunityNavigator from './components/OpportunityNavigator'
import OpportunityWorkspaces from './components/OpportunityWorkspaces'
import PresalesChecklist from './components/PresalesChecklist'
import SectorExplorer from './components/SectorExplorer'
import { JourneyProvider } from './context/JourneyContext'
import { OpportunityWorkspaceProvider } from './context/OpportunityWorkspaceContext'
import { useOpportunityWorkspaces } from './context/useOpportunityWorkspaces'
import { trackAppOpened } from './utils/analytics'

const MeasureSuccess = lazy(() => import('./components/MeasureSuccess'))
const AnalyticsDebug = import.meta.env.DEV ? lazy(() => import('./components/AnalyticsDebug')) : null

const validViews = new Set(['home', 'opportunity-workspaces', 'prepare-meeting', 'sectors', 'sales-presales', 'measure-success'])

function viewFromHash() {
  const rawValue = window.location.hash.replace(/^#\/?/, '') || 'home'
  const value = rawValue === 'opportunity-journey' ? 'opportunity-workspaces' : rawValue
  return validViews.has(value) ? value : 'home'
}

function Application() {
  const { activeWorkspace, closeWorkspace } = useOpportunityWorkspaces()
  const [activeView, setActiveView] = useState(viewFromHash)
  const mainRef = useRef(null)

  useEffect(() => {
    trackAppOpened()
  }, [])

  useEffect(() => {
    const updateView = () => {
      const nextView = viewFromHash()
      if (nextView === 'opportunity-workspaces' && activeWorkspace) closeWorkspace()
      setActiveView(nextView)
    }
    window.addEventListener('hashchange', updateView)
    return () => window.removeEventListener('hashchange', updateView)
  }, [activeWorkspace, closeWorkspace])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    window.requestAnimationFrame(() => mainRef.current?.focus())
  }, [activeView])

  const navigate = (view) => {
    if (!validViews.has(view)) return
    if (view === 'opportunity-workspaces' && activeWorkspace) closeWorkspace()
    if (activeView === view) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      mainRef.current?.focus()
      return
    }
    window.location.hash = `/${view}`
  }

  return (
    <AppShell activeView={activeView} onNavigate={navigate}>
      <a href="#main-content" onClick={(event) => { event.preventDefault(); mainRef.current?.focus() }} className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#1b1b1b] shadow-lg transition focus:translate-y-0 focus:outline-2 focus:outline-[#e60000]">
        Skip to content
      </a>
      <main ref={mainRef} id="main-content" tabIndex={-1} className="min-h-[calc(100vh-4rem)] outline-none lg:min-h-screen">
        {activeView === 'home' && <><Hero /><Benefits /><FinalCta /></>}
        {activeView === 'opportunity-workspaces' && (activeWorkspace ? <OpportunityNavigator workspace={activeWorkspace} onBackToWorkspaces={closeWorkspace} /> : <OpportunityWorkspaces />)}
        {activeView === 'prepare-meeting' && <MeetingPrep />}
        {activeView === 'sectors' && <SectorExplorer />}
        {activeView === 'sales-presales' && <><EngagementModel /><PresalesChecklist /></>}
        {activeView === 'measure-success' && <Suspense fallback={<section className="px-5 py-16 text-center text-sm text-slate-500" aria-label="Measure Success loading">Loading Measure Success…</section>}><MeasureSuccess /></Suspense>}
      </main>
      <Footer />
      {AnalyticsDebug && <Suspense fallback={null}><AnalyticsDebug /></Suspense>}
    </AppShell>
  )
}

function App() {
  return (
    <OpportunityWorkspaceProvider>
      <WorkspaceJourneyBridge />
    </OpportunityWorkspaceProvider>
  )
}

function WorkspaceJourneyBridge() {
  const { activeWorkspace, updateActiveWorkspaceState } = useOpportunityWorkspaces()
  const workspaceKey = activeWorkspace?.workspaceId ?? 'standalone'
  return <JourneyProvider key={workspaceKey} workspaceKey={workspaceKey} initialState={activeWorkspace?.state} onStateChange={activeWorkspace ? updateActiveWorkspaceState : undefined}><Application /></JourneyProvider>
}

export default App
