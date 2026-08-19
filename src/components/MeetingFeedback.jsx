import { useState } from 'react'
import { CheckCircle2, Send, ThumbsDown, ThumbsUp } from 'lucide-react'
import { trackEvent } from '../utils/analytics'
import { ANALYTICS_EVENTS } from '../utils/analyticsEvents'

const positiveReasons = [
  { value: 'discovery', label: 'Discovery' },
  { value: 'customer_challenge', label: 'Customer challenge' },
  { value: 'business_outcomes', label: 'Business outcomes' },
  { value: 'vodafone_positioning', label: 'Vodafone positioning' },
  { value: 'meeting_confidence', label: 'Meeting confidence' },
]

const negativeReasons = [
  { value: 'more_relevant_questions', label: 'More relevant questions' },
  { value: 'better_vodafone_positioning', label: 'Better Vodafone positioning' },
  { value: 'more_sector_detail', label: 'More sector detail' },
  { value: 'shorter_brief', label: 'Shorter meeting brief' },
  { value: 'more_practical_guidance', label: 'More practical guidance' },
]

function MeetingFeedback({ brief }) {
  const [rating, setRating] = useState(null)
  const [reason, setReason] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const selectRating = (nextRating) => {
    setRating(nextRating)
    setReason(null)
  }

  const submitFeedback = () => {
    if (!rating || !reason || submitted) return

    trackEvent(ANALYTICS_EVENTS.MEETING_BRIEF_FEEDBACK, {
      rating,
      reason,
      sector: brief.sector.name,
      priority: brief.priority.analyticsValue,
      stage: brief.stage.analyticsValue,
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4" aria-live="polite">
        <div className="flex items-center gap-3 text-emerald-800">
          <CheckCircle2 size={20} aria-hidden="true" />
          <p className="text-sm font-bold">Thanks — feedback recorded.</p>
        </div>
      </section>
    )
  }

  const reasons = rating === 'useful' ? positiveReasons : negativeReasons

  return (
    <section className="mt-4 border-t border-slate-200 pt-4" aria-labelledby="meeting-feedback-heading">
      <div className="flex flex-col gap-4 laptop:flex-row laptop:items-start laptop:justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">Optional feedback</p>
          <h4 id="meeting-feedback-heading" className="mt-1 text-sm font-bold text-[#1b1b1b]">
            Was this useful for your customer conversation?
          </h4>
        </div>
        <div className="flex gap-2" role="group" aria-label="Rate this meeting brief">
          <button
            type="button"
            aria-pressed={rating === 'useful'}
            onClick={() => selectRating('useful')}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${
              rating === 'useful' ? 'border-[#e60000] bg-red-50 text-[#d90000]' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <ThumbsUp size={17} aria-hidden="true" />
            Yes
          </button>
          <button
            type="button"
            aria-pressed={rating === 'not_useful'}
            onClick={() => selectRating('not_useful')}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${
              rating === 'not_useful' ? 'border-[#e60000] bg-red-50 text-[#d90000]' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <ThumbsDown size={17} aria-hidden="true" />
            Not really
          </button>
        </div>
      </div>

      {rating && (
        <div className="mt-4 rounded-xl bg-[#fafafa] p-4 ring-1 ring-slate-200">
          <p className="text-sm font-bold text-slate-800">
            {rating === 'useful' ? 'What did it help with?' : 'What could be better?'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Select one feedback reason">
            {reasons.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={reason === option.value}
                onClick={() => setReason(option.value)}
                className={`min-h-10 rounded-lg border px-3 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] ${
                  reason === option.value
                    ? 'border-[#e60000] bg-red-50 text-[#d90000]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!reason}
            onClick={submitFeedback}
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#e60000] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#bd0000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Send size={16} aria-hidden="true" />
            Submit feedback
          </button>
        </div>
      )}
    </section>
  )
}

export default MeetingFeedback
