export default function TablaSuspendidos({ filas }) {
  if (!filas || filas.length === 0) {
    return <p className="text-sm text-gray-500">No hay jugadores suspendidos en este torneo.</p>
  }

  return (
    <ul className="divide-y divide-gray-100">
      {filas.map((s) => {
        const cumplidas = s.partidos_totales - s.partidos_restantes
        return (
          <li key={s.id} className="py-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <div>
              <p className="font-medium">{s.jugador?.nombre}</p>
              <p className="text-sm text-gray-500">
                {s.equipo?.nombre}
                {s.motivo ? ` · ${s.motivo}` : ''}
              </p>
            </div>
            <span className="text-xs font-medium bg-gray-100 rounded-full px-3 py-1 whitespace-nowrap">
              Cumplió {cumplidas} de {s.partidos_totales} {s.partidos_totales === 1 ? 'fecha' : 'fechas'}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
