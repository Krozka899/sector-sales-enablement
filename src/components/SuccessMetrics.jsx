import { CheckCircle2, Handshake, PoundSterling } from 'lucide-react'
import SectionHeading from './SectionHeading'

const measures = [
  {
    title: 'Engagement',
    icon: Handshake,
    description: 'Track where Presales expertise is shaping priority opportunities.',
    items: [
      'Opportunities with early Presales engagement.',
      'Sector-led discovery sessions and customer workshops.',
      'Presales engagement across priority and strategic opportunities.',
    ],
  },
  {
    title: 'Commercial Impact',
    icon: PoundSterling,
    description: 'Understand the commercial outcomes influenced by Presales.',
    items: [
      'Presales-influenced pipeline.',
      'Win rate on Presales-supported opportunities.',
      'Average deal value.',
      'Multi-product and multi-capability opportunities.',
      'Margin improvement.',
      'Reduction in sales-cycle duration.',
    ],
  },
  {
    title: 'Customer Impact',
    icon: CheckCircle2,
    description: 'Measure stronger alignment, validation and opportunity expansion.',
    items: [
      'Customer stakeholder engagement.',
      'Solution validation and technical acceptance.',
      'Customer feedback following workshops.',
      'Agreed business outcomes and success measures.',
      'Expansion opportunities identified through deeper discovery.',
    ],
  },
]

function SuccessMetrics() {
  return (
    <section id="measure-success" className="scroll-mt-20 bg-[#f5f6f7] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Evidence of impact"
          title="Measure Success"
          description="Measure both Presales activity and the commercial outcomes it influences."
          align="center"
        />

        <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
          {measures.map(({ title, icon: Icon, description, items }, cardIndex) => (
            <article key={title} className={`overflow-hidden rounded-2xl border bg-white ${cardIndex === 1 ? 'border-red-200 shadow-[0_18px_50px_rgba(230,0,0,0.1)]' : 'border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.05)]'}`}>
              <div className={`p-6 ${cardIndex === 1 ? 'bg-[#e60000] text-white' : 'border-b border-slate-200 text-[#1b1b1b]'}`}>
                <span className={`grid size-11 place-items-center rounded-xl ${cardIndex === 1 ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className={`mt-2 text-sm leading-6 ${cardIndex === 1 ? 'text-white/75' : 'text-slate-500'}`}>{description}</p>
              </div>
              <ul className="space-y-3 p-6">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#e60000]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SuccessMetrics
