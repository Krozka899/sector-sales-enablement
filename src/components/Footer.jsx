import BrandMark from './BrandMark'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#f7f7f7]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 laptop:py-5 2xl:py-8">
        <div className="flex items-center gap-3">
          <BrandMark />
          <div>
            <p className="text-sm font-bold text-[#1b1b1b]">Sector Sales Enablement</p>
            <p className="mt-0.5 text-xs text-slate-500">Internal sales enablement resource</p>
          </div>
        </div>
        <p className="text-xs font-bold tracking-[0.14em] text-slate-500 uppercase">C2 General</p>
      </div>
    </footer>
  )
}

export default Footer
