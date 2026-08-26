import { useMemo, useState } from 'react'
import { BriefcaseBusiness, Plus, Search, Trash2 } from 'lucide-react'
import { useOpportunityWorkspaces } from '../context/useOpportunityWorkspaces'
import { journeySectors, transformationThemes, customerSituations, businessOutcomes, vodafoneCapabilities, findTaxonomyItem } from '../data/journeyTaxonomies'
import { createJourneyProgress } from '../utils/journeyProgress'
import { evaluateSalesReadiness } from '../utils/readiness'
import { trackEvent } from '../utils/analytics'
import { ANALYTICS_EVENTS } from '../utils/analyticsEvents'

const stageLabels = { explore: 'Explore', discover: 'Discover', shape: 'Shape', prepare: 'Prepare', qualify: 'Qualify', presales: 'Presales' }
const tabs = [['all', 'All'], ['recent', 'Recent'], ['in_progress', 'In Progress'], ['presales', 'Presales'], ['completed', 'Completed']]

function relativeUpdated(value, currentTime) {
  const date = new Date(value)
  const days = Math.floor((currentTime - date.getTime()) / 86400000)
  if (days <= 0) return 'Updated today'
  if (days === 1) return 'Updated yesterday'
  if (days < 7) return `Updated ${days} days ago`
  return `Updated ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

function workspaceView(workspace) {
  const state = workspace.state
  const progress = createJourneyProgress(state)
  const readiness = evaluateSalesReadiness(state)
  const sector = findTaxonomyItem(journeySectors, state.sectorId)?.label ?? 'Sector not selected'
  const theme = findTaxonomyItem(transformationThemes, state.transformationThemeIds?.[0])?.label
    ?? findTaxonomyItem(customerSituations, state.primarySituationId)?.label
    ?? 'Theme not selected'
  const outcome = findTaxonomyItem(businessOutcomes, state.primaryOutcomeId)?.label
  const capabilities = (state.selectedCapabilityIds ?? []).map((id) => findTaxonomyItem(vodafoneCapabilities, id)?.label).filter(Boolean)
  const completed = progress.overallPercentage === 100
  return { ...workspace, progress, readiness, sector, theme, outcome, capabilities, completed, stageLabel: stageLabels[state.journeyStage] ?? 'Explore' }
}

function OpportunityWorkspaces() {
  const { workspaces, createOpportunityWorkspace, openWorkspace, deleteWorkspace } = useOpportunityWorkspaces()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [sectorFilter, setSectorFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState('all')
  const [readinessFilter, setReadinessFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const [deletePending, setDeletePending] = useState(null)
  const [currentTime] = useState(() => Date.now())

  const rows = useMemo(() => workspaces.map(workspaceView).filter((workspace) => {
    const searchValues = [workspace.navigatorReference, workspace.sector, workspace.theme, workspace.stageLabel, workspace.outcome, ...workspace.capabilities].join(' ').toLowerCase()
    const matchesSearch = searchValues.includes(query.trim().toLowerCase())
    const recent = currentTime - new Date(workspace.updatedAt).getTime() <= 7 * 86400000
    const matchesTab = tab === 'all' || (tab === 'recent' && recent) || (tab === 'in_progress' && !workspace.completed && workspace.state.journeyStage !== 'presales') || (tab === 'presales' && workspace.state.journeyStage === 'presales') || (tab === 'completed' && workspace.completed)
    return matchesSearch && matchesTab && (sectorFilter === 'all' || workspace.state.sectorId === sectorFilter) && (stageFilter === 'all' || workspace.state.journeyStage === stageFilter) && (readinessFilter === 'all' || workspace.readiness.status === readinessFilter)
  }).sort((a, b) => {
    if (sort === 'oldest') return new Date(a.updatedAt) - new Date(b.updatedAt)
    if (sort === 'progress') return b.progress.overallPercentage - a.progress.overallPercentage
    if (sort === 'stage') return Object.keys(stageLabels).indexOf(a.state.journeyStage) - Object.keys(stageLabels).indexOf(b.state.journeyStage)
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  }), [currentTime, query, readinessFilter, sectorFilter, sort, stageFilter, tab, workspaces])

  const createNew = () => {
    createOpportunityWorkspace()
    trackEvent(ANALYTICS_EVENTS.OPPORTUNITY_WORKSPACE_CREATED)
  }
  const open = (workspace) => {
    openWorkspace(workspace.workspaceId)
    trackEvent(ANALYTICS_EVENTS.OPPORTUNITY_WORKSPACE_OPENED, { stage: workspace.state.journeyStage })
  }
  const confirmDelete = (workspace) => {
    deleteWorkspace(workspace.workspaceId)
    setDeletePending(null)
    trackEvent(ANALYTICS_EVENTS.OPPORTUNITY_WORKSPACE_DELETED, { stage: workspace.state.journeyStage })
  }

  return (
    <section className="min-h-screen bg-[#f5f6f7] py-8 sm:py-10" aria-labelledby="workspaces-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.16em] text-[#d90000] uppercase">Structured opportunity management</p><h1 id="workspaces-title" className="mt-2 text-3xl font-bold tracking-[-0.035em] text-slate-900 sm:text-4xl">Opportunity Workspaces</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Manage multiple anonymous Sales → Presales journeys on this device without entering customer-identifiable information.</p></div><button type="button" onClick={createNew} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#e60000] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#bd0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><Plus size={17} aria-hidden="true" />New Opportunity Workspace</button></div>

        {workspaces.length === 0 ? <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center"><BriefcaseBusiness className="mx-auto text-slate-400" size={32} aria-hidden="true" /><h2 className="mt-4 text-lg font-bold text-slate-900">No opportunity workspaces yet.</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">Start a structured Sales → Presales journey without entering customer-identifiable information.</p><button type="button" onClick={createNew} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#e60000] px-4 py-2.5 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><Plus size={17} aria-hidden="true" />New Opportunity Workspace</button></div> : <>
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter opportunity workspaces by status">{tabs.map(([id, label]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)} className={`min-h-10 shrink-0 rounded-lg px-3 py-2 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${tab === id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>{label}</button>)}</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(13rem,1.4fr)_repeat(4,minmax(9rem,1fr))]">
              <label className="relative"><span className="sr-only">Search safe workspace metadata</span><Search className="pointer-events-none absolute top-3 left-3 text-slate-400" size={16} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reference, sector or theme" className="min-h-11 w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm focus:border-[#e60000] focus:outline-none" /></label>
              <label><span className="sr-only">Filter by sector</span><select value={sectorFilter} onChange={(event) => setSectorFilter(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"><option value="all">All sectors</option>{journeySectors.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
              <label><span className="sr-only">Filter by stage</span><select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"><option value="all">All stages</option>{Object.entries(stageLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
              <label><span className="sr-only">Filter by readiness</span><select value={readinessFilter} onChange={(event) => setReadinessFilter(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"><option value="all">All readiness</option><option value="not_assessed">Not assessed</option><option value="more_discovery_needed">More discovery needed</option><option value="ready_with_gaps">Ready with gaps</option><option value="ready">Ready for Presales</option></select></label>
              <label><span className="sr-only">Sort workspaces</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"><option value="recent">Recently updated</option><option value="oldest">Oldest updated</option><option value="progress">Progress</option><option value="stage">Stage</option></select></label>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Search is local, limited to safe workspace metadata and is not saved or tracked.</p>
          </div>

          {rows.length === 0 ? <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">No workspaces match these filters.</p> : <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{rows.map((workspace) => <article key={workspace.workspaceId} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-mono text-xs font-bold text-[#d90000]">{workspace.navigatorReference}</p><h2 className="mt-1 truncate text-base font-bold text-slate-900">{workspace.sector}</h2><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{workspace.theme}</p></div><span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{workspace.stageLabel}</span></div><dl className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3"><div><dt className="text-[9px] font-bold tracking-wide text-slate-400 uppercase">Progress</dt><dd className="mt-1 text-sm font-bold text-slate-800">{workspace.progress.overallPercentage}% addressed</dd></div><div><dt className="text-[9px] font-bold tracking-wide text-slate-400 uppercase">Readiness</dt><dd className="mt-1 text-sm font-bold text-slate-800">{workspace.readiness.label}</dd></div><div><dt className="text-[9px] font-bold tracking-wide text-slate-400 uppercase">Outcome</dt><dd className="mt-1 text-xs font-semibold text-slate-600">{workspace.outcome ?? 'Not selected'}</dd></div><div><dt className="text-[9px] font-bold tracking-wide text-slate-400 uppercase">Capabilities</dt><dd className="mt-1 text-xs font-semibold text-slate-600">{workspace.capabilities.length ? `${workspace.capabilities.length} selected` : 'None selected'}</dd></div></dl><p className="mt-3 text-[11px] font-semibold text-slate-500">{relativeUpdated(workspace.updatedAt, currentTime)}</p>{deletePending === workspace.workspaceId ? <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3"><p className="text-xs font-bold text-slate-800">Delete {workspace.navigatorReference} from this browser?</p><p className="mt-1 text-[11px] leading-4 text-slate-600">This removes only the local prototype workspace.</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => confirmDelete(workspace)} className="min-h-9 rounded-lg bg-[#e60000] px-3 text-xs font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">Delete workspace</button><button type="button" onClick={() => setDeletePending(null)} className="min-h-9 rounded-lg bg-white px-3 text-xs font-bold text-slate-700 ring-1 ring-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">Cancel</button></div></div> : <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => open(workspace)} aria-label={`Open workspace ${workspace.navigatorReference}`} className="min-h-10 flex-1 rounded-lg bg-slate-900 px-3 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">Open workspace</button><button type="button" onClick={() => setDeletePending(workspace.workspaceId)} aria-label={`Delete workspace ${workspace.navigatorReference}`} className="grid size-10 place-items-center rounded-lg text-slate-500 ring-1 ring-slate-300 hover:bg-red-50 hover:text-[#d90000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><Trash2 size={16} aria-hidden="true" /></button></div>}</article>)}</div>}
        </>}
      </div>
    </section>
  )
}

export default OpportunityWorkspaces
