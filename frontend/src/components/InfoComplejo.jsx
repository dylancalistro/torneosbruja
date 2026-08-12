import { useQuery } from '@tanstack/react-query'
import { getConfiguracion } from '../lib/api'
import { PhoneIcon, ChatIcon } from './icons'

export default function InfoComplejo() {
  const { data: config } = useQuery({ queryKey: ['configuracion'], queryFn: getConfiguracion })
  if (!config) return null

  const servicios = (config.servicios ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const mapsUrl = config.direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.direccion)}`
    : null

  const sinNadaQueMostrar =
    !config.descripcion_general && servicios.length === 0 && !config.direccion && !config.whatsapp && !config.telefono
  if (sinNadaQueMostrar) return null

  return (
    <section className="rounded-xl bg-brand-700 text-white overflow-hidden">
      <div className="p-6 sm:p-8 grid gap-6 sm:grid-cols-2 sm:items-center">
        <div>
          {config.descripcion_general && (
            <p className="text-white/90 mb-4">{config.descripcion_general}</p>
          )}
          {servicios.length > 0 && (
            <ul className="space-y-1.5 text-sm">
              {servicios.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          {config.direccion && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white/80 hover:text-white hover:underline"
            >
              📍 {config.direccion}
            </a>
          )}
          <div className="flex gap-2">
            {config.whatsapp && (
              <a
                href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded-full px-4 py-2"
              >
                <ChatIcon className="w-4 h-4" /> WhatsApp
              </a>
            )}
            {config.telefono && (
              <a
                href={`tel:${config.telefono}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full px-4 py-2"
              >
                <PhoneIcon className="w-4 h-4" /> Llamar
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
