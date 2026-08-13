import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  getTorneo,
  getTablaPosiciones,
  getVallaVencida,
  getGoleadores,
  getTarjetas,
  getSuspensiones,
  getEquiposDeTorneo,
  getPartidos,
} from '../lib/api'
import { estadoCfg } from '../lib/estados'
import TablaPosiciones from '../components/TablaPosiciones'
import TablaGoleadores from '../components/TablaGoleadores'
import TablaVallaVencida from '../components/TablaVallaVencida'
import TablaTarjetas from '../components/TablaTarjetas'
import TablaSuspendidos from '../components/TablaSuspendidos'
import FixturePorJornada from '../components/FixturePorJornada'
import Tabs from '../components/Tabs'

const TABS = [
  { key: 'posiciones', label: 'Posiciones' },
  { key: 'fixture', label: 'Fixture' },
  { key: 'estadisticas', label: 'Estadísticas' },
  { key: 'suspendidos', label: 'Suspendidos' },
]

export default function TorneoDetalle() {
  const { id } = useParams()
  const [tab, setTab] = useState('posiciones')

  const { data: torneo, isLoading, isError } = useQuery({
    queryKey: ['torneo', id],
    queryFn: () => getTorneo(id),
  })
  const { data: equipos } = useQuery({
    queryKey: ['equipos-torneo', id],
    queryFn: () => getEquiposDeTorneo(id),
    enabled: !!torneo,
  })

  if (isLoading) return <p className="text-sm text-gray-500">Cargando torneo…</p>
  if (isError || !torneo) return <p className="text-sm text-red-500">No se encontró el torneo.</p>

  const cfg = estadoCfg(torneo.estado)
  const equipoDe = (equipoId) => equipos?.find((e) => e.equipo?.id === equipoId)?.equipo

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <Link to="/torneos" className="text-sm text-gray-500 hover:underline">
          ← Volver a torneos
        </Link>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{torneo.nombre}</h1>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
        </div>
        {torneo.descripcion && <p className="text-gray-500 mt-1">{torneo.descripcion}</p>}
        {torneo.precio_texto && (
          <p className="mt-3 inline-block text-sm font-medium bg-gray-100 rounded-full px-3 py-1">
            {torneo.precio_texto}
          </p>
        )}
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div>
        {tab === 'posiciones' && <PosicionesPanel torneoId={id} />}
        {tab === 'fixture' && <FixturePanel torneoId={id} equipoDe={equipoDe} />}
        {tab === 'estadisticas' && <EstadisticasPanel torneoId={id} />}
        {tab === 'suspendidos' && <SuspendidosPanel torneoId={id} />}
      </div>
    </div>
  )
}

function PosicionesPanel({ torneoId }) {
  const { data } = useQuery({ queryKey: ['tabla-posiciones', torneoId], queryFn: () => getTablaPosiciones(torneoId) })
  return <TablaPosiciones filas={data} />
}

function FixturePanel({ torneoId, equipoDe }) {
  const { data } = useQuery({ queryKey: ['partidos', torneoId], queryFn: () => getPartidos(torneoId) })
  return <FixturePorJornada partidos={data} equipoDe={equipoDe} />
}

function EstadisticasPanel({ torneoId }) {
  const [sub, setSub] = useState('goleadores')
  const { data: goleadores } = useQuery({
    queryKey: ['goleadores', torneoId],
    queryFn: () => getGoleadores(torneoId),
    enabled: sub === 'goleadores',
  })
  const { data: vallaVencida } = useQuery({
    queryKey: ['valla-vencida', torneoId],
    queryFn: () => getVallaVencida(torneoId),
    enabled: sub === 'valla-vencida',
  })

  return (
    <div className="space-y-4">
      <Tabs
        size="sm"
        tabs={[
          { key: 'goleadores', label: 'Goleadores' },
          { key: 'valla-vencida', label: 'Valla vencida' },
        ]}
        active={sub}
        onChange={setSub}
      />
      {sub === 'goleadores' && <TablaGoleadores filas={goleadores} />}
      {sub === 'valla-vencida' && <TablaVallaVencida filas={vallaVencida} />}
    </div>
  )
}

function SuspendidosPanel({ torneoId }) {
  const { data: tarjetas } = useQuery({ queryKey: ['tarjetas', torneoId], queryFn: () => getTarjetas(torneoId) })
  const { data: suspensiones } = useQuery({
    queryKey: ['suspensiones', torneoId],
    queryFn: () => getSuspensiones(torneoId),
  })

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">Suspendidos</h2>
        <TablaSuspendidos filas={suspensiones} />
      </section>
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">Tarjetas</h2>
        <TablaTarjetas filas={tarjetas} />
      </section>
    </div>
  )
}
