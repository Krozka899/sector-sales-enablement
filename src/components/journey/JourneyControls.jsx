import { Check } from 'lucide-react'

export function ChoiceButton({ id, selected, suggested = false, label, onClick, description, disabled = false }) {
  return (
    <button
      type="button"
      id={id}
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={`relative flex min-h-12 w-full min-w-0 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] disabled:cursor-not-allowed disabled:opacity-55 ${suggested ? 'flex-col items-stretch' : 'items-start gap-2'} ${
        selected ? 'border-[#e60000] bg-red-50 text-slate-900 shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      {suggested ? (
        <>
          <span className="flex min-w-0 items-start justify-between gap-2">
            <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${selected ? 'border-[#e60000] bg-[#e60000] text-white' : 'border-slate-300 bg-white'}`}>{selected && <Check size={12} strokeWidth={3} aria-hidden="true" />}</span>
            <span className="max-w-full shrink rounded-full bg-slate-100 px-2 py-1 text-[9px] leading-none font-bold tracking-wide text-slate-500 uppercase">Recommended</span>
          </span>
          <span className="min-w-0 break-words">
            <span className="block">{label}</span>
            {description && <span className="mt-0.5 block text-xs leading-5 font-normal text-slate-500">{description}</span>}
          </span>
        </>
      ) : (
        <>
          <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${selected ? 'border-[#e60000] bg-[#e60000] text-white' : 'border-slate-300 bg-white'}`}>{selected && <Check size={12} strokeWidth={3} aria-hidden="true" />}</span>
          <span className="min-w-0 flex-1 break-words">
            <span className="block">{label}</span>
            {description && <span className="mt-0.5 block text-xs leading-5 font-normal text-slate-500">{description}</span>}
          </span>
        </>
      )}
    </button>
  )
}

export function StageHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-bold tracking-[0.15em] text-[#d90000] uppercase">{eyebrow}</p>
      <h3 className="mt-1 text-xl font-bold tracking-[-0.025em] text-slate-900">{title}</h3>
      <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}

export function ContinueButton({ children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#e60000] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#bd0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">
      {children}
    </button>
  )
}
