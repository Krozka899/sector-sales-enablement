import { useId, useState } from 'react'
import { Info, X } from 'lucide-react'

function QuestionHelp({ guidance }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  if (!guidance) return null

  return (
    <span className="relative inline-flex align-middle" onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false) }}>
      <button type="button" aria-label={`Help: ${guidance.title}`} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">
        <Info size={15} aria-hidden="true" />
      </button>
      {open && (
        <span id={panelId} className="absolute right-0 z-30 mt-9 w-[min(22rem,calc(100vw-2.5rem))] rounded-xl border border-slate-200 bg-white p-4 text-left normal-case shadow-xl" role="note">
          <span className="flex items-start justify-between gap-3"><strong className="text-sm text-slate-900">{guidance.title}</strong><button type="button" aria-label="Close help" onClick={() => setOpen(false)} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#e60000]"><X size={14} aria-hidden="true" /></button></span>
          <span className="mt-3 block text-[10px] font-bold tracking-wide text-[#d90000] uppercase">Why we're asking</span><span className="mt-1 block text-xs leading-5 font-normal text-slate-600">{guidance.why}</span>
          <span className="mt-3 block text-[10px] font-bold tracking-wide text-slate-500 uppercase">Think about</span><span className="mt-1 block text-xs leading-5 font-normal text-slate-600">{guidance.thinkAbout}</span>
          {guidance.example && <><span className="mt-3 block text-[10px] font-bold tracking-wide text-slate-500 uppercase">Example</span><span className="mt-1 block text-xs leading-5 font-normal text-slate-600">{guidance.example}</span></>}
          {guidance.privacyNote && <><span className="mt-3 block text-[10px] font-bold tracking-wide text-blue-700 uppercase">You don't need</span><span className="mt-1 block text-xs leading-5 font-normal text-slate-600">{guidance.privacyNote}</span></>}
        </span>
      )}
    </span>
  )
}

export default QuestionHelp
