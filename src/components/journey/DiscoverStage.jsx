import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import { useJourney } from '../../context/useJourney'
import { businessImpacts, whyNowTriggers } from '../../data/discoveryTaxonomies'
import { customerSituations, findTaxonomyItem, journeySectors } from '../../data/journeyTaxonomies'
import { trackEvent } from '../../utils/analytics'
import { ANALYTICS_EVENTS } from '../../utils/analyticsEvents'
import { getQuestionGuidance } from '../../data/questionGuidance'
import QuestionHelp from '../QuestionHelp'
import { ChoiceButton, ContinueButton, StageHeader } from './JourneyControls'

function DiscoverStage({ activeSection = 'situation', onSectionChange, onBack, onContinue }) {
  const {
    state,
    progress,
    setPrimarySituation,
    toggleSupportingSituation,
    toggleWhyNow,
    toggleBusinessImpact,
  } = useJourney()
  const sector = findTaxonomyItem(journeySectors, state.sectorId)
  const recommendedIds = sector?.situationIds ?? []
  const recommended = recommendedIds.map((id) => findTaxonomyItem(customerSituations, id)).filter(Boolean)
  const otherSituations = customerSituations.filter((item) => !recommendedIds.includes(item.id))

  const choosePrimary = (situationId) => {
    setPrimarySituation(situationId)
    trackEvent(ANALYTICS_EVENTS.CUSTOMER_SITUATION_SELECTED, { situation: situationId, sector: state.sectorId, primary: true })
  }

  return (
    <div>
      <StageHeader eyebrow="02 Discover" title="What are you hearing from the customer?" description="Choose one primary situation and up to two supporting signals, then capture the urgency and business impact using anonymous structured choices." />

      {activeSection === 'situation' && <fieldset>
        <legend className="text-sm font-bold text-slate-900">Recommended for {sector?.label}</legend>
        <p className="mt-1 text-xs text-slate-500">Choose the signal that best represents the current conversation.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label="Recommended customer situations">
          {recommended.map((situation) => (
            <ChoiceButton key={situation.id} label={situation.label} suggested selected={state.primarySituationId === situation.id} onClick={() => choosePrimary(situation.id)} />
          ))}
        </div>
      </fieldset>}

      {activeSection === 'situation' && <details className="group mt-4 rounded-xl border border-slate-200 bg-slate-50">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">
          Browse all other common situations
          <ChevronDown className="transition group-open:rotate-180" size={17} aria-hidden="true" />
        </summary>
        <div className="grid gap-2 border-t border-slate-200 p-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherSituations.map((situation) => (
            <ChoiceButton key={situation.id} label={situation.label} selected={state.primarySituationId === situation.id} onClick={() => choosePrimary(situation.id)} />
          ))}
        </div>
      </details>}

      {activeSection === 'situation' && state.primarySituationId && (
        <fieldset className="mt-6 border-t border-slate-200 pt-5">
          <legend className="text-sm font-bold text-slate-900">Supporting situations <span className="font-normal text-slate-500">(optional, select up to two)</span></legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.filter((item) => item.id !== state.primarySituationId).map((situation) => (
              <ChoiceButton key={situation.id} label={situation.label} selected={state.supportingSituationIds.includes(situation.id)} disabled={!state.supportingSituationIds.includes(situation.id) && state.supportingSituationIds.length >= 2} onClick={() => toggleSupportingSituation(situation.id)} />
            ))}
          </div>
        </fieldset>
      )}

      {activeSection === 'why_now' && (
        <fieldset>
          <legend className="text-sm font-bold text-slate-900">Why now? <span className="font-normal text-slate-500">(select the relevant triggers)</span> <QuestionHelp guidance={getQuestionGuidance('why_now')} label="Why now guidance" /></legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {whyNowTriggers.map((trigger) => (
              <ChoiceButton key={trigger.id} label={trigger.label} selected={state.whyNowIds.includes(trigger.id)} onClick={() => {
                toggleWhyNow(trigger.id)
                trackEvent(ANALYTICS_EVENTS.WHY_NOW_SELECTED, { trigger: trigger.id, sector: state.sectorId })
              }} />
            ))}
          </div>
        </fieldset>
      )}

      {activeSection === 'business_impact' && (
        <fieldset>
          <legend className="text-sm font-bold text-slate-900">What is the business impact? <span className="font-normal text-slate-500">(select all that apply)</span> <QuestionHelp guidance={getQuestionGuidance('business_impact')} label="Business impact guidance" /></legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {businessImpacts.map((impact) => (
              <ChoiceButton key={impact.id} label={impact.label} selected={state.businessImpactIds.includes(impact.id)} onClick={() => {
                toggleBusinessImpact(impact.id)
                trackEvent(ANALYTICS_EVENTS.BUSINESS_IMPACT_SELECTED, { impact: impact.id })
              }} />
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <button type="button" onClick={() => activeSection === 'situation' ? onBack() : onSectionChange(activeSection === 'why_now' ? 'situation' : 'why_now')} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><ArrowLeft size={16} aria-hidden="true" /> Back</button>
        {activeSection === 'situation' && state.primarySituationId && <ContinueButton onClick={() => onSectionChange('why_now')}>Continue to Why now <ArrowRight size={16} aria-hidden="true" /></ContinueButton>}
        {activeSection === 'why_now' && state.whyNowIds.length > 0 && <ContinueButton onClick={() => onSectionChange('business_impact')}>Continue to Business impact <ArrowRight size={16} aria-hidden="true" /></ContinueButton>}
        {activeSection === 'business_impact' && progress.discover && <ContinueButton onClick={onContinue}>Continue to Shape <ArrowRight size={16} aria-hidden="true" /></ContinueButton>}
      </div>
    </div>
  )
}

export default DiscoverStage
