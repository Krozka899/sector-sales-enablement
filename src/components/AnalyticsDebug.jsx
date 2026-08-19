import { useEffect, useState } from 'react'
import { BarChart3, Trash2, X } from 'lucide-react'
import {
  clearAnalyticsDebugEvents,
  getAnalyticsDebugEvents,
  subscribeToAnalyticsDebug,
} from '../utils/analytics'

function AnalyticsDebug() {
  const [panelOpen, setPanelOpen] = useState(false)
  const [events, setEvents] = useState(() => getAnalyticsDebugEvents())

  useEffect(() => subscribeToAnalyticsDebug(setEvents), [])

  if (!import.meta.env.DEV) return null

  return (
    <aside className="fixed right-3 bottom-3 z-[90] sm:right-4 sm:bottom-4">
      {panelOpen && (
        <div
          role="dialog"
          aria-label="Analytics debug events"
          className="mb-2 flex max-h-[65vh] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-bold">Analytics Debug</p>
              <p className="mt-0.5 text-xs text-white/50">Local session only · {events.length} events</p>
            </div>
            <button
              type="button"
              aria-label="Close analytics debug panel"
              onClick={() => setPanelOpen(false)}
              className="grid size-10 place-items-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="min-h-28 flex-1 overflow-y-auto p-3">
            {events.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/15 px-3 py-6 text-center text-sm text-white/50">
                No events in this session.
              </p>
            ) : (
              <ol className="space-y-2">
                {events.map((event, index) => (
                  <li key={`${event.timestamp}-${event.name}-${index}`} className="rounded-xl bg-white/[0.06] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <code className="text-xs font-bold text-red-300">{event.name}</code>
                      <time className="shrink-0 text-[10px] text-white/40" dateTime={event.timestamp}>
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </time>
                    </div>
                    {Object.keys(event.properties).length > 0 && (
                      <dl className="mt-2 space-y-1">
                        {Object.entries(event.properties).map(([property, value]) => (
                          <div key={property} className="grid grid-cols-[auto_1fr] gap-2 text-[11px] leading-4">
                            <dt className="text-white/40">{property}</dt>
                            <dd className="break-words text-right text-white/75">{String(value)}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={clearAnalyticsDebugEvents}
              disabled={events.length === 0}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={15} aria-hidden="true" />
              Clear events
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-expanded={panelOpen}
        onClick={() => setPanelOpen((open) => !open)}
        className="ml-auto inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-bold text-white shadow-lg ring-1 ring-white/10 transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"
      >
        <BarChart3 size={16} className="text-red-300" aria-hidden="true" />
        Analytics Debug
        {events.length > 0 && <span className="rounded-full bg-[#e60000] px-1.5 py-0.5 text-[10px] leading-none">{events.length}</span>}
      </button>
    </aside>
  )
}

export default AnalyticsDebug
