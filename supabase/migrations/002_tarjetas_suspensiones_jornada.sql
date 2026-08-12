-- Correr en el SQL Editor de Supabase DESPUES de schema.sql (proyectos ya existentes,
-- como el de la demo). En un proyecto nuevo esto ya viene incluido en schema.sql.

-- Jornada opcional en partidos, para agrupar el fixture como "Fecha 12", "Fecha 13", etc.
alter table partidos add column if not exists jornada int;
create index if not exists idx_partidos_jornada on partidos(torneo_id, jornada);

-- Tarjetas cargadas por partido
create table if not exists tarjetas (
  id uuid primary key default gen_random_uuid(),
  partido_id uuid not null references partidos(id) on delete cascade,
  jugador_id uuid not null references jugadores(id) on delete cascade,
  equipo_id uuid not null references equipos(id),
  tipo text not null check (tipo in ('amarilla', 'roja')),
  created_at timestamptz not null default now()
);
create index if not exists idx_tarjetas_partido on tarjetas(partido_id);
create index if not exists idx_tarjetas_jugador on tarjetas(jugador_id);

alter table tarjetas enable row level security;
create policy "tarjetas_select_publico" on tarjetas for select using (true);
create policy "tarjetas_insert_admin" on tarjetas for insert to authenticated with check (true);
create policy "tarjetas_update_admin" on tarjetas for update to authenticated using (true) with check (true);
create policy "tarjetas_delete_admin" on tarjetas for delete to authenticated using (true);

-- Tarjetas acumuladas por jugador y torneo (alimenta la pestaña de Estadísticas/Suspendidos)
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

-- Suspensiones: se gestionan a mano desde el admin. El criterio de cuántas
-- tarjetas ameritan una suspensión varía según el reglamento de cada torneo,
-- así que no se calcula solo a partir de las tarjetas.
create table if not exists suspensiones (
  id uuid primary key default gen_random_uuid(),
  torneo_id uuid not null references torneos(id) on delete cascade,
  jugador_id uuid not null references jugadores(id) on delete cascade,
  equipo_id uuid not null references equipos(id),
  motivo text,
  partidos_totales int not null default 1 check (partidos_totales >= 1),
  partidos_restantes int not null default 1 check (partidos_restantes >= 0),
  created_at timestamptz not null default now()
);
create index if not exists idx_suspensiones_torneo on suspensiones(torneo_id);

alter table suspensiones enable row level security;
create policy "suspensiones_select_publico" on suspensiones for select using (true);
create policy "suspensiones_insert_admin" on suspensiones for insert to authenticated with check (true);
create policy "suspensiones_update_admin" on suspensiones for update to authenticated using (true) with check (true);
create policy "suspensiones_delete_admin" on suspensiones for delete to authenticated using (true);
