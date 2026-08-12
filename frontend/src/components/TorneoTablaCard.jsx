import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTablaPosiciones } from '../lib/api'
import { estadoCfg } from '../lib/estados'
import TablaPosicionesCompacta from './TablaPosicionesCompacta'

export default function TorneoTablaCard({ torneo }) {
  const cfg = estadoCfg(torneo.estado)
  const { data: filas, isLoading } = useQuery({
    queryKey: ['tabla-posiciones', torneo.id],
    queryFn: () => getTablaPosiciones(torneo.id),
  })

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 shadow-sm">
      <span className={`absolute left-0 top-0 h-full w-1 ${cfg.accent}`} aria-hidden="true" />

      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-1">
        <Link to={`/torneos/${torneo.id}`} className="font-semibold hover:underline truncate">
          {torneo.nombre}
        </Link>
        <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500 px-4 py-3">Cargando…</p>
      ) : (
        <TablaPosicionesCompacta filas={filas} />
      )}

      <Link
        to={`/torneos/${torneo.id}`}
        className="block text-center text-xs font-medium text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 border-t border-gray-100 dark:border-gray-900 py-2"
      >
        Ver fixture, goleadores y más →
      </Link>
    </div>
  )
}
