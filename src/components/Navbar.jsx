import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import BrandMark from './BrandMark'

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Sectors', href: '#sectors' },
  { label: 'Sales & Presales', href: '#sales-presales' },
  { label: 'Measure Success', href: '#measure-success' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8 laptop:h-16 2xl:h-[72px]">
        <a href="#home" className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e60000]">
          <BrandMark />
          <span className="text-[15px] font-bold tracking-[-0.01em] text-[#1b1b1b] sm:text-base">
            Sector Sales Enablement
          </span>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1b1b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-11 place-items-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] md:hidden"
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-slate-200 bg-white px-5 py-3 md:hidden">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-base font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#e60000]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

export default Navbar
