import { supabase } from './supabaseClient'

function throwIfError({ data, error }) {
  if (error) throw error
  return data
}

// ---------- Lecturas públicas ----------

export const getTorneos = () =>
  supabase.from('torneos').select('*').order('created_at', { ascending: false }).then(throwIfError)

export const getTorneo = (id) =>
  supabase.from('torneos').select('*').eq('id', id).single().then(throwIfError)

export const getTablaPosiciones = (torneoId) =>
  supabase
    .from('vista_tabla_posiciones')
    .select('*')
    .eq('torneo_id', torneoId)
    .order('puntos', { ascending: false })
    .order('dg', { ascending: false })
    .order('gf', { ascending: false })
    .then(throwIfError)

export const getVallaVencida = (torneoId) =>
  supabase
    .from('vista_tabla_posiciones')
    .select('*')
    .eq('torneo_id', torneoId)
    .order('gc', { ascending: true })
    .order('pj', { ascending: false })
    .then(throwIfError)

export const getGoleadores = (torneoId) =>
  supabase
    .from('vista_goleadores')
    .select('*')
    .eq('torneo_id', torneoId)
    .order('goles', { ascending: false })
    .then(throwIfError)

export const getTarjetas = (torneoId) =>
  supabase
    .from('vista_tarjetas')
    .select('*')
    .eq('torneo_id', torneoId)
    .order('amarillas', { ascending: false })
    .order('rojas', { ascending: false })
    .then(throwIfError)

export const getSuspensiones = (torneoId) =>
  supabase
    .from('suspensiones')
    .select('*, jugador:jugadores(nombre), equipo:equipos(nombre)')
    .eq('torneo_id', torneoId)
    .order('created_at', { ascending: false })
    .then(throwIfError)

export const getEquiposDeTorneo = (torneoId) =>
  supabase
    .from('torneo_equipos')
    .select('id, equipo:equipos(id, nombre, escudo_url)')
    .eq('torneo_id', torneoId)
    .then(throwIfError)

export const getJugadoresDeTorneo = (torneoId) =>
  supabase
    .from('torneo_equipos')
    .select('equipo:equipos(id, nombre, jugadores(id, nombre))')
    .eq('torneo_id', torneoId)
    .then(throwIfError)
    .then((rows) =>
      rows.flatMap((row) =>
        (row.equipo?.jugadores ?? []).map((j) => ({ ...j, equipo_id: row.equipo.id, equipo_nombre: row.equipo.nombre }))
      )
    )

export const getPartidos = (torneoId) =>
  supabase
    .from('partidos')
    .select('*')
    .eq('torneo_id', torneoId)
    .order('jornada', { ascending: true, nullsFirst: false })
    .order('fecha', { ascending: true })
    .then(throwIfError)

export const getConfiguracion = () =>
  supabase.from('configuracion_sitio').select('*').eq('id', 1).single().then(throwIfError)

export const getMedia = (categoria) => {
  let query = supabase
    .from('media')
    .select('*')
    .order('orden', { ascending: true })
    .order('created_at', { ascending: false })
  if (categoria) query = query.eq('categoria', categoria)
  return query.then(throwIfError)
}

export const urlDeMedia = (path) => supabase.storage.from('media').getPublicUrl(path).data.publicUrl

// ---------- Lecturas para el admin ----------

export const getEquipos = () =>
  supabase.from('equipos').select('*').order('nombre').then(throwIfError)

export const getJugadoresDeEquipo = (equipoId) =>
  supabase.from('jugadores').select('*').eq('equipo_id', equipoId).order('nombre').then(throwIfError)

export const getGolesDePartido = (partidoId) =>
  supabase
    .from('partido_goles')
    .select('*, jugador:jugadores(nombre)')
    .eq('partido_id', partidoId)
    .then(throwIfError)

export const getTarjetasDePartido = (partidoId) =>
  supabase
    .from('tarjetas')
    .select('*, jugador:jugadores(nombre)')
    .eq('partido_id', partidoId)
    .then(throwIfError)

