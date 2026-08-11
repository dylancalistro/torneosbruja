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
  crearJugador,
  eliminarJugador,
  getPartidos,
  crearPartido,
  actualizarPartido,
  eliminarPartido,
  getGolesDePartido,
  agregarGol,
  eliminarGol,
} from '../../lib/api'

const ESTADOS = ['proximamente', 'activo', 'finalizado']
const INPUT_CLS = 'border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-transparent w-full'

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
    <div className="space-y-10">
      <Link to="/admin" className="text-sm text-gray-500 hover:underline">
        ← Volver
      </Link>

      <section className="space-y-3 max-w-lg">
        <h1 className="text-xl font-semibold">Editar torneo</h1>
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
            className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded px-4 py-2 disabled:opacity-50"
          >
            Guardar
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Equipos inscriptos</h2>

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
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 disabled:opacity-50"
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
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 disabled:opacity-50"
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
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Partidos</h2>
        <PartidosSection torneoId={id} equiposInscriptos={equiposInscriptos ?? []} />
      </section>
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

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded p-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setAbierto(!abierto)} className="font-medium hover:underline">
          {equipo?.nombre}
        </button>
        <button onClick={onQuitar} className="text-xs text-red-500 hover:underline">
          Quitar del torneo
        </button>
      </div>

      {abierto && (
        <div className="mt-3 space-y-2">
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
              className="border border-gray-300 dark:border-gray-700 rounded px-3 disabled:opacity-50"
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

  const crear = useMutation({
    mutationFn: () =>
      crearPartido({ torneo_id: torneoId, equipo_local_id: local, equipo_visitante_id: visitante }),
    onSuccess: () => {
      setLocal('')
      setVisitante('')
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
        <button
          disabled={!local || !visitante || local === visitante || crear.isPending}
          onClick={() => crear.mutate()}
          className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 disabled:opacity-50"
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

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded p-3">
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setAbierto(!abierto)} className="text-sm hover:underline text-left">
          {nombreLocal} vs {nombreVisitante}{' '}
          {partido.jugado ? `— ${partido.goles_local} a ${partido.goles_visitante}` : '(sin jugar)'}
        </button>
        <button onClick={() => eliminar.mutate()} className="text-xs text-red-500 hover:underline shrink-0">
          Eliminar
        </button>
      </div>

      {abierto && (
        <div className="mt-3 space-y-4">
          <div className="flex items-end gap-2">
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
              className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded px-3 py-2 disabled:opacity-50"
            >
              Guardar resultado
            </button>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Goleadores del partido</p>
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
                className="border border-gray-300 dark:border-gray-700 rounded px-3 disabled:opacity-50"
              >
                + Gol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
