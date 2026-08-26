import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  Layers3,
  MousePointerClick,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { journeySectors, businessOutcomes, transformationThemes, vodafoneCapabilities } from '../data/journeyTaxonomies'
import { meetingPriorities } from '../data/meetingOptions'
import { journeyInsightStages, meetingValueSignals, presalesSignals, reportingLevels, successAreas } from '../data/measurementModel'
import SectionHeading from './SectionHeading'
import SuccessFunnel from './SuccessFunnel'

const successIcons = { adoption: Eye, engagement: MousePointerClick, value: Sparkles }

function ProviderEmptyState({ children }) {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <BarChart3 className="mt-0.5 shrink-0 text-slate-400" size={18} aria-hidden="true" />
        <div><p className="text-xs font-bold text-slate-700">Aggregate analytics not connected</p><p className="mt-1 text-xs leading-5 text-slate-500">{children}</p></div>
      </div>
    </div>
  )
}

function TaxonomyList({ items }) {
  return <ul className="mt-4 flex flex-wrap gap-2">{items.map((item) => <li key={item.id} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">{item.label}</li>)}</ul>
}

function AggregateDataList({ items = [], taxonomy }) {
  if (!items.length) return null
  return (
    <dl className="mt-4 space-y-2">
      {items.map(({ id, count }) => {
        const label = taxonomy.find((item) => item.id === id)?.label
        if (!label || !Number.isFinite(count)) return null
        return <div key={id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs"><dt className="font-semibold text-slate-700">{label}</dt><dd className="font-black text-slate-900">{count}</dd></div>
      })}
    </dl>
  )
}

function MeasureSuccess({ aggregateSnapshot = null }) {
  const priorityTaxonomy = [
    ...businessOutcomes,
    ...transformationThemes,
    ...meetingPriorities.map((priority) => ({ id: priority.id, label: priority.label })),
  ]

  return (
    <section id="measure-success" className="scroll-mt-20 bg-[#f5f6f7] py-16 sm:py-20 laptop:py-12 2xl:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Aggregate measurement"
          title="Measure Success"
          description="Understand how the Opportunity Navigator is helping Sales explore, prepare and engage Presales — without measuring individual employees or customers."
        />
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3" role="note">
          <ShieldCheck className="mt-0.5 shrink-0 text-blue-700" size={18} aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700"><strong className="text-slate-900">Aggregate engagement only.</strong> No employee or customer identity is required.</p>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {successAreas.map((area) => {
            const Icon = successIcons[area.id]
            return (
              <article key={area.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-red-50 text-[#e60000]"><Icon size={19} aria-hidden="true" /></span><h3 className="text-lg font-bold text-slate-900">{area.title}</h3></div>
                <p className="mt-4 text-sm font-bold text-slate-800">{area.question}</p>
                <ul className="mt-3 space-y-2">{area.measures.map((measure) => <li key={measure} className="flex items-start gap-2 text-sm leading-5 text-slate-600"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#e60000]" aria-hidden="true" />{measure}</li>)}</ul>
              </article>
            )
          })}
        </div>


        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-6" aria-labelledby="funnel-title">
          <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700"><Activity size={19} aria-hidden="true" /></span><div><h3 id="funnel-title" className="text-xl font-bold text-slate-900">Opportunity engagement funnel</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">These existing privacy-safe events form an aggregate path from reach to perceived value. Counts and trends appear only when an approved provider is connected.</p></div></div>
          <SuccessFunnel counts={aggregateSnapshot?.funnelCounts} />
        </section>

        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="journey-insights-title">
          <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-50 text-[#e60000]"><BriefcaseBusiness size={19} aria-hidden="true" /></span><div><h3 id="journey-insights-title" className="text-xl font-bold text-slate-900">Where are opportunities progressing?</h3><p className="mt-1 text-sm leading-6 text-slate-600">Aggregate stage signals can show where the connected Sales → Presales experience is helping and where users stop progressing.</p></div></div>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {journeyInsightStages.map((stage, index) => <li key={stage.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] font-bold tracking-wide text-[#d90000] uppercase">Stage {index + 1}</p><h4 className="mt-1 text-sm font-bold text-slate-900">{stage.label}</h4><p className="mt-2 text-xs leading-5 text-slate-600">{stage.signal}</p></li>)}
          </ol>
        </section>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="capability-interest-title">
            <h3 id="capability-interest-title" className="text-lg font-bold text-slate-900">What capabilities are conversations leading towards?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Future aggregate reporting can group selected and recommended capability areas using the canonical taxonomy.</p>
            <TaxonomyList items={vodafoneCapabilities} />
            <AggregateDataList items={aggregateSnapshot?.capabilityInterest} taxonomy={vodafoneCapabilities} />
            {!aggregateSnapshot?.capabilityInterest?.length && <ProviderEmptyState>Capability interest will appear here when approved aggregate analytics is connected.</ProviderEmptyState>}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="sector-interest-title">
            <h3 id="sector-interest-title" className="text-lg font-bold text-slate-900">Which sectors are being explored?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">This will use sector exploration events grouped by the canonical sector value.</p>
            <TaxonomyList items={journeySectors} />
            <AggregateDataList items={aggregateSnapshot?.sectorInterest} taxonomy={journeySectors} />
            {!aggregateSnapshot?.sectorInterest?.length && <ProviderEmptyState>Sector engagement will appear here when approved aggregate analytics is connected.</ProviderEmptyState>}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="priority-interest-title">
            <h3 id="priority-interest-title" className="text-lg font-bold text-slate-900">What are customers trying to achieve?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Structured outcomes, themes and meeting priorities can reveal common conversation patterns without customer identity.</p>
            <TaxonomyList items={priorityTaxonomy} />
            <AggregateDataList items={aggregateSnapshot?.priorityInterest} taxonomy={priorityTaxonomy} />
            {!aggregateSnapshot?.priorityInterest?.length && <ProviderEmptyState>Priority trends will appear here when approved aggregate analytics is connected.</ProviderEmptyState>}
          </section>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="presales-signals-title">
            <div className="flex items-center gap-3"><UsersRound className="text-[#e60000]" size={20} aria-hidden="true" /><h3 id="presales-signals-title" className="text-lg font-bold text-slate-900">When is Presales being engaged?</h3></div>
            <p className="mt-3 text-sm leading-6 text-slate-600">These signals can indicate whether technical expertise enters at an appropriate point in the aggregate lifecycle. They never score individual Sales users.</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">{presalesSignals.map((signal) => <li key={signal} className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">{signal}</li>)}</ul>
          </section>
          <section className="rounded-2xl border border-red-200 bg-red-50/60 p-5" aria-labelledby="expansion-title">
            <div className="flex items-center gap-3"><Layers3 className="text-[#e60000]" size={20} aria-hidden="true" /><h3 id="expansion-title" className="text-lg font-bold text-slate-900">Opportunity expansion</h3></div>
            <p className="mt-3 text-sm leading-6 text-slate-700">Aggregate combinations of recommended and selected capabilities can show whether structured discovery is helping Sales identify broader Vodafone conversations.</p>
            <p className="mt-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-800 ring-1 ring-red-100">Business question: Is the tool helping Sales discover broader Vodafone opportunities?</p>
            <p className="mt-3 text-xs leading-5 text-slate-600">Patterns come from the existing recommendation engine and capability events; this measurement view does not hard-code solution combinations.</p>
          </section>
        </div>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="meeting-value-title">
          <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-700" size={21} aria-hidden="true" /><div><h3 id="meeting-value-title" className="text-lg font-bold text-slate-900">Is meeting preparation useful?</h3><p className="mt-1 text-sm leading-6 text-slate-600">Existing machine-readable feedback can measure perceived value without adding free text.</p></div></div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{meetingValueSignals.map((signal) => <li key={signal} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">{signal}</li>)}</ul>
        </section>

        <section className="mt-7 rounded-3xl bg-slate-900 p-5 text-white sm:p-6" aria-labelledby="future-reporting-title">
          <h3 id="future-reporting-title" className="text-xl font-bold">Future aggregate reporting model</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">Once an approved analytics provider is configured, it can supply aggregate counts and trends to this presentation layer without changing event collection or identifying employees and customers.</p>
          <ul className="mt-5 flex flex-wrap gap-2">{reportingLevels.map((level) => <li key={level} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80 ring-1 ring-white/15">{level}</li>)}</ul>
        </section>
      </div>
    </section>
  )
}

export default MeasureSuccess
