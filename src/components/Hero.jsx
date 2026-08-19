import { ArrowDown, ArrowRight, BriefcaseBusiness, CircleCheck, RadioTower, TriangleAlert } from 'lucide-react'

const journey = [
  { label: 'Challenge', icon: TriangleAlert },
  { label: 'Business Outcome', icon: CircleCheck },
  { label: 'Vodafone Capability', icon: RadioTower },
  { label: 'Customer Value', icon: BriefcaseBusiness },
]

function Hero() {
  return (
    <section id="home" className="relative scroll-mt-20 overflow-hidden bg-[#f7f7f7]">
      <div aria-hidden="true" className="hero-orb absolute -top-56 right-[-15rem] size-[42rem] rounded-full" />
      <div aria-hidden="true" className="absolute top-0 left-0 h-1.5 w-full bg-[#e60000]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-bold tracking-[0.18em] text-[#d90000] uppercase shadow-sm">
            <span className="size-1.5 rounded-full bg-[#e60000]" />
            Sales enablement
          </p>
          <h1 className="max-w-4xl text-4xl leading-[1.06] font-bold tracking-[-0.045em] text-[#181818] sm:text-5xl lg:text-[4rem]">
            Turn customer challenges into <span className="text-[#e60000]">stronger conversations.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Sector-specific insight to help Sales identify customer priorities, connect them to business outcomes and position the right Vodafone capabilities.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#sectors" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#e60000] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,0,0,0.2)] transition hover:bg-[#bd0000] hover:shadow-[0_10px_30px_rgba(230,0,0,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">
              Explore sectors
              <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a href="#why-it-matters" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#1b1b1b] transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">
              How to use this tool
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="relative rounded-3xl border border-white bg-white/90 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-7">
          <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-slate-400 uppercase">Conversation pathway</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">From signal to customer value</p>
            </div>
            <span className="grid size-9 place-items-center rounded-full bg-red-50 text-[#e60000]">
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </div>
          <ol className="space-y-2.5">
            {journey.map(({ label, icon: Icon }, index) => (
              <li key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3.5">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${index === journey.length - 1 ? 'bg-red-50 text-[#e60000]' : 'bg-slate-100 text-slate-700'}`}>
                  <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="flex-1 text-sm font-bold text-slate-800">{label}</span>
                <span className="text-xs font-bold text-slate-400">0{index + 1}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default Hero
