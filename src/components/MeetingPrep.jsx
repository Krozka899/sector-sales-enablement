import { useEffect, useRef, useState } from 'react'
import {
  BadgeCheck,
  BadgePoundSterling,
  Check,
  ClipboardList,
  CloudCog,
  CodeXml,
  Factory,
  GraduationCap,
  HardHat,
  HeartPulse,
  Landmark,
  LockKeyhole,
  RadioTower,
  Search,
  Shapes,
  ShieldCheck,
  Store,
  Truck,
  Users,
  Wifi,
  Zap,
} from 'lucide-react'
import { conversationStages, meetingPriorities } from '../data/meetingOptions'
import { sectors } from '../data/sectors'
import { useJourney } from '../context/useJourney'
import { useOpportunityWorkspaces } from '../context/useOpportunityWorkspaces'
import { createMeetingBrief } from '../utils/meetingBrief'
import { trackEvent } from '../utils/analytics'
import { ANALYTICS_EVENTS } from '../utils/analyticsEvents'
import MeetingBrief from './MeetingBrief'
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

const priorityIcons = {
  wifi: Wifi,
  'shield-check': ShieldCheck,
  lock: LockKeyhole,
  'cloud-cog': CloudCog,
  users: Users,
  'radio-tower': RadioTower,
}

const stageIcons = {
  search: Search,
  shapes: Shapes,
  'badge-check': BadgeCheck,
}

function StepHeader({ number, question }) {
  return (
    <div className="mb-4 flex items-center gap-3 laptop:mb-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-black text-white">{number}</span>
      <h3 className="text-lg font-bold tracking-[-0.02em] text-[#1b1b1b]">{question}</h3>
    </div>
  )
}

