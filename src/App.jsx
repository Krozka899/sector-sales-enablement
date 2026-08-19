import Benefits from './components/Benefits'
import EngagementModel from './components/EngagementModel'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import Hero from './components/Hero'
import MeetingPrep from './components/MeetingPrep'
import Navbar from './components/Navbar'
import PresalesChecklist from './components/PresalesChecklist'
import SectorExplorer from './components/SectorExplorer'
import SuccessMetrics from './components/SuccessMetrics'

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <a href="#main-content" className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#1b1b1b] shadow-lg transition focus:translate-y-0 focus:outline-2 focus:outline-[#e60000]">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <Benefits />
        <MeetingPrep />
        <SectorExplorer />
        <EngagementModel />
        <PresalesChecklist />
        <SuccessMetrics />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}

export default App
