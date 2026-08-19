import { BadgeCheck, Blocks, Expand, Gauge, Search, ShieldCheck } from 'lucide-react'
import SectionHeading from './SectionHeading'

const benefits = [
  {
    title: 'Understand the customer',
    text: "Build a stronger understanding of the customer's sector, priorities and operational challenges.",
    icon: Search,
  },
  {
    title: 'Lead with outcomes',
    text: 'Position solutions around measurable business outcomes rather than individual technologies.',
    icon: Gauge,
  },
  {
    title: 'Build confidence',
    text: 'Increase customer confidence through relevant expertise and credible solution design.',
    icon: BadgeCheck,
  },
  {
    title: 'Expand the opportunity',
    text: 'Identify wider opportunities across connectivity, cloud, security, IoT and managed services.',
    icon: Expand,
  },
  {
    title: 'Remove barriers',
    text: 'Reduce technical objections and accelerate solution validation.',
    icon: ShieldCheck,
  },
  {
    title: 'Improve deal quality',
    text: 'Support stronger deal value, margin and long-term customer outcomes.',
    icon: Blocks,
  },
]

function Benefits() {
  return (
    <section id="why-it-matters" className="scroll-mt-20 bg-white py-20 sm:py-24 laptop:py-14 2xl:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why this matters"
          title="Strengthening Sales through sector-led Presales engagement"
          description="Presales helps Sales turn customer challenges into clear business outcomes and differentiated solution conversations."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 laptop:mt-7 laptop:gap-3 2xl:mt-12 2xl:gap-4">
          {benefits.map(({ title, text, icon: Icon }) => (
            <article key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] laptop:p-4 2xl:p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-red-50 group-hover:text-[#e60000]">
                <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-[-0.02em] text-[#1b1b1b] laptop:mt-3 2xl:mt-5">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-4 rounded-2xl border-l-4 border-[#e60000] bg-[#f7f7f7] p-5 sm:items-center sm:p-6 laptop:mt-5 laptop:p-4 2xl:mt-8 2xl:p-6">
          <span className="mt-1 size-2.5 shrink-0 rounded-full bg-[#e60000] sm:mt-0" />
          <p className="font-semibold leading-7 text-slate-800">
            Bring the right Presales expertise into the opportunity at the right time to help Sales create, shape and win more valuable customer engagements.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Benefits
