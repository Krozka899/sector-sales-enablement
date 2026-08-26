import { Check, LockKeyhole } from 'lucide-react'
import { useJourney } from '../context/useJourney'
import { ANALYTICS_EVENTS } from '../utils/analyticsEvents'
import { trackEvent } from '../utils/analytics'

const journeyStages = [
  { id: 'explore', number: '01', label: 'Explore' },
  { id: 'discover', number: '02', label: 'Discover' },
  { id: 'shape', number: '03', label: 'Shape' },
  { id: 'prepare', number: '04', label: 'Prepare' },
  { id: 'qualify', number: '05', label: 'Qualify' },
  { id: 'presales', number: '06', label: 'Presales' },
]

function JourneyNavigator() {
  const { state, progress, presalesRecommendation, setMode, setStage } = useJourney()
  const availability = {
    explore: true,
    discover: progress.explore,
    shape: progress.discover,
    prepare: progress.discover,
    qualify: progress.shape,
    presales: progress.explore,
  }

  const navigate = (stage) => {
    if (!availability[stage]) return
    setMode(stage === 'presales' ? 'presales' : 'sales')
    setStage(stage)
    trackEvent(ANALYTICS_EVENTS.JOURNEY_STAGE_VIEWED, { stage })
    if (['shape', 'prepare', 'qualify', 'presales'].includes(stage)) trackEvent(ANALYTICS_EVENTS.SALES_DISCOVERY_PROGRESSED, { stage })
    if (stage === 'presales') {
      trackEvent(ANALYTICS_EVENTS.PRESALES_MODE_SELECTED)
      trackEvent(ANALYTICS_EVENTS.PRESALES_HANDOVER_VIEWED)
      if (presalesRecommendation.recommended) trackEvent(ANALYTICS_EVENTS.PRESALES_RECOMMENDED, { reason_category: presalesRecommendation.reasonCategories[0] ?? 'structured_context' })
    }
  }

  return (
    <nav aria-label="Sales and Presales journey">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {journeyStages.map((stage) => {
          const current = state.journeyStage === stage.id
          const complete = progress[stage.id]
          const available = availability[stage.id]

          return (
            <li key={stage.id}>
              <button
                type="button"
                disabled={!available}
                aria-current={current ? 'step' : undefined}
                onClick={() => navigate(stage.id)}
                className={`flex min-h-[62px] w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] disabled:cursor-not-allowed ${
                  current
                    ? 'border-[#e60000] bg-red-50 shadow-sm'
                    : complete
                      ? 'border-emerald-200 bg-emerald-50/60 hover:border-emerald-300'
                      : available
                        ? 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                <span className={`grid size-8 shrink-0 place-items-center rounded-lg text-[11px] font-black ${current ? 'bg-[#e60000] text-white' : complete ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {complete ? <Check size={15} aria-hidden="true" /> : !available ? <LockKeyhole size={13} aria-hidden="true" /> : stage.number}
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-800">{stage.label}</span>
                  <span className="mt-0.5 block text-[10px] font-semibold text-slate-500">
                    {current ? 'Current' : complete ? 'Complete' : available ? 'Not started' : 'Complete earlier stage'}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default JourneyNavigator
