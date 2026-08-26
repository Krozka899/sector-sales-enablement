import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  BadgePoundSterling,
  Check,
  CircleHelp,
  Clipboard,
  CodeXml,
  Copy,
  Factory,
  GraduationCap,
  HardHat,
  HeartPulse,
  Landmark,
  MessageSquareText,
  RadioTower,
  Store,
  Target,
  Truck,
  Zap,
} from 'lucide-react'
import { sectors } from '../data/sectors'
import { useJourney } from '../context/useJourney'
import { getJourneySectorId } from '../utils/journeyAdapters'
import { trackEvent } from '../utils/analytics'
import { ANALYTICS_EVENTS } from '../utils/analyticsEvents'
import SectionHeading from './SectionHeading'

const sectorIcons = {
  truck: Truck,
  factory: Factory,
  store: Store,
  code: CodeXml,
  'hard-hat': HardHat,
  landmark: Landmark,
  'heart-pulse': HeartPulse,
  'badge-pound-sterling': BadgePoundSterling,
  zap: Zap,
  'graduation-cap': GraduationCap,
}

const categories = [
  {
    id: 'challenges',
    label: 'Customer Challenges',
    shortLabel: 'Challenges',
    icon: AlertTriangle,
    accent: 'amber',
    analyticsValue: 'customer_challenges',
    helper: 'Operational and strategic pressures to listen for',
  },
  {
    id: 'outcomes',
    label: 'Business Outcomes',
    shortLabel: 'Outcomes',
    icon: Target,
    accent: 'emerald',
    analyticsValue: 'business_outcomes',
    helper: 'The results the customer is likely working towards',
  },
  {
    id: 'capabilities',
    label: 'Why Vodafone',
    shortLabel: 'Why Vodafone',
    icon: RadioTower,
    accent: 'red',
    analyticsValue: 'why_vodafone',
    helper: 'Relevant capabilities to connect to the requirement',
  },
  {
    id: 'questions',
    label: 'Discovery Questions',
    shortLabel: 'Questions',
    icon: MessageSquareText,
    accent: 'blue',
    analyticsValue: 'discovery_questions',
    helper: 'Prompts to open a more valuable customer conversation',
  },
]

const accentStyles = {
  amber: { icon: 'bg-amber-50 text-amber-700', number: 'text-amber-700', line: 'bg-amber-400' },
  emerald: { icon: 'bg-emerald-50 text-emerald-700', number: 'text-emerald-700', line: 'bg-emerald-500' },
  red: { icon: 'bg-red-50 text-[#e60000]', number: 'text-[#d90000]', line: 'bg-[#e60000]' },
  blue: { icon: 'bg-blue-50 text-blue-700', number: 'text-blue-700', line: 'bg-blue-500' },
}