// ---------- Escrituras (admin, requieren sesión) ----------

export const crearTorneo = (torneo) =>
  supabase.from('torneos').insert(torneo).select().single().then(throwIfError)

export const actualizarTorneo = (id, cambios) =>
  supabase.from('torneos').update(cambios).eq('id', id).select().single().then(throwIfError)

export const eliminarTorneo = (id) =>
  supabase.from('torneos').delete().eq('id', id).then(throwIfError)

export const crearEquipo = (equipo) =>
  supabase.from('equipos').insert(equipo).select().single().then(throwIfError)

export const actualizarEquipo = (id, cambios) =>
  supabase.from('equipos').update(cambios).eq('id', id).select().single().then(throwIfError)

export const eliminarEquipo = (id) => supabase.from('equipos').delete().eq('id', id).then(throwIfError)

export const inscribirEquipo = (torneoId, equipoId) =>
  supabase
    .from('torneo_equipos')
    .insert({ torneo_id: torneoId, equipo_id: equipoId })
    .select()
    .single()
    .then(throwIfError)

export const quitarInscripcion = (id) =>
  supabase.from('torneo_equipos').delete().eq('id', id).then(throwIfError)

export const crearJugador = (jugador) =>
  supabase.from('jugadores').insert(jugador).select().single().then(throwIfError)

export const actualizarJugador = (id, cambios) =>
  supabase.from('jugadores').update(cambios).eq('id', id).select().single().then(throwIfError)

export const eliminarJugador = (id) => supabase.from('jugadores').delete().eq('id', id).then(throwIfError)

export const crearPartido = (partido) =>
  supabase.from('partidos').insert(partido).select().single().then(throwIfError)

export const actualizarPartido = (id, cambios) =>
  supabase.from('partidos').update(cambios).eq('id', id).select().single().then(throwIfError)

export const eliminarPartido = (id) => supabase.from('partidos').delete().eq('id', id).then(throwIfError)

export const agregarGol = (gol) =>
  supabase.from('partido_goles').insert(gol).select().single().then(throwIfError)

export const eliminarGol = (id) => supabase.from('partido_goles').delete().eq('id', id).then(throwIfError)

export const agregarTarjeta = (tarjeta) =>
  supabase.from('tarjetas').insert(tarjeta).select().single().then(throwIfError)

export const eliminarTarjeta = (id) => supabase.from('tarjetas').delete().eq('id', id).then(throwIfError)

export const crearSuspension = (suspension) =>
  supabase.from('suspensiones').insert(suspension).select().single().then(throwIfError)

export const actualizarSuspension = (id, cambios) =>
  supabase.from('suspensiones').update(cambios).eq('id', id).select().single().then(throwIfError)

export const eliminarSuspension = (id) =>
  supabase.from('suspensiones').delete().eq('id', id).then(throwIfError)

export const actualizarConfiguracion = (cambios) =>
  supabase.from('configuracion_sitio').update(cambios).eq('id', 1).select().single().then(throwIfError)

export const subirMedia = async ({ file, categoria, titulo }) => {
  const ext = file.name.split('.').pop()
  const path = `${categoria}/${crypto.randomUUID()}.${ext}`
  const { error: uploadError } = await supabase.storage.from('media').upload(path, file)
  if (uploadError) throw uploadError
  return supabase
    .from('media')
    .insert({ categoria, storage_path: path, titulo: titulo || null })
    .select()
    .single()
    .then(throwIfError)
}

export const eliminarMedia = async (item) => {
  await supabase.storage.from('media').remove([item.storage_path])
  return supabase.from('media').delete().eq('id', item.id).then(throwIfError)
}

export const subirEscudoEquipo = async ({ file, equipoId }) => {
  const ext = file.name.split('.').pop()
  const path = `escudos/${equipoId}-${crypto.randomUUID()}.${ext}`
  const { error: uploadError } = await supabase.storage.from('media').upload(path, file)
  if (uploadError) throw uploadError
  const escudo_url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl
  return actualizarEquipo(equipoId, { escudo_url })
}