function MeetingPrepFlow() {
  const { state: journeyState, presalesRecommendation } = useJourney()
  const { activeWorkspace } = useOpportunityWorkspaces()
  const journeyContextAvailable = Boolean(activeWorkspace && (journeyState.sectorId || journeyState.primarySituationId || journeyState.businessOutcomeIds.length || journeyState.selectedCapabilityIds.length))
  const [useJourneyContext, setUseJourneyContext] = useState(journeyContextAvailable)
  const [selectedSectorId, setSelectedSectorId] = useState(journeyState.sectorId)
  const [selectedStageId, setSelectedStageId] = useState(journeyState.conversationStageId)
  const [selectedPriorityId, setSelectedPriorityId] = useState(null)
  const [briefGenerated, setBriefGenerated] = useState(false)
  const briefHeadingRef = useRef(null)

  const availableSectors = sectors
  const selectedSector = availableSectors.find((sector) => sector.id === selectedSectorId)
  const selectedPriority = meetingPriorities.find((priority) => priority.id === selectedPriorityId)
  const selectedStage = conversationStages.find((stage) => stage.id === selectedStageId)
  const brief = briefGenerated && selectedSector && selectedPriority && selectedStage
    ? createMeetingBrief(selectedSector, selectedPriority, selectedStage, useJourneyContext ? journeyState : null, useJourneyContext ? presalesRecommendation : null, useJourneyContext ? activeWorkspace?.navigatorReference : null)
    : null

  useEffect(() => {
    if (briefGenerated) briefHeadingRef.current?.focus()
  }, [briefGenerated])

  const selectSector = (sectorId) => {
    if (sectorId === selectedSectorId) return
    const sector = availableSectors.find((item) => item.id === sectorId)
    trackEvent(ANALYTICS_EVENTS.MEETING_SECTOR_SELECTED, { sector: sector.name })
    setSelectedSectorId(sector.id)
    if (sector.id !== journeyState.sectorId) setUseJourneyContext(false)
    setSelectedPriorityId(null)
    setSelectedStageId(null)
    setBriefGenerated(false)
  }

  const selectPriority = (priorityId) => {
    if (priorityId === selectedPriorityId) return
    const priority = meetingPriorities.find((item) => item.id === priorityId)
    trackEvent(ANALYTICS_EVENTS.MEETING_PRIORITY_SELECTED, { priority: priority.analyticsValue })
    setSelectedPriorityId(priorityId)
    setSelectedStageId(useJourneyContext ? journeyState.conversationStageId : null)
    setBriefGenerated(false)
  }

  const selectStage = (stageId) => {
    if (stageId === selectedStageId) return
    const stage = conversationStages.find((item) => item.id === stageId)
    trackEvent(ANALYTICS_EVENTS.MEETING_STAGE_SELECTED, { stage: stage.analyticsValue })
    setSelectedStageId(stageId)
    setBriefGenerated(false)
  }

  const generateBrief = () => {
    trackEvent(ANALYTICS_EVENTS.MEETING_BRIEF_GENERATED, {
      sector: selectedSector.name,
      priority: selectedPriority.analyticsValue,
      stage: selectedStage.analyticsValue,
    })
    setBriefGenerated(true)
  }

  const resetFlow = () => {
    trackEvent(ANALYTICS_EVENTS.MEETING_PREP_RESET, { brief_generated: briefGenerated })
    setSelectedPriorityId(null)
    setBriefGenerated(false)
    window.requestAnimationFrame(() => document.getElementById('meeting-sector-first')?.focus())
  }

  const startFresh = () => {
    setUseJourneyContext(false)
    setSelectedSectorId(null)
    setSelectedPriorityId(null)
    setSelectedStageId(null)
    setBriefGenerated(false)
    window.requestAnimationFrame(() => document.getElementById('meeting-sector-first')?.focus())
  }

  const inheritJourneyContext = () => {
    setUseJourneyContext(true)
    setSelectedSectorId(journeyState.sectorId)
    setSelectedStageId(journeyState.conversationStageId)
    setBriefGenerated(false)
  }

  return (
    <section id="meeting-prep" className="min-h-screen border-y border-slate-200 bg-[#fafafa] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Meeting preparation"
          title="Prepare for my meeting"
          description="Build a quick conversation brief before you meet the customer."
        />
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Select the sector, customer priority and conversation stage to generate a focused meeting guide.
        </p>

        {journeyContextAvailable && <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3"><p className="text-sm text-slate-700"><strong>{useJourneyContext ? `Using context from ${activeWorkspace.navigatorReference}.` : `Context from ${activeWorkspace.navigatorReference} is available.`}</strong> You can still prepare this brief independently.</p><button type="button" onClick={useJourneyContext ? startFresh : inheritJourneyContext} className="min-h-10 rounded-lg bg-white px-3 py-2 text-sm font-bold text-blue-800 ring-1 ring-blue-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">{useJourneyContext ? 'Start fresh' : `Use context from ${activeWorkspace.navigatorReference}`}</button></div>}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:p-7 laptop:mt-6 laptop:p-5 2xl:mt-8 2xl:p-7">
          <fieldset>
            <legend className="sr-only">Which sector are you meeting?</legend>
            <StepHeader number="1" question="Which sector are you meeting?" />
            <div className="grid gap-2.5 sm:grid-cols-2 laptop:grid-cols-5" role="group" aria-label="Select a sector">
              {availableSectors.map((sector, index) => {
                const Icon = sectorIcons[sector.icon]
                const selected = sector.id === selectedSectorId

                return (
                  <button
                    key={sector.id}
                    id={index === 0 ? 'meeting-sector-first' : undefined}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectSector(sector.id)}
                    className={`relative flex min-h-16 items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${
                      selected
                        ? 'border-[#e60000] bg-red-50 text-[#1b1b1b] shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${selected ? 'bg-[#e60000] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="pr-4 text-sm leading-5 font-bold">{sector.name}</span>
                    {selected && <Check className="absolute top-2.5 right-2.5 text-[#e60000]" size={16} aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {selectedSector && (
            <fieldset className="mt-7 border-t border-slate-200 pt-6 laptop:mt-5 laptop:pt-5">
              <legend className="sr-only">What is the main customer priority?</legend>
              <StepHeader number="2" question="What is the main customer priority?" />
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Select a customer priority">
                {meetingPriorities.map((priority) => {
                  const Icon = priorityIcons[priority.icon]
                  const selected = priority.id === selectedPriorityId

                  return (
                    <button
                      key={priority.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => selectPriority(priority.id)}
                      className={`relative flex min-h-14 items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${
                        selected
                          ? 'border-[#e60000] bg-red-50 text-[#1b1b1b] shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${selected ? 'bg-[#e60000] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      <span className="pr-4">{priority.label}</span>
                      {selected && <Check className="absolute top-2.5 right-2.5 text-[#e60000]" size={16} aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {selectedPriority && (
            <fieldset className="mt-7 border-t border-slate-200 pt-6 laptop:mt-5 laptop:pt-5">
              <legend className="sr-only">Where are you in the customer conversation?</legend>
              <StepHeader number="3" question="Where are you in the customer conversation?" />
              <div className="grid gap-2.5 lg:grid-cols-3" role="group" aria-label="Select a conversation stage">
                {conversationStages.map((stage) => {
                  const Icon = stageIcons[stage.icon]
                  const selected = stage.id === selectedStageId

                  return (
                    <button
                      key={stage.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => selectStage(stage.id)}
                      className={`relative rounded-xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] laptop:p-3.5 ${
                        selected
                          ? 'border-[#e60000] bg-red-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`grid size-9 place-items-center rounded-lg ${selected ? 'bg-[#e60000] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="mt-3 block pr-5 text-sm font-bold text-[#1b1b1b]">{stage.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{stage.description}</span>
                      {selected && <Check className="absolute top-3 right-3 text-[#e60000]" size={17} aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {selectedStage && !briefGenerated && (
            <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={generateBrief}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#e60000] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,0,0,0.18)] transition hover:bg-[#bd0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"
              >
                <ClipboardList size={17} aria-hidden="true" />
                Generate meeting brief
              </button>
            </div>
          )}
        </div>

        {brief && <MeetingBrief brief={brief} headingRef={briefHeadingRef} onReset={resetFlow} />}
      </div>
    </section>
  )
}

function MeetingPrep() {
  return <MeetingPrepFlow />
}

export default MeetingPrep
