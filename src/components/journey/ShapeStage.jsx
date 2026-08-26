import { ArrowDown, ArrowLeft, ArrowRight, Check, Lightbulb, Sparkles } from 'lucide-react'
import { useJourney } from '../../context/useJourney'
import { capabilityKnowledge } from '../../data/capabilityKnowledge'
import { businessOutcomes, findTaxonomyItem, transformationThemes, vodafoneCapabilities } from '../../data/journeyTaxonomies'
import { trackEvent } from '../../utils/analytics'
import { ANALYTICS_EVENTS } from '../../utils/analyticsEvents'
import QuestionHelp from '../QuestionHelp'
import { getQuestionGuidance } from '../../data/questionGuidance'
import { ChoiceButton, ContinueButton, StageHeader } from './JourneyControls'

function OutcomeCard({ outcome, recommended, selected, primary, onToggle, onPrimary }) {
  return (
    <div className={`flex min-w-0 flex-col rounded-xl border p-3 ${selected ? 'border-[#e60000] bg-red-50' : 'border-slate-200 bg-white'}`}>
      <button type="button" aria-pressed={selected} onClick={onToggle} className="flex min-h-20 w-full min-w-0 flex-1 flex-col items-stretch rounded-lg text-left text-sm font-bold text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">
        <span className="flex min-w-0 items-start justify-between gap-2">
          <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${selected ? 'border-[#e60000] bg-[#e60000] text-white' : 'border-slate-300'}`}>{selected && <Check size={12} strokeWidth={3} aria-hidden="true" />}</span>
          {recommended && <span className="max-w-full shrink rounded-full bg-white px-2 py-1 text-[9px] leading-none font-bold tracking-wide text-slate-500 uppercase">Recommended</span>}
        </span>
        <span className="mt-2 block min-w-0 break-words text-sm leading-5">{outcome.label}</span>
      </button>
      {selected && (
        <button type="button" aria-pressed={primary} onClick={onPrimary} className={`mt-3 min-h-9 w-full rounded-lg border px-2 py-1.5 text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${primary ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'}`}>
          {primary ? 'Primary outcome' : 'Make primary'}
        </button>
      )}
    </div>
  )
}

