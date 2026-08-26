import { lazy, Suspense, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Download, RotateCcw, Save, ShieldCheck, Wrench } from 'lucide-react'
import { useJourney } from '../context/useJourney'
import { usePresalesSummary } from '../context/usePresalesSummary'
import { useReadiness } from '../context/useReadiness'
import { useOpportunityWorkspaces } from '../context/useOpportunityWorkspaces'
import { findTaxonomyItem, journeySectors, transformationThemes } from '../data/journeyTaxonomies'
import { trackEvent } from '../utils/analytics'
import { ANALYTICS_EVENTS } from '../utils/analyticsEvents'
import OpportunityWorkspace from './OpportunityWorkspace'
import QualificationWorkspace from './QualificationWorkspace'
import SectionHeading from './SectionHeading'
import DiscoverStage from './journey/DiscoverStage'
import { ChoiceButton, ContinueButton, StageHeader } from './journey/JourneyControls'
import PrepareStage from './journey/PrepareStage'
import ShapeStage from './journey/ShapeStage'
import { createJourneyProgress } from '../utils/journeyProgress'
import { createHandoverPack, formatHandoverPack } from '../utils/handover'
import { downloadTextFile } from '../utils/localFiles'

const PresalesWorkspace = lazy(() => import('./PresalesWorkspace'))

