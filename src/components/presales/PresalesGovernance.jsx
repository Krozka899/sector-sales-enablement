import { useJourney } from '../../context/useJourney'
import { assumptionOptions, assumptionStatuses, dependencyOptions, riskImpactOptions, technicalRiskOptions } from '../../data/presalesDiscovery'

function PresalesGovernance({ view = 'assumptions' }) {
  const { state, setAssumptionStatus, setRiskImpact, toggleDependency } = useJourney()

  return (
    <div className="space-y-5">
      {view === 'assumptions' && <section aria-labelledby="assumptions-title">
        <h3 id="assumptions-title" className="text-base font-bold text-slate-900">Structured assumptions</h3>
        <p className="mt-1 text-sm text-slate-600">Mark only generic assumptions that need to be carried into solution shaping.</p>
        <div className="mt-3 grid gap-2 lg:grid-cols-2">
          {assumptionOptions.map((assumption) => <fieldset key={assumption.id} className="rounded-xl border border-slate-200 bg-white p-3"><legend className="px-1 text-xs font-bold text-slate-800">{assumption.label}</legend><div className="mt-2 flex flex-wrap gap-2">{assumptionStatuses.map((status) => <button key={status.id} type="button" aria-pressed={state.technicalDiscovery.assumptions[assumption.id] === status.id} onClick={() => setAssumptionStatus(assumption.id, status.id)} className={`min-h-8 rounded-lg border px-2.5 py-1 text-[10px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${state.technicalDiscovery.assumptions[assumption.id] === status.id ? 'border-[#e60000] bg-red-50 text-slate-900' : 'border-slate-300 text-slate-600'}`}>{status.label}</button>)}</div></fieldset>)}
        </div>
      </section>}

      {view === 'risks' && <section aria-labelledby="risks-title">
        <h3 id="risks-title" className="text-base font-bold text-slate-900">Technical risks</h3>
        <p className="mt-1 text-sm text-slate-600">Use impact categories only; no narrative or numerical score is collected.</p>
        <details className="mt-3 rounded-xl border border-slate-200 bg-slate-50">
          <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-bold text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">Review risk categories</summary>
          <div className="grid gap-2 border-t border-slate-200 p-3 lg:grid-cols-2">{technicalRiskOptions.map((risk) => <fieldset key={risk.id} className="rounded-xl border border-slate-200 bg-white p-3"><legend className="px-1 text-xs font-bold text-slate-800">{risk.label}</legend><div className="mt-2 flex flex-wrap gap-2">{riskImpactOptions.map((impact) => <button key={impact.id} type="button" aria-pressed={state.technicalDiscovery.risks[risk.id] === impact.id} onClick={() => setRiskImpact(risk.id, impact.id)} className={`min-h-8 rounded-lg border px-2.5 py-1 text-[10px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${state.technicalDiscovery.risks[risk.id] === impact.id ? 'border-[#e60000] bg-red-50 text-slate-900' : 'border-slate-300 text-slate-600'}`}>{impact.label}</button>)}</div></fieldset>)}</div>
        </details>
        {Object.keys(state.technicalDiscovery.risks).length > 0 && <div className="mt-3 flex flex-wrap gap-2">{Object.entries(state.technicalDiscovery.risks).map(([id, impact]) => <span key={id} className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800">{technicalRiskOptions.find((item) => item.id === id)?.label}: {impact}</span>)}</div>}
      </section>}

      {view === 'dependencies' && <fieldset>
        <legend className="text-base font-bold text-slate-900">Dependencies</legend>
        <p className="mt-1 text-sm text-slate-600">Select the generic teams or domains the solution may depend on.</p>
        <div className="mt-3 flex flex-wrap gap-2">{dependencyOptions.map((dependency) => <button key={dependency.id} type="button" aria-pressed={state.technicalDiscovery.dependencies.includes(dependency.id)} onClick={() => toggleDependency(dependency.id)} className={`min-h-9 rounded-lg border px-3 py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${state.technicalDiscovery.dependencies.includes(dependency.id) ? 'border-[#e60000] bg-red-50 text-slate-900' : 'border-slate-300 bg-white text-slate-600'}`}>{dependency.label}</button>)}</div>
      </fieldset>}
    </div>
  )
}

export default PresalesGovernance
