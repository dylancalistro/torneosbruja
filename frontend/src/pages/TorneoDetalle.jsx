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

const ESTADO_LABEL = {
  proximamente: 'Próximamente',
  activo: 'En curso',
  finalizado: 'Finalizado',
}

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

  return (
    <div className="space-y-8">
      <div>
        <Link to="/" className="text-sm text-gray-500 hover:underline">
          ← Volver a torneos
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <h1 className="text-2xl font-semibold">{torneo.nombre}</h1>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
            {ESTADO_LABEL[torneo.estado] ?? torneo.estado}
          </span>
        </div>
        {torneo.descripcion && <p className="text-gray-500 mt-1">{torneo.descripcion}</p>}
        {torneo.precio_texto && <p className="mt-2 font-medium">{torneo.precio_texto}</p>}
      </div>

      <section>
        <h2 className="font-medium mb-2">Tabla de posiciones</h2>
        <TablaPosiciones filas={posiciones} />
      </section>

      <section>
        <h2 className="font-medium mb-2">Goleadores</h2>
        <TablaGoleadores filas={goleadores} />
      </section>

      <section>
        <h2 className="font-medium mb-2">Partidos</h2>
        {(!partidos || partidos.length === 0) && (
          <p className="text-sm text-gray-500">Todavía no hay partidos cargados.</p>
        )}
        <ul className="divide-y divide-gray-100 dark:divide-gray-900">
          {partidos?.map((p) => (
            <li key={p.id} className="py-2 flex items-center justify-between text-sm">
              <span>
                {nombreEquipo(p.equipo_local_id)} vs {nombreEquipo(p.equipo_visitante_id)}
              </span>
              <span className="font-medium">
                {p.jugado ? `${p.goles_local} - ${p.goles_visitante}` : 'A jugar'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