function OpportunityNavigator({ workspace, onBackToWorkspaces }) {
  const { state, qualificationSummary, presalesRecommendation, setMode, setStage, setSector, resetJourney } = useJourney()
  const { saveActiveWorkspace } = useOpportunityWorkspaces()
  const presalesSummary = usePresalesSummary()
  const { sales: salesReadiness, solution: solutionReadiness, nextEngagement } = useReadiness()
  const [resetPending, setResetPending] = useState(false)
  const [actionStatus, setActionStatus] = useState('')
  const [activeSections, setActiveSections] = useState({ discover: 'situation', shape: 'outcomes', qualify: 'business', presales: 'context' })
  const selectedSector = findTaxonomyItem(journeySectors, state.sectorId)
  const progressModel = useMemo(() => createJourneyProgress(state), [state])
  const activeSection = activeSections[state.journeyStage] ?? null
  const hasContext = Boolean(state.sectorId || state.primarySituationId || state.businessOutcomeIds.length || state.selectedCapabilityIds.length)
  const workspaceSector = findTaxonomyItem(journeySectors, state.sectorId)?.label ?? 'Sector not selected'
  const workspaceTheme = findTaxonomyItem(transformationThemes, state.transformationThemeIds?.[0])?.label ?? 'Theme not selected'

  const saveProgress = () => {
    try {
      const reference = saveActiveWorkspace() ?? workspace.navigatorReference
      setActionStatus(`Progress saved for ${reference} on this device.`)
      trackEvent(ANALYTICS_EVENTS.JOURNEY_PROGRESS_SAVED, { stage: state.journeyStage, completion_percentage: progressModel.overallPercentage })
    } catch {
      setActionStatus('Progress could not be saved in this browser.')
    }
  }

  const exportBrief = () => {
    try {
      const pack = createHandoverPack(state, qualificationSummary, presalesRecommendation, salesReadiness, solutionReadiness, nextEngagement, presalesSummary)
      downloadTextFile(`${workspace.navigatorReference.toLowerCase()}-opportunity-brief.txt`, formatHandoverPack(pack, workspace.navigatorReference))
      setActionStatus('Opportunity brief downloaded.')
      trackEvent(ANALYTICS_EVENTS.OPPORTUNITY_BRIEF_EXPORTED, { readiness_status: salesReadiness.status, next_engagement: nextEngagement.id })
    } catch {
      setActionStatus('The opportunity brief could not be exported.')
    }
  }

  const recordPresalesEntry = () => {
    trackEvent(ANALYTICS_EVENTS.PRESALES_HANDOVER_VIEWED)
    if (presalesRecommendation.recommended) {
      trackEvent(ANALYTICS_EVENTS.PRESALES_RECOMMENDED, { reason_category: presalesRecommendation.reasonCategories[0] ?? 'structured_context' })
    }
  }

  const selectMode = (mode) => {
    setMode(mode)
    if (mode === 'presales') {
      setStage('presales')
      recordPresalesEntry()
      trackEvent(ANALYTICS_EVENTS.PRESALES_MODE_SELECTED)
    }
    if (mode === 'sales' && state.journeyStage === 'presales') setStage(state.lastSalesStage)
    trackEvent(ANALYTICS_EVENTS.JOURNEY_MODE_SELECTED, { mode })
  }

  const goToStage = (stage) => {
    setMode(stage === 'presales' ? 'presales' : 'sales')
    setStage(stage)
    if (stage === 'presales') {
      recordPresalesEntry()
      trackEvent(ANALYTICS_EVENTS.PRESALES_MODE_SELECTED)
    }
    trackEvent(ANALYTICS_EVENTS.JOURNEY_STAGE_VIEWED, { stage })
    if (['shape', 'prepare', 'qualify', 'presales'].includes(stage)) trackEvent(ANALYTICS_EVENTS.SALES_DISCOVERY_PROGRESSED, { stage })
  }

  const navigateSection = (stage, sectionId) => {
    if (state.journeyStage !== stage) goToStage(stage)
    setActiveSections((current) => ({ ...current, [stage]: sectionId }))
  }

  const selectJourneySector = (sectorId) => {
    setSector(sectorId)
    setActiveSections({ discover: 'situation', shape: 'outcomes', qualify: 'business', presales: 'context' })
    trackEvent(ANALYTICS_EVENTS.JOURNEY_SECTOR_SELECTED, { sector: sectorId })
  }

  const confirmReset = () => {
    trackEvent(ANALYTICS_EVENTS.JOURNEY_RESET, { context_present: Boolean(state.sectorId || state.primarySituationId || state.businessOutcomeIds.length) })
    resetJourney()
    setActiveSections({ discover: 'situation', shape: 'outcomes', qualify: 'business', presales: 'context' })
    setResetPending(false)
    window.requestAnimationFrame(() => document.getElementById('journey-sector-first')?.focus())
  }

  return (
    <section id="opportunity-journey" className="min-h-screen border-y border-slate-200 bg-[#f5f6f7] py-7 sm:py-9 lg:py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Connected opportunity journey" title="Sales & Presales Opportunity Navigator" description="Use structured, anonymous business context to guide the conversation from early discovery through to Presales — without entering customer-identifiable information." />
          <div className="shrink-0">
            <p className="mb-1 text-[10px] font-bold tracking-wide text-slate-500 uppercase">Working perspective</p>
            <div className="rounded-xl border border-slate-200 bg-white p-1" role="group" aria-label="Choose working perspective; this is not access control">
              {[
                ['sales', 'Sales', BriefcaseBusiness],
                ['presales', 'Presales', Wrench],
              ].map(([mode, label, Icon]) => (
                <button key={mode} type="button" aria-pressed={state.mode === mode} onClick={() => selectMode(mode)} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${state.mode === mode ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Icon size={16} aria-hidden="true" /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"><div className="min-w-0"><p className="font-mono text-xs font-bold text-[#d90000]">{workspace.navigatorReference}</p><p className="mt-0.5 truncate text-sm font-bold text-slate-900">{workspaceSector}</p><p className="text-xs text-slate-500">{workspaceTheme}</p></div><button type="button" onClick={onBackToWorkspaces} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><ArrowLeft size={15} aria-hidden="true" />Back to Opportunity Workspaces</button></div>

        <div className="mt-3 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-sm text-slate-700" role="note">
          <ShieldCheck className="mt-0.5 shrink-0 text-blue-700" size={18} aria-hidden="true" />
          <p><strong className="text-slate-900">Privacy by design.</strong> Do not enter customer names, account details, opportunity IDs, personal information or confidential customer content. This experience uses structured business and technical selections only.</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <p className="min-h-5 text-xs font-semibold text-slate-600" aria-live="polite">{actionStatus || 'Save locally or export an anonymous structured brief.'}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={!hasContext} onClick={saveProgress} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] disabled:cursor-not-allowed disabled:opacity-45"><Save size={15} aria-hidden="true" />Save progress</button>
            <button type="button" disabled={!hasContext} onClick={exportBrief} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#e60000] px-3 py-2 text-sm font-bold text-white hover:bg-[#bd0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] disabled:cursor-not-allowed disabled:opacity-45">{actionStatus === 'Opportunity brief downloaded.' ? <Check size={15} aria-hidden="true" /> : <Download size={15} aria-hidden="true" />}Export brief</button>
          </div>
        </div>

        <OpportunityWorkspace state={state} progressModel={progressModel} activeSection={activeSection} onNavigateStage={goToStage} onNavigateSection={navigateSection}>
          {state.journeyStage === 'explore' && (
            <div>
              <StageHeader eyebrow="01 Explore" title="Choose a sector" description="Start with the operating context rather than a product. Sector priorities help focus the conversation while the existing Sector Explorer provides deeper content where available." />
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5" role="group" aria-label="Choose a journey sector">
                {journeySectors.map((sector, index) => <ChoiceButton key={sector.id} id={index === 0 ? 'journey-sector-first' : undefined} label={sector.label} selected={state.sectorId === sector.id} onClick={() => selectJourneySector(sector.id)} />)}
              </div>
              {selectedSector && (
                <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-2">
                  <div><h4 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Common priorities</h4><p className="mt-2 text-sm leading-6 text-slate-700">{selectedSector.priorities.join(' • ')}</p></div>
                  <div><h4 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Challenges to listen for</h4><p className="mt-2 text-sm leading-6 text-slate-700">{selectedSector.challenges.join(' • ')}</p></div>
                </div>
              )}
              {state.sectorId && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
                  <a href="#/sectors" className="text-sm font-bold text-[#d90000] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">Open detailed Sector Explorer</a>
                  <ContinueButton onClick={() => navigateSection('discover', 'situation')}>Continue to Discover <ArrowRight size={16} aria-hidden="true" /></ContinueButton>
                </div>
              )}
            </div>
          )}

          {state.journeyStage === 'discover' && <DiscoverStage activeSection={activeSections.discover} onSectionChange={(section) => navigateSection('discover', section)} onBack={() => goToStage('explore')} onContinue={() => navigateSection('shape', 'outcomes')} />}
          {state.journeyStage === 'shape' && <ShapeStage activeSection={activeSections.shape} onSectionChange={(section) => navigateSection('shape', section)} onBack={() => navigateSection('discover', 'business_impact')} onContinue={() => goToStage('prepare')} />}
          {state.journeyStage === 'prepare' && <PrepareStage onBack={() => navigateSection('shape', 'guidance')} onContinue={() => navigateSection('qualify', 'business')} />}
          {state.journeyStage === 'qualify' && (
            <div><StageHeader eyebrow="05 Qualify" title="Build a complete structured qualification view" description="Address one concise category at a time. Unknown is useful context, and incomplete qualification never blocks Presales entry." /><QualificationWorkspace activeSectionId={activeSections.qualify} onSectionChange={(section) => navigateSection('qualify', section)} onBack={() => goToStage('prepare')} onContinue={() => navigateSection('presales', 'context')} /></div>
          )}
          {state.journeyStage === 'presales' && (
            <div><StageHeader eyebrow="06 Presales" title="Hand structured context to Presales" description="Review inherited context, complete technical discovery progressively and shape the next structured engagement." /><Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">Loading Presales workspace…</div>}><PresalesWorkspace activeSectionId={activeSections.presales} onSectionChange={(section) => navigateSection('presales', section)} onBack={() => navigateSection('qualify', activeSections.qualify)} technicalProgress={progressModel.presales} /></Suspense></div>
          )}
        </OpportunityWorkspace>

        <div className="mt-4 flex min-h-11 items-center justify-end gap-3">
          {resetPending ? (
            <div className="flex flex-wrap items-center justify-end gap-2" role="group" aria-label="Confirm journey reset">
              <span className="text-sm font-semibold text-slate-700">Reset journey for {workspace.navigatorReference}?</span>
              <button type="button" onClick={confirmReset} className="min-h-10 rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">Yes, start again</button>
              <button type="button" onClick={() => setResetPending(false)} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">Cancel</button>
            </div>
          ) : (
            <button type="button" onClick={() => setResetPending(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><RotateCcw size={15} aria-hidden="true" /> Reset opportunity journey</button>
          )}
        </div>
      </div>
    </section>
  )
}

export default OpportunityNavigator
