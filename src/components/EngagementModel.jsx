import { ArrowRight, Compass, Handshake, Lightbulb, Search, Trophy } from 'lucide-react'
import SectionHeading from './SectionHeading'

const steps = [
  {
    number: '01',
    title: 'Engage Early',
    text: 'Bring Presales into opportunities before the solution has been defined.',
    icon: Handshake,
  },
  {
    number: '02',
    title: 'Discover',
    text: 'Understand what the customer is trying to achieve, what is preventing it, the business impact and how success will be measured.',
    icon: Search,
  },
  {
    number: '03',
    title: 'Shape',
    text: 'Translate customer challenges into a solution strategy.',
    icon: Lightbulb,
    featured: true,
  },
  {
    number: '04',
    title: 'Differentiate',
    text: "Position Vodafone around the customer's business requirements rather than competing purely on individual product features or price.",
    icon: Compass,
  },
  {
    number: '05',
    title: 'Win',
    text: 'Support solution validation, stakeholder engagement, technical objection handling and a credible transformation roadmap.',
    icon: Trophy,
  },
]

const shapePath = ['Customer Challenge', 'Business Impact', 'Desired Outcome', 'Vodafone Capability', 'Measurable Value']

function EngagementModel() {
  return (
    <section id="sales-presales" className="scroll-mt-20 bg-[#181818] py-20 sm:py-24 xl:py-16 2xl:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Working together"
          title="Sales & Presales Engagement Model"
          description="Engage Presales early to uncover the wider customer challenge, shape the opportunity and build a differentiated solution conversation."
          light
        />

        <div className="relative mt-12 xl:mt-8 2xl:mt-12">
          <div aria-hidden="true" className="absolute top-8 right-[10%] left-[10%] hidden h-px bg-white/15 lg:block" />
          <ol className="grid gap-4 lg:grid-cols-5">
            {steps.map(({ number, title, text, icon: Icon, featured }) => (
              <li key={title} className={`relative rounded-2xl border p-5 xl:p-4 2xl:p-5 ${featured ? 'border-red-500/60 bg-[#e60000]' : 'border-white/10 bg-white/[0.045]'}`}>
                <div className="flex items-center justify-between">
                  <span className={`relative z-10 grid size-11 place-items-center rounded-xl ${featured ? 'bg-white text-[#e60000]' : 'bg-white/10 text-white'}`}>
                    <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className={`text-xs font-black tracking-wider ${featured ? 'text-white/70' : 'text-white/35'}`}>{number}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-white xl:mt-4 2xl:mt-6">{title}</h3>
                <p className={`mt-2 text-sm leading-6 ${featured ? 'text-white/85' : 'text-white/60'}`}>{text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-5 sm:p-6 xl:mt-4 xl:p-4 2xl:mt-6 2xl:p-6">
          <p className="mb-4 text-xs font-bold tracking-[0.16em] text-red-300 uppercase xl:mb-3 2xl:mb-4">Shape the value story</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {shapePath.map((item, index) => (
              <div key={item} className="contents">
                <span className={`rounded-lg px-3 py-2 text-sm font-semibold ${index === shapePath.length - 1 ? 'bg-[#e60000] text-white' : 'bg-white/10 text-white/85'}`}>{item}</span>
                {index < shapePath.length - 1 && <ArrowRight className="hidden text-white/30 sm:block" size={16} aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EngagementModel
