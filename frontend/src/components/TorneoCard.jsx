import { Link } from 'react-router-dom'
import { estadoCfg } from '../lib/estados'

export default function TorneoCard({ torneo }) {
  const cfg = estadoCfg(torneo.estado)

  return (
    <Link
      to={`/torneos/${torneo.id}`}
      className="group relative block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700"
    >
      <span className={`absolute left-0 top-0 h-full w-1 ${cfg.accent}`} aria-hidden="true" />

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug">{torneo.nombre}</h3>
        <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
      </div>

      {torneo.descripcion && (
        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{torneo.descripcion}</p>
      )}

      {torneo.precio_texto && (
        <p className="text-sm mt-3 inline-flex items-center gap-1 font-medium text-gray-700 dark:text-gray-200">
          {torneo.precio_texto}
        </p>
      )}
    </Link>
  )
}