function SectorExplorer() {
  const { state: journeyState, setSector: setJourneySector } = useJourney()
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0].id)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [copyError, setCopyError] = useState(false)
  const copyTimer = useRef(null)

  const selectedSectorId = journeyState.sectorId ?? sectors[0].id
  const selectedSector = sectors.find((sector) => sector.id === selectedSectorId)
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId)
  const items = selectedSector[selectedCategoryId]
  const CategoryIcon = selectedCategory.icon
  const styles = accentStyles[selectedCategory.accent]

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const selectSector = (sectorId) => {
    const sector = sectors.find((item) => item.id === sectorId)
    trackEvent(ANALYTICS_EVENTS.SECTOR_SELECTED, { sector: sector.name })
    setJourneySector(getJourneySectorId(sectorId))
    setSelectedCategoryId('challenges')
    setCopiedIndex(null)
    setCopyError(false)
  }

  const selectCategory = (categoryId) => {
    if (categoryId === selectedCategoryId) return

    const category = categories.find((item) => item.id === categoryId)
    trackEvent(ANALYTICS_EVENTS.CONVERSATION_TAB_SELECTED, {
      sector: selectedSector.name,
      tab: category.analyticsValue,
    })
    setSelectedCategoryId(categoryId)
    setCopiedIndex(null)
    setCopyError(false)
  }

  const handleTabKeyDown = (event) => {
    const supportedKeys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!supportedKeys.includes(event.key)) return

    event.preventDefault()
    const currentIndex = categories.findIndex((category) => category.id === selectedCategoryId)
    let nextIndex = currentIndex

    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + categories.length) % categories.length
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % categories.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = categories.length - 1

    const nextCategory = categories[nextIndex]
    selectCategory(nextCategory.id)
    window.requestAnimationFrame(() => document.getElementById(`tab-${nextCategory.id}`)?.focus())
  }

  const copyQuestion = async (question, index) => {
    try {
      await navigator.clipboard.writeText(question)
      setCopiedIndex(index)
      setCopyError(false)
      window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopiedIndex(null), 1800)
    } catch {
      setCopiedIndex(null)
      setCopyError(true)
    }
  }

  return (
    <section id="sectors" className="scroll-mt-20 bg-[#f5f6f7] py-20 sm:py-24 laptop:py-14 2xl:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sector explorer"
          title="Explore by sector"
          description="Select your customer's sector to prepare for a stronger conversation."
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 laptop:mt-6 laptop:gap-2 2xl:mt-10 2xl:gap-3" role="group" aria-label="Available sectors">
          {sectors.map((sector) => {
            const Icon = sectorIcons[sector.icon]
            const selected = sector.id === selectedSectorId

            return (
              <button
                key={sector.id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectSector(sector.id)}
                className={`group relative min-h-40 overflow-hidden rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] laptop:min-h-[104px] laptop:p-3.5 2xl:min-h-40 2xl:p-4 ${
                  selected
                    ? 'border-[#e60000] bg-[#e60000] text-white shadow-[0_16px_40px_rgba(230,0,0,0.2)]'
                    : 'border-slate-200 bg-white text-[#1b1b1b] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg'
                }`}
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl laptop:size-9 2xl:size-10 ${selected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-red-50 group-hover:text-[#e60000]'}`}>
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="block min-w-0 pr-4">
                  <span className="mt-3 block text-sm leading-snug font-bold laptop:mt-2 2xl:mt-3">{sector.name}</span>
                  <span className={`mt-1.5 block text-xs leading-5 ${selected ? 'text-white/75' : 'text-slate-500'}`}>{sector.description}</span>
                </span>
                {selected && <Check className="absolute top-4 right-4 laptop:top-3.5 laptop:right-3.5" size={18} aria-hidden="true" />}
              </button>
            )
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)] laptop:mt-5 2xl:mt-8">
          <div className="border-b border-slate-200 px-5 py-6 sm:px-8 laptop:px-6 laptop:py-3.5 2xl:px-8 2xl:py-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-[#d90000] uppercase">
                  <Clipboard size={14} aria-hidden="true" />
                  Conversation guide
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#1b1b1b] sm:text-3xl">{selectedSector.name}</h3>
              </div>
              <p className="text-sm font-medium text-slate-500">Choose a lens to focus the conversation</p>
            </div>
          </div>

          <div className="overflow-x-auto border-b border-slate-200 px-3 sm:px-6">
            <div role="tablist" aria-label={`${selectedSector.name} conversation categories`} className="flex min-w-max gap-1">
              {categories.map((category) => {
                const Icon = category.icon
                const selected = category.id === selectedCategoryId

                return (
                  <button
                    key={category.id}
                    id={`tab-${category.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="sector-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectCategory(category.id)}
                    onKeyDown={handleTabKeyDown}
                    className={`relative flex items-center gap-2 px-3 py-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#e60000] sm:px-4 laptop:py-3 2xl:py-4 ${
                      selected ? 'text-[#1b1b1b]' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon size={17} aria-hidden="true" />
                    <span className="sm:hidden">{category.shortLabel}</span>
                    <span className="hidden sm:inline">{category.label}</span>
                    {selected && <span className={`absolute right-3 bottom-0 left-3 h-0.5 ${styles.line}`} />}
                  </button>
                )
              })}
            </div>
          </div>

          <div
            id="sector-panel"
            role="tabpanel"
            aria-labelledby={`tab-${selectedCategoryId}`}
            className="p-5 sm:p-8 laptop:p-4 2xl:p-8"
          >
            <div className="mb-6 flex items-start gap-4 laptop:mb-3 2xl:mb-6">
              <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${styles.icon}`}>
                <CategoryIcon size={21} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div>
                <h4 className="text-xl font-bold tracking-[-0.02em] text-[#1b1b1b]">{selectedCategory.label}</h4>
                <p className="mt-1 text-sm text-slate-500">{selectedCategory.helper}</p>
              </div>
            </div>

            <ol className="grid gap-3 lg:grid-cols-2 laptop:gap-2 2xl:gap-3">
              {items.map((item, index) => (
                <li key={item} className="group flex min-h-[88px] items-start gap-4 rounded-2xl border border-slate-200 bg-[#fafafa] p-4 transition-colors hover:border-slate-300 hover:bg-white laptop:min-h-[72px] laptop:gap-3 laptop:p-3 2xl:min-h-[88px] 2xl:gap-4 2xl:p-4">
                  <span className={`pt-0.5 text-xs font-black ${styles.number}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex-1 text-sm leading-6 font-medium text-slate-700">{item}</span>
                  {selectedCategoryId === 'questions' && (
                    <button
                      type="button"
                      aria-label={copiedIndex === index ? `Question ${index + 1} copied` : `Copy question ${index + 1}`}
                      onClick={() => copyQuestion(item, index)}
                      className="relative grid size-10 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-[#e60000]"
                    >
                      {copiedIndex === index && (
                        <span className="absolute -top-8 right-0 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-bold text-white shadow-sm" aria-hidden="true">
                          Copied
                        </span>
                      )}
                      {copiedIndex === index ? <Check size={17} className="text-emerald-600" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                    </button>
                  )}
                </li>
              ))}
            </ol>
            <p className="sr-only" aria-live="polite">{copiedIndex !== null ? 'Question copied to clipboard' : copyError ? 'Question could not be copied. Try again.' : ''}</p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-900 px-4 py-3 text-white sm:items-center laptop:mt-3 2xl:mt-5">
          <CircleHelp size={18} className="mt-0.5 shrink-0 text-red-300 sm:mt-0" aria-hidden="true" />
          <p className="text-sm leading-6 text-white/80">
            Use these prompts as a starting point, then follow the customer's language and priorities.
          </p>
        </div>
      </div>
    </section>
  )
}

export default SectorExplorer
