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

function Escudo({ equipo, align }) {
  const inicial = equipo?.nombre?.[0]?.toUpperCase() ?? '?'
  return (
    <div className={`flex items-center gap-2 min-w-0 ${align === 'right' ? 'flex-row-reverse text-right' : 'text-left'}`}>
      {equipo?.escudo_url ? (
        <img src={equipo.escudo_url} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
      ) : (
        <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-semibold flex items-center justify-center shrink-0">
          {inicial}
        </span>
      )}
      <span className="text-sm font-medium truncate">{equipo?.nombre ?? '—'}</span>
    </div>
  )
}

export default function FixturePorJornada({ partidos, equipoDe }) {
  if (!partidos || partidos.length === 0) {
    return <p className="text-sm text-gray-500">Todavía no hay partidos cargados.</p>
  }

  const grupos = agruparPorJornada(partidos)

  return (
    <div className="space-y-6">
      {grupos.map(([jornada, items]) => (
        <div key={jornada}>
          <div className="bg-brand-700 text-white rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-center mb-2">
            {jornada === 'sin-jornada' ? 'Fecha a confirmar' : `Fecha ${jornada}`}
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-900">
            {items.map((p) => {
              const fecha = p.fecha ? new Date(p.fecha) : null
              return (
                <li key={p.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-3">
                  <Escudo equipo={equipoDe(p.equipo_local_id)} />

                  <div className="text-center px-1 min-w-[64px]">
                    {p.jugado ? (
                      <>
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Finalizado
                        </div>
                        <div className="font-bold tabular-nums">
                          {p.goles_local} - {p.goles_visitante}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {fecha ? fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) : 'A confirmar'}
                        </div>
                        {fecha && (
                          <div className="text-xs text-gray-400">
                            {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} Hs
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <Escudo equipo={equipoDe(p.equipo_visitante_id)} align="right" />
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
