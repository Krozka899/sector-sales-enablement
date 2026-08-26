import JourneySidebar from './JourneySidebar'
import OpportunityContext from './OpportunityContext'
import OpportunityProgress from './OpportunityProgress'
import NextEngagementStrip from './NextEngagementStrip'

function OpportunityWorkspace({ state, progressModel, activeSection, onNavigateStage, onNavigateSection, children }) {
  const sidebar = <JourneySidebar state={state} progressModel={progressModel} activeSection={activeSection} onNavigateStage={onNavigateStage} onNavigateSection={onNavigateSection} />
  const context = <OpportunityContext />

  return (
    <div className="mt-5">
      <OpportunityProgress progressModel={progressModel} currentStage={state.journeyStage} />
      <div className="mt-3">{sidebar}</div>
      <NextEngagementStrip />
      <div className="mt-3 grid min-w-0 gap-3 xl:grid-cols-[minmax(0,4fr)_minmax(13rem,1fr)] xl:items-start">
        <div className="min-w-0" role="region" aria-label="Active opportunity workspace">
          <details className="mb-3 rounded-xl border border-slate-200 bg-white xl:hidden"><summary className="min-h-11 cursor-pointer list-none px-4 py-3 text-sm font-bold text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">Opportunity summary</summary><div className="border-t border-slate-200 p-4">{context}</div></details>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:p-5">{children}</div>
        </div>
        <aside className="hidden rounded-2xl border border-slate-200 bg-white p-4 xl:sticky xl:top-4 xl:block">{context}</aside>
      </div>
    </div>
  )
}

export default OpportunityWorkspace
