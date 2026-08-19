import { Check, Clock3 } from 'lucide-react'
import SectionHeading from './SectionHeading'

const signals = [
  'The customer requirement is not yet fully defined.',
  'Multiple technologies or solution areas are involved.',
  'The opportunity involves several customer stakeholders.',
  'The customer is discussing transformation rather than a single product.',
  'Technical objections are preventing progress.',
  'A workshop or discovery session would help shape the opportunity.',
  'The opportunity has significant strategic or commercial value.',
  'The customer requires solution validation or architecture expertise.',
]

function PresalesChecklist() {
  return (
    <section className="bg-white py-20 sm:py-24 laptop:py-14 2xl:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 laptop:gap-10 2xl:gap-16">
          <div>
            <SectionHeading
              eyebrow="Practical guidance"
              title="When should I engage Presales?"
              description="Look for these signals as an opportunity develops. One or more is a good reason to start the conversation."
            />
            <div className="mt-7 rounded-2xl bg-red-50 p-5 ring-1 ring-red-100 laptop:mt-5 laptop:p-4 2xl:mt-7 2xl:p-5">
              <Clock3 size={22} className="text-[#e60000]" aria-hidden="true" />
              <p className="mt-3 text-sm leading-6 font-semibold text-slate-800">
                If you're unsure whether Presales should be involved, engage early. It is easier to shape an opportunity before the solution has been defined.
              </p>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 laptop:gap-2.5 2xl:gap-3">
            {signals.map((signal) => (
              <li key={signal} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_5px_18px_rgba(15,23,42,0.04)] laptop:p-3 2xl:p-4">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-red-50 text-[#e60000]">
                  <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className="text-sm leading-6 font-medium text-slate-700">{signal}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default PresalesChecklist
