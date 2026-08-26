import { ArrowDown } from 'lucide-react'
import { engagementFunnel } from '../data/measurementModel'

const funnelWidths = ['sm:w-full', 'sm:w-[96%]', 'sm:w-[92%]', 'sm:w-[88%]', 'sm:w-[84%]', 'sm:w-[80%]', 'sm:w-[76%]', 'sm:w-[72%]']

function SuccessFunnel({ counts = {} }) {
  return (
    <ol className="mt-6" aria-label="Opportunity engagement funnel">
      {engagementFunnel.map((stage, index) => (
        <li key={stage.event} className="flex flex-col items-center">
          <div className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm ${funnelWidths[index]}`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-slate-900 text-[10px] font-black text-white">{index + 1}</span>
                <span className="text-sm font-bold text-slate-900">{stage.label}</span>
              </div>
              <span className="self-start rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold text-[#d90000] sm:self-auto">{Number.isFinite(counts[stage.event]) ? `${counts[stage.event]} aggregate events` : stage.signal}</span>
            </div>
            <p className="mt-2 break-all font-mono text-[10px] leading-4 text-slate-400">{stage.event}{stage.propertyFilter ? ` · ${stage.propertyFilter}` : ''}</p>
          </div>
          {index < engagementFunnel.length - 1 && <ArrowDown className="my-1 text-slate-300" size={17} aria-hidden="true" />}
        </li>
      ))}
    </ol>
  )
}

export default SuccessFunnel
