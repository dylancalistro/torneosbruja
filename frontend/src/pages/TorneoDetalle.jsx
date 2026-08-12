import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  getTorneo,
  getTablaPosiciones,
  getGoleadores,
  getEquiposDeTorneo,
  getPartidos,
} from '../lib/api'
import TablaPosiciones from '../components/TablaPosiciones'
import TablaGoleadores from '../components/TablaGoleadores'
import { estadoCfg } from '../lib/estados'

export default function TorneoDetalle() {
  const { id } = useParams()

  const { data: torneo, isLoading, isError } = useQuery({
    queryKey: ['torneo', id],
    queryFn: () => getTorneo(id),
  })
  const { data: posiciones } = useQuery({
    queryKey: ['tabla-posiciones', id],
    queryFn: () => getTablaPosiciones(id),
    enabled: !!torneo,
  })
  const { data: goleadores } = useQuery({
    queryKey: ['goleadores', id],
    queryFn: () => getGoleadores(id),
    enabled: !!torneo,
  })
  const { data: equipos } = useQuery({
    queryKey: ['equipos-torneo', id],
    queryFn: () => getEquiposDeTorneo(id),
    enabled: !!torneo,
  })
  const { data: partidos } = useQuery({
    queryKey: ['partidos', id],
    queryFn: () => getPartidos(id),
    enabled: !!torneo,
  })

  if (isLoading) return <p className="text-sm text-gray-500">Cargando torneo…</p>
  if (isError || !torneo) return <p className="text-sm text-red-500">No se encontró el torneo.</p>

  const nombreEquipo = (equipoId) =>
    equipos?.find((e) => e.equipo?.id === equipoId)?.equipo?.nombre ?? '—'

  const cfg = estadoCfg(torneo.estado)

  return (
    <div className="space-y-10">
      <div>
        <Link to="/" className="text-sm text-gray-500 hover:underline">
          ← Volver a torneos
        </Link>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{torneo.nombre}</h1>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
        </div>
        {torneo.descripcion && <p className="text-gray-500 mt-1">{torneo.descripcion}</p>}
        {torneo.precio_texto && (
          <p className="mt-3 inline-block text-sm font-medium bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
            {torneo.precio_texto}
          </p>
        )}
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">
          Tabla de posiciones
        </h2>
        <TablaPosiciones filas={posiciones} />
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">Goleadores</h2>
        <TablaGoleadores filas={goleadores} />
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">Partidos</h2>
        {(!partidos || partidos.length === 0) && (
          <p className="text-sm text-gray-500">Todavía no hay partidos cargados.</p>
        )}
        <ul className="divide-y divide-gray-100 dark:divide-gray-900">
          {partidos?.map((p) => (
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
                  A jugar
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
