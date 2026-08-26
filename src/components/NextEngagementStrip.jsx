import { Info } from 'lucide-react'
import { useReadiness } from '../context/useReadiness'

function NextEngagementStrip() {
  const { nextEngagement } = useReadiness()

  return (
    <section className="mt-3 flex min-w-0 flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center" aria-labelledby="next-engagement-title">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold tracking-[0.14em] text-blue-700 uppercase">Recommended next engagement</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1"><h3 id="next-engagement-title" className="text-base font-bold text-slate-900">{nextEngagement.label}</h3><p className="text-xs leading-5 text-slate-600">{nextEngagement.reason}</p></div>
      </div>
      <details className="relative shrink-0">
        <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-full bg-white text-blue-700 ring-1 ring-blue-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]" aria-label="Why this engagement is recommended"><Info size={17} aria-hidden="true" /></summary>
        <div className="mt-2 rounded-xl border border-blue-200 bg-white p-3 text-xs leading-5 text-slate-600 sm:absolute sm:right-0 sm:z-20 sm:w-72 sm:shadow-lg">This guidance is derived from the existing structured journey and technical-discovery selections. Confirm the final engagement with the opportunity team.</div>
      </details>
    </section>
  )
}

export default NextEngagementStrip
