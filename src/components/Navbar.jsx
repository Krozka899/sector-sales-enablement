import { useEffect, useRef, useState } from 'react'
import {
  BarChart3,
  Compass,
  Home,
  LayoutGrid,
  ClipboardList,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import BrandMark from './BrandMark'

const navigation = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'opportunity-workspaces', label: 'Opportunity Workspaces', icon: Compass },
  { id: 'prepare-meeting', label: 'Prepare for My Meeting', icon: ClipboardList },
  { id: 'sectors', label: 'Sectors', icon: LayoutGrid },
  { id: 'sales-presales', label: 'Sales & Presales', icon: Users },
  { id: 'measure-success', label: 'Measure Success', icon: BarChart3 },
]

function NavigationLinks({ activeView, collapsed = false, onNavigate }) {
  return (
    <nav aria-label="Application navigation">
      <ul className="space-y-1">
        {navigation.map(({ id, label, icon: Icon }) => {
          const active = activeView === id
          return (
            <li key={id}>
              <a
                href={`#/${id}`}
                title={collapsed ? label : undefined}
                aria-label={collapsed ? label : undefined}
                aria-current={active ? 'page' : undefined}
                onClick={(event) => { event.preventDefault(); onNavigate(id) }}
                className={`flex min-h-11 items-center rounded-xl text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} ${active ? 'bg-red-50 text-[#d90000]' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <Icon size={19} className="shrink-0" aria-hidden="true" />
                <span className={collapsed ? 'sr-only' : ''}>{label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function Navbar({ collapsed, onCollapsedChange, activeView, onNavigate }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const firstMobileLinkRef = useRef(null)
  const drawerRef = useRef(null)

  useEffect(() => {
    if (!drawerOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => firstMobileLinkRef.current?.focus())
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
        menuButtonRef.current?.focus()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...drawerRef.current.querySelectorAll('a[href], button:not([disabled])')]
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [drawerOpen])

  const navigate = (view, mobile = false) => {
    onNavigate(view)
    if (mobile) setDrawerOpen(false)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm lg:hidden">
        <a href="#/home" onClick={(event) => { event.preventDefault(); navigate('home') }} className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">
          <BrandMark />
          <span className="text-sm font-bold text-slate-900">Opportunity Navigator</span>
        </a>
        <button ref={menuButtonRef} type="button" aria-expanded={drawerOpen} aria-controls="mobile-application-navigation" aria-label={drawerOpen ? 'Close application navigation' : 'Open application navigation'} onClick={() => setDrawerOpen((open) => !open)} className="grid size-11 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">
          {drawerOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </header>

      <aside className={`fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-slate-200 bg-white transition-[width] duration-200 motion-reduce:transition-none lg:flex ${collapsed ? 'w-20' : 'w-64'}`} aria-label="Application sidebar">
        <a href="#/home" onClick={(event) => { event.preventDefault(); navigate('home') }} title={collapsed ? 'Vodafone Opportunity Navigator' : undefined} className={`flex min-h-20 items-center border-b border-slate-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#e60000] ${collapsed ? 'justify-center px-3' : 'gap-3 px-5'}`}>
          <BrandMark />
          <span className={collapsed ? 'sr-only' : 'text-sm leading-5 font-bold text-slate-900'}>Vodafone Opportunity Navigator</span>
        </a>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <NavigationLinks activeView={activeView} collapsed={collapsed} onNavigate={navigate} />
        </div>
        {!collapsed && (
          <div className="mx-3 mb-3 rounded-xl bg-slate-50 p-3 text-slate-600" role="note">
            <div className="flex items-center gap-2"><ShieldCheck size={15} className="text-blue-700" aria-hidden="true" /><p className="text-[10px] font-bold tracking-wide text-slate-700 uppercase">Privacy by design</p></div>
            <p className="mt-2 text-[11px] leading-4">No customer or personal information is collected. Use structured business selections only.</p>
          </div>
        )}
        <div className="border-t border-slate-200 p-3">
          <button type="button" aria-label={collapsed ? 'Expand application sidebar' : 'Collapse application sidebar'} title={collapsed ? 'Expand sidebar' : undefined} onClick={() => onCollapsedChange(!collapsed)} className={`flex min-h-11 w-full items-center rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${collapsed ? 'justify-center' : 'gap-3 px-3'}`}>
            {collapsed ? <PanelLeftOpen size={19} aria-hidden="true" /> : <PanelLeftClose size={19} aria-hidden="true" />}
            <span className={collapsed ? 'sr-only' : ''}>{collapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        </div>
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div aria-hidden="true" onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-slate-950/35" />
          <aside ref={drawerRef} id="mobile-application-navigation" role="dialog" aria-modal="true" aria-label="Application navigation" className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-slate-200 bg-white shadow-2xl">
            <div className="flex min-h-20 items-center justify-between gap-3 border-b border-slate-200 px-5">
              <div className="flex items-center gap-3"><BrandMark /><span className="text-sm leading-5 font-bold text-slate-900">Vodafone Opportunity Navigator</span></div>
              <button type="button" aria-label="Close application navigation" onClick={() => { setDrawerOpen(false); menuButtonRef.current?.focus() }} className="grid size-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#e60000]"><X size={19} aria-hidden="true" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <nav aria-label="Mobile application navigation">
                <ul className="space-y-1">
                  {navigation.map(({ id, label, icon: Icon }, index) => {
                    const active = activeView === id
                    return <li key={id}><a ref={index === 0 ? firstMobileLinkRef : undefined} href={`#/${id}`} aria-current={active ? 'page' : undefined} onClick={(event) => { event.preventDefault(); navigate(id, true) }} className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${active ? 'bg-red-50 text-[#d90000]' : 'text-slate-700 hover:bg-slate-100'}`}><Icon size={19} aria-hidden="true" />{label}</a></li>
                  })}
                </ul>
              </nav>
            </div>
            <div className="border-t border-slate-200 p-4"><div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600"><strong className="text-slate-800">Privacy by design.</strong> No customer or personal information is collected.</div></div>
          </aside>
        </div>
      )}
    </>
  )
}

export default Navbar
