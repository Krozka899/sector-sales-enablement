import { useState } from 'react'
import Navbar from './Navbar'

function AppShell({ activeView, onNavigate, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} activeView={activeView} onNavigate={onNavigate} />
      <div className={`min-w-0 pt-16 transition-[padding] duration-200 motion-reduce:transition-none lg:pt-0 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {children}
      </div>
    </div>
  )
}

export default AppShell
