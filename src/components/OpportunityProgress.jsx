function OpportunityProgress({ progressModel, currentStage }) {
  const currentIndex = progressModel.stages.findIndex((stage) => stage.id === currentStage)
  const current = progressModel.stages[currentIndex]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]" aria-labelledby="opportunity-progress-title">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-[10px] font-bold tracking-[0.14em] text-[#d90000] uppercase">{current?.label} · Step {currentIndex + 1} of {progressModel.stages.length}</p><h3 id="opportunity-progress-title" className="mt-1 text-base font-bold text-slate-900">Opportunity progress</h3></div>
        <p className="text-right"><strong className="text-2xl font-black text-slate-900">{progressModel.overallPercentage}%</strong><span className="block text-[10px] font-bold text-slate-500 uppercase">addressed</span></p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Opportunity journey completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressModel.overallPercentage}>
        <div className="h-full rounded-full bg-[#e60000] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progressModel.overallPercentage}%` }} />
      </div>
      <p className="mt-2 text-[10px] leading-4 text-slate-500">Completion means the relevant Navigator questions have been addressed; it is not an approval.</p>
    </section>
  )
}

export default OpportunityProgress
