import { Check } from 'lucide-react'
import { getQuestionGuidance } from '../../data/questionGuidance'
import QuestionHelp from '../QuestionHelp'

const discoveryStatusStyles = {
  understood: 'bg-emerald-50 text-emerald-700',
  partially_understood: 'bg-amber-50 text-amber-700',
  gap: 'bg-red-50 text-red-700',
  unknown: 'bg-slate-100 text-slate-600',
  not_applicable: 'bg-blue-50 text-blue-700',
  not_started: 'bg-slate-100 text-slate-500',
}

export function StatusChip({ status = 'not_started' }) {
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${discoveryStatusStyles[status] ?? discoveryStatusStyles.unknown}`}>{status.replaceAll('_', ' ')}</span>
}

export function DiscoveryField({ field, value, onSet, onToggle, guidanceId }) {
  const selectedValues = Array.isArray(value) ? value : []
  const guidance = getQuestionGuidance(guidanceId, field.id)
  return (
    <fieldset className="rounded-xl border border-slate-200 bg-white p-3">
      <legend className="px-1 text-xs font-bold text-slate-800">{field.label} <QuestionHelp guidance={guidance} label={`${field.label} guidance`} /></legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {field.options.map((option) => {
          const selected = field.type === 'multi' ? selectedValues.includes(option.id) : value === option.id
          return (
            <button key={option.id} type="button" aria-pressed={selected} onClick={() => field.type === 'multi' ? onToggle(field.id, option.id) : onSet(field.id, option.id)} className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${selected ? 'border-[#e60000] bg-red-50 text-slate-900' : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'}`}>
              {selected && <Check size={12} strokeWidth={3} aria-hidden="true" />}{option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
