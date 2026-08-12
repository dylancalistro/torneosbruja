function agruparPorJornada(partidos) {
  const grupos = new Map()
  for (const p of partidos) {
    const clave = p.jornada ?? 'sin-jornada'
    if (!grupos.has(clave)) grupos.set(clave, [])
    grupos.get(clave).push(p)
  }
  return [...grupos.entries()].sort((a, b) => {
    if (a[0] === 'sin-jornada') return 1
    if (b[0] === 'sin-jornada') return -1
    return a[0] - b[0]
  })
}

export default function FixturePorJornada({ partidos, nombreEquipo }) {
  if (!partidos || partidos.length === 0) {
    return <p className="text-sm text-gray-500">Todavía no hay partidos cargados.</p>
  }

  const grupos = agruparPorJornada(partidos)

  return (
    <div className="space-y-6">
      {grupos.map(([jornada, items]) => (
        <div key={jornada}>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            {jornada === 'sin-jornada' ? 'Fecha a confirmar' : `Fecha ${jornada}`}
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-900">
            {items.map((p) => (
              <li key={p.id} className="py-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
                <span>
                  {nombreEquipo(p.equipo_local_id)} <span className="text-gray-400">vs</span>{' '}
                  {nombreEquipo(p.equipo_visitante_id)}
                </span>
                {p.jugado ? (
                  <span className="font-semibold tabular-nums">
                    {p.goles_local} - {p.goles_visitante}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                    {p.fecha ? new Date(p.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) : 'A confirmar'}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
