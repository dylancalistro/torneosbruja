import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getTorneo,
  actualizarTorneo,
  getEquiposDeTorneo,
  getEquipos,
  crearEquipo,
  inscribirEquipo,
  quitarInscripcion,
  getJugadoresDeEquipo,
  getJugadoresDeTorneo,
  crearJugador,
  eliminarJugador,
  getPartidos,
  crearPartido,
  actualizarPartido,
  eliminarPartido,
  getGolesDePartido,
  agregarGol,
  eliminarGol,
  getTarjetasDePartido,
  agregarTarjeta,
  eliminarTarjeta,
  getSuspensiones,
  crearSuspension,
  actualizarSuspension,
  eliminarSuspension,
  subirEscudoEquipo,
} from '../../lib/api'

const ESTADOS = ['proximamente', 'activo', 'finalizado']
const INPUT_CLS =
  'border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'

const CARD_COLORS = {
  brand: { bg: 'bg-brand-50', border: 'border-brand-500', title: 'text-brand-800', dot: 'bg-brand-600' },
  accent: { bg: 'bg-accent-50', border: 'border-accent-500', title: 'text-accent-700', dot: 'bg-accent-600' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-400', title: 'text-blue-800', dot: 'bg-blue-600' },
  red: { bg: 'bg-red-50', border: 'border-red-400', title: 'text-red-800', dot: 'bg-red-600' },
}

function Card({ title, color = 'brand', className = '', children }) {
  const c = CARD_COLORS[color]
  return (
    <section className={`rounded-xl border-l-4 ${c.border} ${c.bg} p-5 sm:p-6 space-y-3 ${className}`}>
      <h2 className={`text-lg font-semibold flex items-center gap-2 ${c.title}`}>
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function TorneoAdmin() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: torneo, isLoading } = useQuery({ queryKey: ['torneo', id], queryFn: () => getTorneo(id) })
  const { data: equiposInscriptos } = useQuery({
    queryKey: ['equipos-torneo', id],
    queryFn: () => getEquiposDeTorneo(id),
  })
  const { data: todosLosEquipos } = useQuery({ queryKey: ['equipos'], queryFn: getEquipos })

  const [form, setForm] = useState(null)
  if (torneo && !form) setForm(torneo)

  const guardarTorneo = useMutation({
    mutationFn: (cambios) => actualizarTorneo(id, cambios),
    onSuccess: (data) => {
      setForm(data)
      queryClient.invalidateQueries({ queryKey: ['torneo', id] })
      queryClient.invalidateQueries({ queryKey: ['tabla-posiciones', id] })
    },
  })

  const [nuevoEquipoNombre, setNuevoEquipoNombre] = useState('')
  const [equipoAAgregar, setEquipoAAgregar] = useState('')

  const crearYInscribir = useMutation({
    mutationFn: async () => {
      const equipo = await crearEquipo({ nombre: nuevoEquipoNombre })
      return inscribirEquipo(id, equipo.id)
    },
    onSuccess: () => {
      setNuevoEquipoNombre('')
      queryClient.invalidateQueries({ queryKey: ['equipos-torneo', id] })
      queryClient.invalidateQueries({ queryKey: ['equipos'] })
    },
  })

  const inscribirExistente = useMutation({
    mutationFn: () => inscribirEquipo(id, equipoAAgregar),
    onSuccess: () => {
      setEquipoAAgregar('')
      queryClient.invalidateQueries({ queryKey: ['equipos-torneo', id] })
    },
  })

  const desinscribir = useMutation({
    mutationFn: (inscripcionId) => quitarInscripcion(inscripcionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['equipos-torneo', id] }),
  })

  if (isLoading || !form) return <p className="text-sm text-gray-500">Cargando…</p>

  const idsInscriptos = equiposInscriptos?.map((i) => i.equipo?.id) ?? []
  const equiposDisponibles = todosLosEquipos?.filter((e) => !idsInscriptos.includes(e.id)) ?? []

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <Link to="/admin" className="text-sm text-gray-500 hover:underline">
        ← Volver
      </Link>

      <Card title="Editar torneo" color="brand" className="max-w-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            guardarTorneo.mutate({
              nombre: form.nombre,
              descripcion: form.descripcion || null,
              precio_texto: form.precio_texto || null,
              estado: form.estado,
              fecha_inicio: form.fecha_inicio || null,
              fecha_fin: form.fecha_fin || null,
              puntos_victoria: Number(form.puntos_victoria),
              puntos_empate: Number(form.puntos_empate),
              puntos_derrota: Number(form.puntos_derrota),
            })
          }}
          className="space-y-3"
        >
          <Campo label="Nombre">
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className={INPUT_CLS}
            />
          </Campo>
          <Campo label="Descripción">
            <textarea
              value={form.descripcion ?? ''}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className={INPUT_CLS}
            />
          </Campo>
          <Campo label="Precio (texto libre, ej: $5000 por equipo)">
            <input
              value={form.precio_texto ?? ''}
              onChange={(e) => setForm({ ...form, precio_texto: e.target.value })}
              className={INPUT_CLS}
            />
          </Campo>
          <Campo label="Estado">
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className={INPUT_CLS}
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </Campo>

          <div className="grid grid-cols-3 gap-3">
            <Campo label="Pts. victoria">
              <input
                type="number"
                min="0"
                value={form.puntos_victoria}
                onChange={(e) => setForm({ ...form, puntos_victoria: e.target.value })}
                className={INPUT_CLS}
              />
            </Campo>
            <Campo label="Pts. empate">
              <input
                type="number"
                min="0"
                value={form.puntos_empate}
                onChange={(e) => setForm({ ...form, puntos_empate: e.target.value })}
                className={INPUT_CLS}
              />
            </Campo>
            <Campo label="Pts. derrota">
              <input
                type="number"
                min="0"
                value={form.puntos_derrota}
                onChange={(e) => setForm({ ...form, puntos_derrota: e.target.value })}
                className={INPUT_CLS}
              />
            </Campo>
          </div>

          <button
            type="submit"
            disabled={guardarTorneo.isPending}
            className="bg-brand-700 hover:bg-brand-800 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            Guardar
          </button>
        </form>
      </Card>

      <Card title="Equipos inscriptos" color="accent">
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Agregar equipo existente</label>
            <select
              value={equipoAAgregar}
              onChange={(e) => setEquipoAAgregar(e.target.value)}
              className={INPUT_CLS}
            >
              <option value="">Seleccionar…</option>
              {equiposDisponibles.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.nombre}
                </option>
              ))}
            </select>
          </div>
          <button
            disabled={!equipoAAgregar || inscribirExistente.isPending}
            onClick={() => inscribirExistente.mutate()}
            className="bg-accent-500 hover:bg-accent-600 text-white rounded px-3 py-2 disabled:opacity-50"
          >
            Inscribir
          </button>

          <span className="text-gray-400">o</span>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Crear equipo nuevo</label>
            <input
              value={nuevoEquipoNombre}
              onChange={(e) => setNuevoEquipoNombre(e.target.value)}
              placeholder="Nombre del equipo"
              className={INPUT_CLS}
            />
          </div>
          <button
            disabled={!nuevoEquipoNombre.trim() || crearYInscribir.isPending}
            onClick={() => crearYInscribir.mutate()}
            className="bg-accent-500 hover:bg-accent-600 text-white rounded px-3 py-2 disabled:opacity-50"
          >
            Crear e inscribir
          </button>
        </div>

        <div className="space-y-2">
          {equiposInscriptos?.map((insc) => (
            <EquipoRow
              key={insc.id}
              inscripcion={insc}
              onQuitar={() => desinscribir.mutate(insc.id)}
            />
          ))}
        </div>
      </Card>

      <Card title="Partidos" color="blue">
        <PartidosSection torneoId={id} equiposInscriptos={equiposInscriptos ?? []} />
      </Card>

      <Card title="Suspendidos" color="red">
        <SuspensionesSection torneoId={id} />
      </Card>
    </div>
  )
}

