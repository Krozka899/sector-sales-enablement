import { ArrowDown, ArrowLeft, ArrowRight, MessageSquareText, Users } from 'lucide-react'
import { useJourney } from '../../context/useJourney'
import { getDiscoveryQuestions } from '../../data/discoveryQuestions'
import { conversationStages } from '../../data/meetingOptions'
import { trackEvent } from '../../utils/analytics'
import { ANALYTICS_EVENTS } from '../../utils/analyticsEvents'
import JourneyContextSummary from '../JourneyContextSummary'
import QuestionHelp from '../QuestionHelp'
import { getQuestionGuidance } from '../../data/questionGuidance'
import { ChoiceButton, ContinueButton, StageHeader } from './JourneyControls'

function PrepareStage({ onBack, onContinue }) {
  const { state, presalesRecommendation, setConversationStage } = useJourney()
  const questions = getDiscoveryQuestions(state.selectedCapabilityIds, 8)

  return (
    <div>
      <StageHeader eyebrow="04 Prepare" title="Prepare the next customer conversation" description="Your sector, situation, outcomes, themes and capabilities are already available. Choose the conversation stage and use the prompts below before opening the existing meeting brief." />
      <fieldset>
        <legend className="text-sm font-bold text-slate-900">Conversation stage <QuestionHelp guidance={getQuestionGuidance('conversation_stage')} label="Conversation stage guidance" /></legend>
        <div className="mt-3 grid gap-2 lg:grid-cols-3">
          {conversationStages.map((stage) => (
            <ChoiceButton key={stage.id} label={stage.label} description={stage.description} selected={state.conversationStageId === stage.id} onClick={() => {
              setConversationStage(stage.id)
              trackEvent(ANALYTICS_EVENTS.MEETING_STAGE_SELECTED, { stage: stage.analyticsValue })
            }} />
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <JourneyContextSummary compact />
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4" aria-labelledby="prepare-questions-title">
          <div className="flex items-center gap-2"><MessageSquareText className="text-[#e60000]" size={18} aria-hidden="true" /><h4 id="prepare-questions-title" className="text-sm font-bold text-slate-900">Questions to consider next</h4></div>
          <ol className="mt-3 space-y-2">
            {questions.slice(0, 5).map((item, index) => <li key={item.id} className="flex gap-2 text-xs leading-5 text-slate-700"><span className="font-bold text-slate-400">{index + 1}.</span>{item.question}</li>)}
          </ol>
        </section>
      </div>

      <div className={`mt-4 rounded-xl border p-4 ${presalesRecommendation.recommended ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
        <div className="flex items-start gap-3">
          <Users className={presalesRecommendation.recommended ? 'text-[#e60000]' : 'text-blue-700'} size={19} aria-hidden="true" />
          <div><h4 className="text-sm font-bold text-slate-900">{presalesRecommendation.headline}</h4><p className="mt-1 text-xs leading-5 text-slate-600">{presalesRecommendation.reasons[0]}</p></div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <button type="button" onClick={onBack} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><ArrowLeft size={16} aria-hidden="true" /> Back</button>
        <div className="flex flex-wrap justify-end gap-3">
        <a href="#/prepare-meeting" onClick={() => trackEvent(ANALYTICS_EVENTS.SALES_DISCOVERY_PROGRESSED, { stage: 'prepare' })} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#e60000] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#bd0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">
          Open Prepare for My Meeting <ArrowDown size={16} aria-hidden="true" />
        </a>
        <ContinueButton onClick={onContinue}>Continue to Qualify <ArrowRight size={16} aria-hidden="true" /></ContinueButton>
        </div>
      </div>
    </div>
  )
}

export default PrepareStage
