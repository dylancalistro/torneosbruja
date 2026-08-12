-- TorneosApp - schema de Supabase (Postgres)
-- Correr completo en el SQL Editor de Supabase (proyecto nuevo, vacío).
-- pgcrypto ya viene habilitado por defecto en Supabase (gen_random_uuid()).

-- =========================================================
-- TABLAS
-- =========================================================

create table torneos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 120),
  descripcion text,
  precio_texto text,
  puntos_victoria int not null default 3 check (puntos_victoria >= 0),
  puntos_empate int not null default 1 check (puntos_empate >= 0),
  puntos_derrota int not null default 0 check (puntos_derrota >= 0),
  estado text not null default 'proximamente' check (estado in ('proximamente', 'activo', 'finalizado')),
  fecha_inicio date,
  fecha_fin date,
  created_at timestamptz not null default now()
);

create table equipos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 120),
  escudo_url text,
  created_at timestamptz not null default now()
);

create table torneo_equipos (
  id uuid primary key default gen_random_uuid(),
  torneo_id uuid not null references torneos(id) on delete cascade,
  equipo_id uuid not null references equipos(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (torneo_id, equipo_id)
);

create table jugadores (
  id uuid primary key default gen_random_uuid(),
  equipo_id uuid not null references equipos(id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 120),
  dorsal int check (dorsal is null or (dorsal between 0 and 999)),
  created_at timestamptz not null default now()
);

create table partidos (
  id uuid primary key default gen_random_uuid(),
  torneo_id uuid not null references torneos(id) on delete cascade,
  equipo_local_id uuid not null references equipos(id),
  equipo_visitante_id uuid not null references equipos(id),
  goles_local int check (goles_local >= 0),
  goles_visitante int check (goles_visitante >= 0),
  fecha timestamptz,
  jugado boolean not null default false,
  jornada int,
  created_at timestamptz not null default now(),
  check (equipo_local_id <> equipo_visitante_id),
  check (jugado = false or (goles_local is not null and goles_visitante is not null))
);

-- Tarjetas cargadas por partido
create table tarjetas (
  id uuid primary key default gen_random_uuid(),
  partido_id uuid not null references partidos(id) on delete cascade,
  jugador_id uuid not null references jugadores(id) on delete cascade,
  equipo_id uuid not null references equipos(id),
  tipo text not null check (tipo in ('amarilla', 'roja')),
  created_at timestamptz not null default now()
);

-- Suspensiones: se gestionan a mano desde el admin. El criterio de cuántas
-- tarjetas ameritan una suspensión varía según el reglamento de cada torneo,
-- así que no se calcula solo a partir de las tarjetas.
create table suspensiones (
  id uuid primary key default gen_random_uuid(),
  torneo_id uuid not null references torneos(id) on delete cascade,
  jugador_id uuid not null references jugadores(id) on delete cascade,
  equipo_id uuid not null references equipos(id),
  motivo text,
  partidos_totales int not null default 1 check (partidos_totales >= 1),
  partidos_restantes int not null default 1 check (partidos_restantes >= 0),
  created_at timestamptz not null default now()
);

create table partido_goles (
  id uuid primary key default gen_random_uuid(),
  partido_id uuid not null references partidos(id) on delete cascade,
  jugador_id uuid not null references jugadores(id) on delete cascade,
  equipo_id uuid not null references equipos(id),
  cantidad int not null default 1 check (cantidad >= 1),
  created_at timestamptz not null default now()
);

-- Fila única de configuración pública del sitio (contacto, redes, etc.)
create table configuracion_sitio (
  id int primary key default 1 check (id = 1),
  telefono text,
  whatsapp text,
  email text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  instagram text,
  facebook text,
  descripcion_general text,
  logo_url text,
  updated_at timestamptz not null default now()
);

insert into configuracion_sitio (id) values (1);

-- =========================================================
-- ÍNDICES (para que las vistas rindan bien con mucha carga)
-- =========================================================

create index idx_torneo_equipos_torneo on torneo_equipos(torneo_id);
create index idx_torneo_equipos_equipo on torneo_equipos(equipo_id);
create index idx_jugadores_equipo on jugadores(equipo_id);
create index idx_partidos_torneo on partidos(torneo_id);
create index idx_partidos_local on partidos(equipo_local_id);
create index idx_partidos_visitante on partidos(equipo_visitante_id);
create index idx_partidos_jornada on partidos(torneo_id, jornada);
create index idx_partido_goles_partido on partido_goles(partido_id);
create index idx_partido_goles_jugador on partido_goles(jugador_id);
create index idx_partido_goles_equipo on partido_goles(equipo_id);
create index idx_tarjetas_partido on tarjetas(partido_id);
create index idx_tarjetas_jugador on tarjetas(jugador_id);
create index idx_suspensiones_torneo on suspensiones(torneo_id);

-- =========================================================
-- VISTAS (cálculo automático de posiciones y goleadores)
-- security_invoker = true: la vista respeta el RLS del rol que consulta
-- (anon/authenticated), no los permisos del dueño de la vista.
-- =========================================================

create or replace view vista_tabla_posiciones
with (security_invoker = true) as
with resultados as (
  select
    p.torneo_id,
    p.equipo_local_id as equipo_id,
    p.goles_local as goles_favor,
    p.goles_visitante as goles_contra,
    case
      when p.goles_local > p.goles_visitante then 'G'
      when p.goles_local = p.goles_visitante then 'E'
      else 'P'
    end as resultado
  from partidos p
  where p.jugado = true

  union all

  select
    p.torneo_id,
    p.equipo_visitante_id as equipo_id,
    p.goles_visitante as goles_favor,
    p.goles_local as goles_contra,
    case
      when p.goles_visitante > p.goles_local then 'G'
      when p.goles_visitante = p.goles_local then 'E'
      else 'P'
    end as resultado
  from partidos p
  where p.jugado = true
),
agregado as (
  select
    torneo_id,
    equipo_id,
    count(*) as pj,
    count(*) filter (where resultado = 'G') as pg,
    count(*) filter (where resultado = 'E') as pe,
    count(*) filter (where resultado = 'P') as pp,
    coalesce(sum(goles_favor), 0) as gf,
    coalesce(sum(goles_contra), 0) as gc
  from resultados
  group by torneo_id, equipo_id
)
select
  te.torneo_id,
  te.equipo_id,
  e.nombre as equipo_nombre,
  e.escudo_url,
  coalesce(a.pj, 0) as pj,
  coalesce(a.pg, 0) as pg,
  coalesce(a.pe, 0) as pe,
  coalesce(a.pp, 0) as pp,
  coalesce(a.gf, 0) as gf,
  coalesce(a.gc, 0) as gc,
  coalesce(a.gf, 0) - coalesce(a.gc, 0) as dg,
  coalesce(a.pg, 0) * t.puntos_victoria
    + coalesce(a.pe, 0) * t.puntos_empate
    + coalesce(a.pp, 0) * t.puntos_derrota as puntos
from torneo_equipos te
join equipos e on e.id = te.equipo_id
join torneos t on t.id = te.torneo_id
left join agregado a on a.torneo_id = te.torneo_id and a.equipo_id = te.equipo_id
order by te.torneo_id, puntos desc, dg desc, gf desc;

create or replace view vista_goleadores
with (security_invoker = true) as
select
  p.torneo_id,
  pg.jugador_id,
  j.nombre as jugador_nombre,
  pg.equipo_id,
  e.nombre as equipo_nombre,
  sum(pg.cantidad) as goles
from partido_goles pg
join partidos p on p.id = pg.partido_id
join jugadores j on j.id = pg.jugador_id
join equipos e on e.id = pg.equipo_id
group by p.torneo_id, pg.jugador_id, j.nombre, pg.equipo_id, e.nombre
order by p.torneo_id, goles desc;

-- Tarjetas acumuladas por jugador y torneo
create or replace view vista_tarjetas
with (security_invoker = true) as
select
  p.torneo_id,
  t.jugador_id,
  j.nombre as jugador_nombre,
  t.equipo_id,
  e.nombre as equipo_nombre,
  count(*) filter (where t.tipo = 'amarilla') as amarillas,
  count(*) filter (where t.tipo = 'roja') as rojas
from tarjetas t
join partidos p on p.id = t.partido_id
join jugadores j on j.id = t.jugador_id
join equipos e on e.id = t.equipo_id
group by p.torneo_id, t.jugador_id, j.nombre, t.equipo_id, e.nombre
order by amarillas desc, rojas desc;

-- =========================================================
-- ROW LEVEL SECURITY
-- Lectura pública (anon + authenticated), escritura solo authenticated.
-- El único usuario admin se crea a mano en Supabase Auth (sin signup público).
-- =========================================================

alter table torneos enable row level security;
alter table equipos enable row level security;
alter table torneo_equipos enable row level security;
alter table jugadores enable row level security;
alter table partidos enable row level security;
alter table partido_goles enable row level security;
alter table tarjetas enable row level security;
alter table suspensiones enable row level security;
alter table configuracion_sitio enable row level security;

create policy "torneos_select_publico" on torneos for select using (true);
create policy "torneos_insert_admin" on torneos for insert to authenticated with check (true);
create policy "torneos_update_admin" on torneos for update to authenticated using (true) with check (true);
create policy "torneos_delete_admin" on torneos for delete to authenticated using (true);

create policy "equipos_select_publico" on equipos for select using (true);
create policy "equipos_insert_admin" on equipos for insert to authenticated with check (true);
create policy "equipos_update_admin" on equipos for update to authenticated using (true) with check (true);
create policy "equipos_delete_admin" on equipos for delete to authenticated using (true);

create policy "torneo_equipos_select_publico" on torneo_equipos for select using (true);
create policy "torneo_equipos_insert_admin" on torneo_equipos for insert to authenticated with check (true);
create policy "torneo_equipos_update_admin" on torneo_equipos for update to authenticated using (true) with check (true);
create policy "torneo_equipos_delete_admin" on torneo_equipos for delete to authenticated using (true);

create policy "jugadores_select_publico" on jugadores for select using (true);
create policy "jugadores_insert_admin" on jugadores for insert to authenticated with check (true);
create policy "jugadores_update_admin" on jugadores for update to authenticated using (true) with check (true);
create policy "jugadores_delete_admin" on jugadores for delete to authenticated using (true);

create policy "partidos_select_publico" on partidos for select using (true);
create policy "partidos_insert_admin" on partidos for insert to authenticated with check (true);
create policy "partidos_update_admin" on partidos for update to authenticated using (true) with check (true);
create policy "partidos_delete_admin" on partidos for delete to authenticated using (true);

create policy "partido_goles_select_publico" on partido_goles for select using (true);
create policy "partido_goles_insert_admin" on partido_goles for insert to authenticated with check (true);
create policy "partido_goles_update_admin" on partido_goles for update to authenticated using (true) with check (true);
create policy "partido_goles_delete_admin" on partido_goles for delete to authenticated using (true);

create policy "tarjetas_select_publico" on tarjetas for select using (true);
create policy "tarjetas_insert_admin" on tarjetas for insert to authenticated with check (true);
create policy "tarjetas_update_admin" on tarjetas for update to authenticated using (true) with check (true);
create policy "tarjetas_delete_admin" on tarjetas for delete to authenticated using (true);

create policy "suspensiones_select_publico" on suspensiones for select using (true);
create policy "suspensiones_insert_admin" on suspensiones for insert to authenticated with check (true);
create policy "suspensiones_update_admin" on suspensiones for update to authenticated using (true) with check (true);
create policy "suspensiones_delete_admin" on suspensiones for delete to authenticated using (true);

create policy "configuracion_select_publico" on configuracion_sitio for select using (true);
create policy "configuracion_update_admin" on configuracion_sitio for update to authenticated using (true) with check (true);
