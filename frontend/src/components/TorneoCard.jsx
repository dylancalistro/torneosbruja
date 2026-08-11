import { Link } from 'react-router-dom'

const ESTADO_LABEL = {
  proximamente: 'Próximamente',
  activo: 'En curso',
  finalizado: 'Finalizado',
}

export default function TorneoCard({ torneo }) {
  return (
    <Link
      to={`/torneos/${torneo.id}`}
      className="block border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium">{torneo.nombre}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 whitespace-nowrap">
          {ESTADO_LABEL[torneo.estado] ?? torneo.estado}
        </span>
      </div>
      {torneo.descripcion && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{torneo.descripcion}</p>
      )}
      {torneo.precio_texto && (
        <p className="text-sm mt-2 font-medium">{torneo.precio_texto}</p>
      )}
    </Link>
  )
}
