import { AlertCircle, FileCheck2 } from 'lucide-react'
import { usePresalesSummary } from '../../context/usePresalesSummary'

function RequirementsView() {
  const presalesWorkspaceSummary = usePresalesSummary()
  const { requirements, discovery } = presalesWorkspaceSummary
  const statusItems = [...discovery.common, ...discovery.capabilities]
  const statusCounts = [
    ['Understood', statusItems.filter((item) => item.status === 'understood').length, 'text-emerald-700'],
    ['Partial', statusItems.filter((item) => item.status === 'partially_understood').length, 'text-amber-700'],
    ['Gap', statusItems.filter((item) => item.status === 'gap').length, 'text-red-700'],
    ['Unknown', statusItems.filter((item) => item.status === 'unknown').length, 'text-slate-600'],
    ['Not started', statusItems.filter((item) => item.status === 'not_started').length, 'text-slate-500'],
  ]
  const groupedGaps = Object.entries(discovery.gaps.reduce((groups, gap) => {
    groups[gap.category] = [...(groups[gap.category] ?? []), gap]
    return groups
  }, {}))

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4" aria-labelledby="requirements-title">
          <div className="flex items-center gap-2"><FileCheck2 className="text-[#e60000]" size={18} aria-hidden="true" /><h3 id="requirements-title" className="text-base font-bold text-slate-900">Structured requirements</h3></div>
          <p className="mt-1 text-xs leading-5 text-slate-600">Readable statements are derived from controlled discovery selections; no requirement text is entered.</p>
        </section>
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4" aria-labelledby="readiness-title"><h3 id="readiness-title" className="text-xs font-bold tracking-wide text-blue-800 uppercase">Design readiness</h3><p className="mt-2 text-base font-bold text-slate-900">{discovery.readiness}</p><p className="mt-1 text-xs text-slate-600">Based on meaningful discovery statuses, not a percentage.</p></section>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {statusCounts.map(([label, count, colour]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-3"><dt className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">{label}</dt><dd className={`mt-1 text-xl font-bold ${colour}`}>{count}</dd></div>)}
      </dl>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {Object.entries(requirements).map(([group, statements]) => (
          <section key={group} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-bold text-slate-900">{group}</h4>
            {statements.length ? <ul className="mt-2 space-y-1 text-xs leading-5 text-slate-700">{statements.map((statement) => <li key={statement}>• {statement}</li>)}</ul> : <p className="mt-2 text-xs text-slate-400">No structured requirement established yet.</p>}
          </section>
        ))}
      </div>

      <section className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4" aria-labelledby="technical-gaps-title">
        <div className="flex items-center gap-2"><AlertCircle className="text-amber-700" size={18} aria-hidden="true" /><h3 id="technical-gaps-title" className="text-sm font-bold text-slate-900">What still needs discovery?</h3></div>
        {groupedGaps.length ? <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{groupedGaps.map(([group, gaps]) => <div key={group}><p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">{group.replaceAll('_', ' ')}</p><ul className="mt-1 space-y-1 text-xs text-slate-700">{gaps.map((gap) => <li key={`${gap.source}-${gap.label}`}>• {gap.label} — {gap.status.replaceAll('_', ' ')}</li>)}</ul></div>)}</div> : <p className="mt-3 text-xs text-slate-600">No structured discovery gaps remain.</p>}
      </section>
    </div>
  )
}

export default RequirementsView