function ShapeStage({ activeSection = 'outcomes', onSectionChange, onBack, onContinue }) {
  const {
    state,
    progress,
    recommendations,
    toggleOutcome,
    setPrimaryOutcome,
    toggleTheme,
    toggleCapability,
  } = useJourney()
  const recommendedOutcomeIds = recommendations.outcomes.map((item) => item.id)
  const recommendedThemeIds = recommendations.themes.map((item) => item.id)
  const recommendedCapabilityIds = recommendations.capabilities.map((item) => item.id)

  const acceptRecommendedCapabilities = () => {
    recommendations.capabilities.forEach(({ id }) => {
      if (state.selectedCapabilityIds.includes(id)) return
      toggleCapability(id)
      trackEvent(ANALYTICS_EVENTS.CAPABILITY_RECOMMENDED, { capability: id, sector: state.sectorId })
    })
  }

  return (
    <div>
      <StageHeader eyebrow="03 Shape" title="Connect the situation to outcomes and capability areas" description="Recommendations explain likely relevance; they never make a decision for you. Confirm a primary outcome, transformation themes and potential Vodafone capabilities." />

      {activeSection === 'outcomes' && <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center text-xs font-bold text-slate-700 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-center">
        <span className="rounded-lg bg-white px-3 py-2">Customer situation</span><ArrowDown className="mx-auto sm:-rotate-90" size={15} aria-hidden="true" />
        <span className="rounded-lg bg-white px-3 py-2">Business outcome</span><ArrowDown className="mx-auto sm:-rotate-90" size={15} aria-hidden="true" />
        <span className="rounded-lg bg-white px-3 py-2">Transformation theme</span><ArrowDown className="mx-auto sm:-rotate-90" size={15} aria-hidden="true" />
        <span className="rounded-lg bg-red-50 px-3 py-2 text-[#d90000]">Capabilities to explore</span>
      </div>}

      {activeSection === 'outcomes' && <fieldset className="mt-6">
        <legend className="text-sm font-bold text-slate-900">Business outcomes <span className="font-normal text-slate-500">(select multiple and mark one primary)</span> <QuestionHelp guidance={getQuestionGuidance('business_outcomes')} label="Business outcome guidance" /></legend>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {businessOutcomes.map((outcome) => (
            <OutcomeCard
              key={outcome.id}
              outcome={outcome}
              recommended={recommendedOutcomeIds.includes(outcome.id)}
              selected={state.businessOutcomeIds.includes(outcome.id)}
              primary={state.primaryOutcomeId === outcome.id}
              onToggle={() => {
                const selected = !state.businessOutcomeIds.includes(outcome.id)
                toggleOutcome(outcome.id)
                trackEvent(ANALYTICS_EVENTS.BUSINESS_OUTCOME_SELECTED, { outcome: outcome.id, selected, primary: false })
              }}
              onPrimary={() => {
                setPrimaryOutcome(outcome.id)
                trackEvent(ANALYTICS_EVENTS.BUSINESS_OUTCOME_SELECTED, { outcome: outcome.id, selected: true, primary: true })
              }}
            />
          ))}
        </div>
      </fieldset>}

      {activeSection === 'themes' && (
        <fieldset>
          <legend className="text-sm font-bold text-slate-900">Transformation themes <span className="font-normal text-slate-500">(confirm the themes that fit)</span> <QuestionHelp guidance={getQuestionGuidance('transformation_themes')} label="Transformation theme guidance" /></legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {transformationThemes.map((theme) => (
              <ChoiceButton key={theme.id} label={theme.label} suggested={recommendedThemeIds.includes(theme.id)} selected={state.transformationThemeIds.includes(theme.id)} onClick={() => {
                const selected = !state.transformationThemeIds.includes(theme.id)
                toggleTheme(theme.id)
                trackEvent(ANALYTICS_EVENTS.TRANSFORMATION_THEME_SELECTED, { theme: theme.id, selected })
              }} />
            ))}
          </div>
        </fieldset>
      )}

      {activeSection === 'capabilities' && (
        <section aria-labelledby="capability-selection-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h4 id="capability-selection-title" className="text-sm font-bold text-slate-900">Vodafone capabilities to explore <QuestionHelp guidance={getQuestionGuidance('capabilities')} label="Capability guidance" /></h4>
              <p className="mt-1 text-xs text-slate-500">Recommendations indicate conversation relevance, not a definitive solution architecture. Select the areas to carry forward.</p>
            </div>
            {recommendations.capabilities.some(({ id }) => !state.selectedCapabilityIds.includes(id)) && (
              <button type="button" onClick={acceptRecommendedCapabilities} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-[#d90000] hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">
                <Sparkles size={14} aria-hidden="true" /> Accept recommendations
              </button>
            )}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {vodafoneCapabilities.map((capability) => {
              const recommendation = recommendations.capabilities.find((item) => item.id === capability.id)
              return (
                <ChoiceButton key={capability.id} label={capability.label} suggested={recommendedCapabilityIds.includes(capability.id)} description={recommendation?.reasons[0]} selected={state.selectedCapabilityIds.includes(capability.id)} onClick={() => {
                  const selected = !state.selectedCapabilityIds.includes(capability.id)
                  toggleCapability(capability.id)
                  trackEvent(ANALYTICS_EVENTS.CAPABILITY_SELECTED, { capability: capability.id, selected })
                }} />
              )
            })}
          </div>
        </section>
      )}

      {activeSection === 'guidance' && (
        <section aria-labelledby="vodafone-angles-title">
          <div className="flex items-center gap-2"><Lightbulb className="text-[#e60000]" size={18} aria-hidden="true" /><h4 id="vodafone-angles-title" className="text-sm font-bold text-slate-900">Vodafone angles to consider</h4></div>
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            {state.selectedCapabilityIds.map((id) => (
              <div key={id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-bold text-slate-900">{findTaxonomyItem(vodafoneCapabilities, id)?.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{capabilityKnowledge[id]?.angle}</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-bold text-[#d90000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">View discovery guidance</summary>
                  <div className="mt-2 border-t border-slate-200 pt-2 text-xs leading-5 text-slate-600">
                    <p><strong className="text-slate-700">Listen for:</strong> {capabilityKnowledge[id]?.triggers.slice(0, 3).join(', ')}</p>
                    <p className="mt-1"><strong className="text-slate-700">Consider:</strong> {capabilityKnowledge[id]?.considerations.slice(0, 3).join(', ')}</p>
                    <p className="mt-1"><strong className="text-slate-700">Presales:</strong> {capabilityKnowledge[id]?.presales}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <button type="button" onClick={() => activeSection === 'outcomes' ? onBack() : onSectionChange(activeSection === 'themes' ? 'outcomes' : activeSection === 'capabilities' ? 'themes' : 'capabilities')} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><ArrowLeft size={16} aria-hidden="true" /> Back</button>
        {activeSection === 'outcomes' && state.primaryOutcomeId && <ContinueButton onClick={() => onSectionChange('themes')}>Continue to Themes <ArrowRight size={16} aria-hidden="true" /></ContinueButton>}
        {activeSection === 'themes' && state.transformationThemeIds.length > 0 && <ContinueButton onClick={() => onSectionChange('capabilities')}>Continue to Capabilities <ArrowRight size={16} aria-hidden="true" /></ContinueButton>}
        {activeSection === 'capabilities' && state.selectedCapabilityIds.length > 0 && <ContinueButton onClick={() => onSectionChange('guidance')}>Continue to Guidance <ArrowRight size={16} aria-hidden="true" /></ContinueButton>}
        {activeSection === 'guidance' && progress.shape && <ContinueButton onClick={onContinue}>Continue to Prepare <ArrowRight size={16} aria-hidden="true" /></ContinueButton>}
      </div>
    </div>
  )
}

export default ShapeStage
