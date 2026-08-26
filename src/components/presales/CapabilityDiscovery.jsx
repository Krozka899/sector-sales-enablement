import { useRef, useState } from 'react'
import { Plus, RotateCcw } from 'lucide-react'
import { useJourney } from '../../context/useJourney'
import { capabilityDiscoveryModules } from '../../data/capabilityDiscovery'
import { findTaxonomyItem, vodafoneCapabilities } from '../../data/journeyTaxonomies'
import { getAllPresalesCapabilityIds } from '../../utils/presalesDiscovery'
import { trackEvent } from '../../utils/analytics'
import { ANALYTICS_EVENTS } from '../../utils/analyticsEvents'
import { DiscoveryField, StatusChip } from './DiscoveryControls'

function CapabilityDiscovery({ selectedCapabilityId, onSelectCapability }) {
  const { state, addPresalesCapability, clearCapabilityDiscovery, setTechnicalValue, toggleTechnicalValue } = useJourney()
  const capabilityIds = getAllPresalesCapabilityIds(state)
  const [openCapabilityId, setOpenCapabilityId] = useState(capabilityIds[0] ?? null)
  const activeCapabilityId = capabilityIds.includes(selectedCapabilityId) ? selectedCapabilityId : (openCapabilityId ?? capabilityIds[0])
  const startedRef = useRef(new Set())
  const completedRef = useRef(new Set())
  const availableToAdd = vodafoneCapabilities.filter((capability) => !capabilityIds.includes(capability.id))

  const openModule = (capabilityId) => {
    setOpenCapabilityId(capabilityId)
    onSelectCapability?.(capabilityId)
    if (!startedRef.current.has(capabilityId)) {
      startedRef.current.add(capabilityId)
      trackEvent(ANALYTICS_EVENTS.CAPABILITY_DISCOVERY_STARTED, { capability: capabilityId })
    }
  }

  const setValue = (capabilityId, fieldId, value) => {
    if (!startedRef.current.has(capabilityId)) {
      startedRef.current.add(capabilityId)
      trackEvent(ANALYTICS_EVENTS.CAPABILITY_DISCOVERY_STARTED, { capability: capabilityId })
    }
    setTechnicalValue('capabilities', capabilityId, fieldId, value)
    if (fieldId === 'discovery_status' && ['understood', 'not_applicable'].includes(value) && !completedRef.current.has(capabilityId)) {
      completedRef.current.add(capabilityId)
      trackEvent(ANALYTICS_EVENTS.CAPABILITY_DISCOVERY_COMPLETED, { capability: capabilityId })
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h3 className="text-base font-bold text-slate-900">Capability-specific discovery</h3><p className="mt-1 text-sm leading-6 text-slate-600">Only capability areas identified during Sales or added by Presales are shown.</p></div>
        {availableToAdd.length > 0 && (
          <details className="relative">
            <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-[#d90000] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><Plus size={14} aria-hidden="true" /> Add capability</summary>
            <div className="mt-2 grid w-full gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg sm:grid-cols-2 lg:min-w-[32rem]">{availableToAdd.map((capability) => <button key={capability.id} type="button" onClick={() => { addPresalesCapability(capability.id); openModule(capability.id) }} className="min-h-10 rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:border-red-200 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]">{capability.label}</button>)}</div>
          </details>
        )}
      </div>

      {!capabilityIds.length ? <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">Select or add a capability to begin targeted technical discovery.</p> : (
        <div className="mt-4 space-y-2">
          {capabilityIds.filter((capabilityId) => capabilityId === activeCapabilityId).map((capabilityId) => {
            const module = capabilityDiscoveryModules[capabilityId]
            if (!module) return null
            const answers = state.technicalDiscovery.capabilities[capabilityId] ?? {}
            const status = Object.hasOwn(answers, 'discovery_status') ? answers.discovery_status : 'not_started'
            const addedByPresales = state.technicalDiscovery.presalesAddedCapabilityIds.includes(capabilityId)
            return (
              <section key={capabilityId} className="rounded-xl border border-slate-200 bg-white">
                <div className="flex min-h-14 items-center gap-3 px-4 py-3"><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-900">{module.label}</span><span className="mt-0.5 block text-[10px] font-bold tracking-wide text-slate-400 uppercase">Identified during {addedByPresales ? 'Presales' : 'Sales'}</span></span><StatusChip status={status} /></div>
                  <div id={`capability-${capabilityId}`} className="border-t border-slate-200 bg-slate-50 p-3">
                    {module.journey && <div className="mb-3 flex flex-wrap items-center gap-2">{module.journey.map((step) => <span key={step} className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">{step}</span>)}</div>}
                    <div className="grid gap-3 lg:grid-cols-2">{module.fields.map((field) => <DiscoveryField key={field.id} field={field} guidanceId={`capability.${capabilityId}.${field.id}`} value={answers[field.id]} onSet={(fieldId, value) => setValue(capabilityId, fieldId, value)} onToggle={(fieldId, value) => toggleTechnicalValue('capabilities', capabilityId, fieldId, value)} />)}</div>
                    <div className="mt-3 flex justify-end"><button type="button" onClick={() => clearCapabilityDiscovery(capabilityId)} className="inline-flex min-h-9 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e60000]"><RotateCcw size={13} aria-hidden="true" /> Clear this module</button></div>
                  </div>
              </section>
            )
          })}
        </div>
      )}
      <p className="sr-only" aria-live="polite">{activeCapabilityId ? `${findTaxonomyItem(vodafoneCapabilities, activeCapabilityId)?.label} discovery open` : ''}</p>
    </div>
  )
}

export default CapabilityDiscovery
