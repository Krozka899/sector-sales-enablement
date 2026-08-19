import { ArrowUpRight } from 'lucide-react'

function FinalCta() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#e60000] px-6 py-12 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-14 lg:py-14">
          <div aria-hidden="true" className="absolute -right-20 -bottom-40 size-80 rounded-full border-[55px] border-white/10" />
          <div className="relative max-w-3xl">
            <h2 className="text-3xl leading-tight font-bold tracking-[-0.035em] sm:text-4xl">
              Earlier engagement. Better discovery. Stronger differentiation.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
              Sector-specific Presales enables Sales to move the conversation away from individual products and towards the business outcomes that matter most to the customer.
            </p>
          </div>
          <a href="#sectors" className="relative mt-8 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#d90000] shadow-lg transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:mt-0">
            Explore sectors
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default FinalCta
