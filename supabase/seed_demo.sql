-- Datos de ejemplo para mostrarle al cliente cómo se ve el sitio funcionando.
-- Correr DESPUÉS de schema.sql (y de la migración 002 si el proyecto ya
-- existía de antes), en el SQL Editor de Supabase.
-- Se puede borrar en cualquier momento borrando el torneo "Copa Demo Verano 2026"
-- (el resto de las tablas relacionadas se borran solas por los "on delete cascade").

do $$
declare
  v_torneo_id uuid;
  v_equipo_norte uuid;
  v_equipo_sur uuid;
  v_equipo_central uuid;
  v_equipo_rio uuid;
  v_jugador1 uuid;
  v_jugador2 uuid;
  v_jugador3 uuid;
  v_jugador4 uuid;
  v_partido1 uuid;
  v_partido2 uuid;
begin
  insert into torneos (nombre, descripcion, precio_texto, puntos_victoria, puntos_empate, puntos_derrota, estado, fecha_inicio)
  values ('Copa Demo Verano 2026', 'Torneo de ejemplo para mostrar cómo se ve el sitio.', '$8.000 por equipo', 3, 1, 0, 'activo', current_date)
  returning id into v_torneo_id;

  insert into equipos (nombre) values ('Deportivo Norte') returning id into v_equipo_norte;
  insert into equipos (nombre) values ('Atlético Sur') returning id into v_equipo_sur;
  insert into equipos (nombre) values ('Unión Central') returning id into v_equipo_central;
  insert into equipos (nombre) values ('Estrella del Río') returning id into v_equipo_rio;

  insert into torneo_equipos (torneo_id, equipo_id) values
    (v_torneo_id, v_equipo_norte),
    (v_torneo_id, v_equipo_sur),
    (v_torneo_id, v_equipo_central),
    (v_torneo_id, v_equipo_rio);

  insert into jugadores (equipo_id, nombre, dorsal) values (v_equipo_norte, 'Lucas Gómez', 9) returning id into v_jugador1;
  insert into jugadores (equipo_id, nombre, dorsal) values (v_equipo_sur, 'Martín Díaz', 10) returning id into v_jugador2;
  insert into jugadores (equipo_id, nombre, dorsal) values (v_equipo_central, 'Facundo Ruiz', 7) returning id into v_jugador3;
  insert into jugadores (equipo_id, nombre, dorsal) values (v_equipo_rio, 'Nicolás Paz', 11) returning id into v_jugador4;

  insert into partidos (torneo_id, equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, fecha, jugado, jornada)
  values (v_torneo_id, v_equipo_norte, v_equipo_sur, 2, 1, now() - interval '7 days', true, 1)
  returning id into v_partido1;

  insert into partidos (torneo_id, equipo_local_id, equipo_visitante_id, goles_local, goles_visitante, fecha, jugado, jornada)
  values (v_torneo_id, v_equipo_central, v_equipo_rio, 1, 1, now() - interval '5 days', true, 1)
  returning id into v_partido2;

  insert into partidos (torneo_id, equipo_local_id, equipo_visitante_id, fecha, jugado, jornada)
  values (v_torneo_id, v_equipo_norte, v_equipo_central, now() + interval '3 days', false, 2);

  insert into partido_goles (partido_id, jugador_id, equipo_id, cantidad) values
    (v_partido1, v_jugador1, v_equipo_norte, 2),
    (v_partido1, v_jugador2, v_equipo_sur, 1),
    (v_partido2, v_jugador3, v_equipo_central, 1),
    (v_partido2, v_jugador4, v_equipo_rio, 1);

  insert into tarjetas (partido_id, jugador_id, equipo_id, tipo) values
    (v_partido1, v_jugador2, v_equipo_sur, 'amarilla'),
    (v_partido2, v_jugador4, v_equipo_rio, 'amarilla'),
    (v_partido2, v_jugador4, v_equipo_rio, 'amarilla');

  insert into suspensiones (torneo_id, jugador_id, equipo_id, motivo, partidos_totales, partidos_restantes) values
    (v_torneo_id, v_jugador4, v_equipo_rio, 'Doble amarilla', 1, 1);

  update configuracion_sitio set
    telefono = '+54 9 11 1234-5678',
    whatsapp = '+54 9 11 1234-5678',
    email = 'contacto@torneosbruja.com',
    instagram = '@torneosbruja',
    descripcion_general = 'Organizamos torneos de fútbol amateur. Estos son los torneos disponibles.'
  where id = 1;
end $$;