function Campo({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

function EquipoRow({ inscripcion, onQuitar }) {
  const [abierto, setAbierto] = useState(false)
  const equipo = inscripcion.equipo
  const queryClient = useQueryClient()

  const { data: jugadores } = useQuery({
    queryKey: ['jugadores', equipo?.id],
    queryFn: () => getJugadoresDeEquipo(equipo.id),
    enabled: abierto,
  })

  const [nombreJugador, setNombreJugador] = useState('')
  const agregar = useMutation({
    mutationFn: () => crearJugador({ equipo_id: equipo.id, nombre: nombreJugador }),
    onSuccess: () => {
      setNombreJugador('')
      queryClient.invalidateQueries({ queryKey: ['jugadores', equipo.id] })
    },
  })
  const quitar = useMutation({
    mutationFn: (jugadorId) => eliminarJugador(jugadorId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jugadores', equipo.id] }),
  })

  const subirEscudo = useMutation({
    mutationFn: (file) => subirEscudoEquipo({ file, equipoId: equipo.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-torneo'] })
      queryClient.invalidateQueries({ queryKey: ['equipos'] })
    },
  })

  return (
    <div className="border border-accent-100 bg-white rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setAbierto(!abierto)} className="flex items-center gap-2 font-medium hover:underline">
          {equipo?.escudo_url ? (
            <img src={equipo.escudo_url} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
          ) : (
            <span className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
          )}
          {equipo?.nombre}
          <span className="text-xs text-accent-600 font-normal">{abierto ? '▲' : '▼'}</span>
        </button>
        <button onClick={onQuitar} className="text-xs text-red-500 hover:underline shrink-0">
          Quitar del torneo
        </button>
      </div>

      {abierto && (
        <div className="mt-3 space-y-2 border-t border-accent-100 pt-3">
          <div className="flex items-center gap-3">
            {equipo?.escudo_url ? (
              <img src={equipo.escudo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <span className="w-12 h-12 rounded-full bg-gray-200" />
            )}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Foto / escudo del equipo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) subirEscudo.mutate(file)
                }}
                disabled={subirEscudo.isPending}
                className="text-sm"
              />
              {subirEscudo.isPending && <p className="text-xs text-gray-500 mt-1">Subiendo…</p>}
              {subirEscudo.isError && <p className="text-xs text-red-500 mt-1">No se pudo subir la foto.</p>}
            </div>
          </div>

          <p className="text-xs text-gray-500">Jugadores</p>
          <ul className="text-sm space-y-1">
            {jugadores?.map((j) => (
              <li key={j.id} className="flex items-center justify-between">
                <span>{j.nombre}</span>
                <button
                  onClick={() => quitar.mutate(j.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
            {jugadores?.length === 0 && <li className="text-gray-400">Sin jugadores cargados.</li>}
          </ul>
          <div className="flex gap-2">
            <input
              value={nombreJugador}
              onChange={(e) => setNombreJugador(e.target.value)}
              placeholder="Nombre del jugador"
              className={`${INPUT_CLS} flex-1`}
            />
            <button
              disabled={!nombreJugador.trim() || agregar.isPending}
              onClick={() => agregar.mutate()}
              className="border border-accent-300 text-accent-700 rounded px-3 hover:bg-accent-50 disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PartidosSection({ torneoId, equiposInscriptos }) {
  const queryClient = useQueryClient()
  const { data: partidos } = useQuery({ queryKey: ['partidos', torneoId], queryFn: () => getPartidos(torneoId) })

  const [local, setLocal] = useState('')
  const [visitante, setVisitante] = useState('')
  const [jornada, setJornada] = useState('')

  const crear = useMutation({
    mutationFn: () =>
      crearPartido({
        torneo_id: torneoId,
        equipo_local_id: local,
        equipo_visitante_id: visitante,
        jornada: jornada ? Number(jornada) : null,
      }),
    onSuccess: () => {
      setLocal('')
      setVisitante('')
      setJornada('')
      queryClient.invalidateQueries({ queryKey: ['partidos', torneoId] })
    },
  })

  const nombreDe = (equipoId) =>
    equiposInscriptos.find((i) => i.equipo?.id === equipoId)?.equipo?.nombre ?? '—'

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Local</label>
          <select value={local} onChange={(e) => setLocal(e.target.value)} className={INPUT_CLS}>
            <option value="">Seleccionar…</option>
            {equiposInscriptos.map((i) => (
              <option key={i.equipo?.id} value={i.equipo?.id}>
                {i.equipo?.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Visitante</label>
          <select value={visitante} onChange={(e) => setVisitante(e.target.value)} className={INPUT_CLS}>
            <option value="">Seleccionar…</option>
            {equiposInscriptos.map((i) => (
              <option key={i.equipo?.id} value={i.equipo?.id}>
                {i.equipo?.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Fecha (jornada, opcional)</label>
          <input
            type="number"
            min="1"
            value={jornada}
            onChange={(e) => setJornada(e.target.value)}
            placeholder="Ej: 12"
            className={`${INPUT_CLS} w-24`}
          />
        </div>
        <button
          disabled={!local || !visitante || local === visitante || crear.isPending}
          onClick={() => crear.mutate()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 disabled:opacity-50"
        >
          Crear partido
        </button>
      </div>
      {crear.isError && (
        <p className="text-sm text-red-500">No se pudo crear el partido (¿elegiste el mismo equipo dos veces?).</p>
      )}

      <div className="space-y-2">
        {partidos?.map((p) => (
          <PartidoRow key={p.id} partido={p} nombreLocal={nombreDe(p.equipo_local_id)} nombreVisitante={nombreDe(p.equipo_visitante_id)} torneoId={torneoId} />
        ))}
      </div>
    </div>
  )
}

function PartidoRow({ partido, nombreLocal, nombreVisitante, torneoId }) {
  const queryClient = useQueryClient()
  const [abierto, setAbierto] = useState(false)
  const [golesLocal, setGolesLocal] = useState(partido.goles_local ?? 0)
  const [golesVisitante, setGolesVisitante] = useState(partido.goles_visitante ?? 0)

  const invalidarTodo = () => {
    queryClient.invalidateQueries({ queryKey: ['partidos', torneoId] })
    queryClient.invalidateQueries({ queryKey: ['tabla-posiciones', torneoId] })
    queryClient.invalidateQueries({ queryKey: ['goleadores', torneoId] })
  }

  const guardarResultado = useMutation({
    mutationFn: () =>
      actualizarPartido(partido.id, {
        goles_local: Number(golesLocal),
        goles_visitante: Number(golesVisitante),
        jugado: true,
      }),
    onSuccess: invalidarTodo,
  })

  const eliminar = useMutation({
    mutationFn: () => eliminarPartido(partido.id),
    onSuccess: invalidarTodo,
  })

  const { data: goles } = useQuery({
    queryKey: ['goles-partido', partido.id],
    queryFn: () => getGolesDePartido(partido.id),
    enabled: abierto,
  })
  const { data: jugadoresLocal } = useQuery({
    queryKey: ['jugadores', partido.equipo_local_id],
    queryFn: () => getJugadoresDeEquipo(partido.equipo_local_id),
    enabled: abierto,
  })
  const { data: jugadoresVisitante } = useQuery({
    queryKey: ['jugadores', partido.equipo_visitante_id],
    queryFn: () => getJugadoresDeEquipo(partido.equipo_visitante_id),
    enabled: abierto,
  })
  const jugadoresDisponibles = [
    ...(jugadoresLocal ?? []).map((j) => ({ ...j, equipo_id: partido.equipo_local_id })),
    ...(jugadoresVisitante ?? []).map((j) => ({ ...j, equipo_id: partido.equipo_visitante_id })),
  ]

  const [jugadorGol, setJugadorGol] = useState('')
  const agregarGolMut = useMutation({
    mutationFn: () => {
      const j = jugadoresDisponibles.find((j) => j.id === jugadorGol)
      return agregarGol({ partido_id: partido.id, jugador_id: jugadorGol, equipo_id: j.equipo_id, cantidad: 1 })
    },
    onSuccess: () => {
      setJugadorGol('')
      queryClient.invalidateQueries({ queryKey: ['goles-partido', partido.id] })
      queryClient.invalidateQueries({ queryKey: ['goleadores', torneoId] })
    },
  })
  const quitarGolMut = useMutation({
    mutationFn: (golId) => eliminarGol(golId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goles-partido', partido.id] })
      queryClient.invalidateQueries({ queryKey: ['goleadores', torneoId] })
    },
  })

  const { data: tarjetas } = useQuery({
    queryKey: ['tarjetas-partido', partido.id],
    queryFn: () => getTarjetasDePartido(partido.id),
    enabled: abierto,
  })
  const [jugadorTarjeta, setJugadorTarjeta] = useState('')
  const [tipoTarjeta, setTipoTarjeta] = useState('amarilla')
  const agregarTarjetaMut = useMutation({
    mutationFn: () => {
      const j = jugadoresDisponibles.find((j) => j.id === jugadorTarjeta)
      return agregarTarjeta({
        partido_id: partido.id,
        jugador_id: jugadorTarjeta,
        equipo_id: j.equipo_id,
        tipo: tipoTarjeta,
      })
    },
    onSuccess: () => {
      setJugadorTarjeta('')
      queryClient.invalidateQueries({ queryKey: ['tarjetas-partido', partido.id] })
      queryClient.invalidateQueries({ queryKey: ['tarjetas', torneoId] })
    },
  })
  const quitarTarjetaMut = useMutation({
    mutationFn: (tarjetaId) => eliminarTarjeta(tarjetaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tarjetas-partido', partido.id] })
      queryClient.invalidateQueries({ queryKey: ['tarjetas', torneoId] })
    },
  })

  return (
    <div className="border border-blue-100 bg-white rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setAbierto(!abierto)} className="flex-1 text-left group">
          <span className="text-sm group-hover:underline">
            {nombreLocal} vs {nombreVisitante}{' '}
            {partido.jugado ? (
              <span className="font-semibold text-blue-700">
                — {partido.goles_local} a {partido.goles_visitante}
              </span>
            ) : (
              <span className="text-gray-400">(sin jugar)</span>
            )}
          </span>
          <span className="block text-xs text-blue-500 mt-0.5">
            {abierto ? '▲ Ocultar' : '▼ Cargar resultado, goles y tarjetas'}
          </span>
        </button>
        <button onClick={() => eliminar.mutate()} className="text-xs text-red-500 hover:underline shrink-0">
          Eliminar
        </button>
      </div>

      {abierto && (
        <div className="mt-3 space-y-4 border-t border-blue-100 pt-3">
          <div className="flex items-end gap-2 bg-blue-50 rounded-lg p-3">
            <Campo label={nombreLocal}>
              <input
                type="number"
                min="0"
                value={golesLocal}
                onChange={(e) => setGolesLocal(e.target.value)}
                className={`${INPUT_CLS} w-20`}
              />
            </Campo>
            <Campo label={nombreVisitante}>
              <input
                type="number"
                min="0"
                value={golesVisitante}
                onChange={(e) => setGolesVisitante(e.target.value)}
                className={`${INPUT_CLS} w-20`}
              />
            </Campo>
            <button
              onClick={() => guardarResultado.mutate()}
              disabled={guardarResultado.isPending}
              className="bg-brand-700 hover:bg-brand-800 text-white rounded px-3 py-2 disabled:opacity-50"
            >
              Guardar resultado
            </button>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs font-medium text-green-700 mb-1">⚽ Goleadores del partido</p>
            <ul className="text-sm space-y-1 mb-2">
              {goles?.map((g) => (
                <li key={g.id} className="flex items-center justify-between">
                  <span>{g.jugador?.nombre} ({g.cantidad})</span>
                  <button onClick={() => quitarGolMut.mutate(g.id)} className="text-xs text-red-500 hover:underline">
                    Quitar
                  </button>
                </li>
              ))}
              {goles?.length === 0 && <li className="text-gray-400">Sin goles cargados.</li>}
            </ul>
            <div className="flex gap-2">
              <select value={jugadorGol} onChange={(e) => setJugadorGol(e.target.value)} className={INPUT_CLS}>
                <option value="">Jugador que convirtió…</option>
                {jugadoresDisponibles.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nombre}
                  </option>
                ))}
              </select>
              <button
                disabled={!jugadorGol || agregarGolMut.isPending}
                onClick={() => agregarGolMut.mutate()}
                className="bg-green-600 hover:bg-green-700 text-white rounded px-3 disabled:opacity-50"
              >
                + Gol
              </button>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-3">
            <p className="text-xs font-medium text-amber-700 mb-1">🟨🟥 Tarjetas del partido</p>
            <ul className="text-sm space-y-1 mb-2">
              {tarjetas?.map((t) => (
                <li key={t.id} className="flex items-center justify-between">
                  <span>
                    {t.tipo === 'amarilla' ? '🟨' : '🟥'} {t.jugador?.nombre}
                  </span>
                  <button
                    onClick={() => quitarTarjetaMut.mutate(t.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Quitar
                  </button>
                </li>
              ))}
              {tarjetas?.length === 0 && <li className="text-gray-400">Sin tarjetas cargadas.</li>}
            </ul>
            <div className="flex flex-wrap gap-2">
              <select
                value={jugadorTarjeta}
                onChange={(e) => setJugadorTarjeta(e.target.value)}
                className={`${INPUT_CLS} flex-1 min-w-[10rem]`}
              >
                <option value="">Jugador…</option>
                {jugadoresDisponibles.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nombre}
                  </option>
                ))}
              </select>
              <select
                value={tipoTarjeta}
                onChange={(e) => setTipoTarjeta(e.target.value)}
                className={`${INPUT_CLS} w-32`}
              >
                <option value="amarilla">Amarilla</option>
                <option value="roja">Roja</option>
              </select>
              <button
                disabled={!jugadorTarjeta || agregarTarjetaMut.isPending}
                onClick={() => agregarTarjetaMut.mutate()}
                className="bg-amber-500 hover:bg-amber-600 text-white rounded px-3 disabled:opacity-50"
              >
                + Tarjeta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SuspensionesSection({ torneoId }) {
  const queryClient = useQueryClient()
  const { data: suspensiones } = useQuery({
    queryKey: ['suspensiones', torneoId],
    queryFn: () => getSuspensiones(torneoId),
  })
  const { data: jugadores } = useQuery({
    queryKey: ['jugadores-torneo', torneoId],
    queryFn: () => getJugadoresDeTorneo(torneoId),
  })

  const [jugadorId, setJugadorId] = useState('')
  const [motivo, setMotivo] = useState('')
  const [partidosTotales, setPartidosTotales] = useState(1)

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ['suspensiones', torneoId] })

  const crear = useMutation({
    mutationFn: () => {
      const j = jugadores.find((j) => j.id === jugadorId)
      return crearSuspension({
        torneo_id: torneoId,
        jugador_id: jugadorId,
        equipo_id: j.equipo_id,
        motivo: motivo || null,
        partidos_totales: Number(partidosTotales),
        partidos_restantes: Number(partidosTotales),
      })
    },
    onSuccess: () => {
      setJugadorId('')
      setMotivo('')
      setPartidosTotales(1)
      invalidar()
    },
  })

  const restarFecha = useMutation({
    mutationFn: (s) => actualizarSuspension(s.id, { partidos_restantes: Math.max(0, s.partidos_restantes - 1) }),
    onSuccess: invalidar,
  })

  const eliminar = useMutation({
    mutationFn: (id) => eliminarSuspension(id),
    onSuccess: invalidar,
  })

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-end">
        <select
          value={jugadorId}
          onChange={(e) => setJugadorId(e.target.value)}
          className={`${INPUT_CLS} flex-1 min-w-[12rem]`}
        >
          <option value="">Jugador…</option>
          {jugadores?.map((j) => (
            <option key={j.id} value={j.id}>
              {j.nombre} ({j.equipo_nombre})
            </option>
          ))}
        </select>
        <input
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Motivo (opcional)"
          className={`${INPUT_CLS} flex-1 min-w-[10rem]`}
        />
        <div className="w-28">
          <label className="block text-xs text-gray-500 mb-1">Partidos</label>
          <input
            type="number"
            min="1"
            value={partidosTotales}
            onChange={(e) => setPartidosTotales(e.target.value)}
            className={INPUT_CLS}
          />
        </div>
        <button
          disabled={!jugadorId || crear.isPending}
          onClick={() => crear.mutate()}
          className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-2 disabled:opacity-50"
        >
          Suspender
        </button>
      </div>

      <ul className="space-y-2">
        {suspensiones?.map((s) => (
          <li
            key={s.id}
            className="bg-white border border-red-100 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-sm"
          >
            <span>
              <span className="font-medium">{s.jugador?.nombre}</span>{' '}
              <span className="text-gray-500">
                ({s.equipo?.nombre}
                {s.motivo ? ` — ${s.motivo}` : ''})
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span
                className={`font-semibold text-xs rounded-full px-2.5 py-1 ${
                  s.partidos_restantes > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
              >
                {s.partidos_restantes} / {s.partidos_totales}
              </span>
              {s.partidos_restantes > 0 && (
                <button
                  onClick={() => restarFecha.mutate(s)}
                  className="text-xs border border-red-200 text-red-700 rounded px-2 py-1 hover:bg-red-50"
                >
                  Cumplió 1 fecha
                </button>
              )}
              <button onClick={() => eliminar.mutate(s.id)} className="text-xs text-red-500 hover:underline">
                Eliminar
              </button>
            </span>
          </li>
        ))}
        {suspensiones?.length === 0 && (
          <li className="py-2 text-sm text-gray-400">No hay jugadores suspendidos.</li>
        )}
      </ul>
    </div>
  )
}
