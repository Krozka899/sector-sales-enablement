import { Compass, Users } from 'lucide-react'
import { usePresalesSummary } from '../../context/usePresalesSummary'
import { trackEvent } from '../../utils/analytics'
import { ANALYTICS_EVENTS } from '../../utils/analyticsEvents'

function SpecialistsView() {
  const presalesWorkspaceSummary = usePresalesSummary()
  const { specialists, workshop } = presalesWorkspaceSummary

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4" aria-labelledby="specialists-title">
          <div className="flex items-center gap-2"><Users className="text-[#e60000]" size={18} aria-hidden="true" /><h3 id="specialists-title" className="text-base font-bold text-slate-900">Recommended specialist roles</h3></div>
          <div className="mt-3 space-y-2">{specialists.map((item) => <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-sm font-bold text-slate-900">{item.role}</p><p className="mt-1 text-xs leading-5 text-slate-600">{item.reason}</p></div>)}</div>
          {!specialists.length && <p className="mt-3 text-sm text-slate-500">Add capability areas to generate role-based recommendations.</p>}
        </section>
        <section className="rounded-2xl border border-red-200 bg-red-50 p-4" aria-labelledby="workshop-title">
          <div className="flex items-center gap-2"><Compass className="text-[#e60000]" size={18} aria-hidden="true" /><h3 id="workshop-title" className="text-sm font-bold text-slate-900">Recommended next action</h3></div>
          <p className="mt-4 text-xl font-bold text-[#d90000]">{workshop}</p>
          <p className="mt-2 text-xs leading-5 text-slate-600">Guidance derived from capability complexity and current discovery readiness; it does not imply a formally approved process.</p>
          <button type="button" onClick={() => trackEvent(ANALYTICS_EVENTS.WORKSHOP_RECOMMENDED, { workshop_type: workshop.toLowerCase().replaceAll(' ', '_') })} className="mt-4 min-h-9 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-[#d90000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">Acknowledge recommendation</button>
        </section>
      </div>
    </div>
  )
}

export default SpecialistsView
