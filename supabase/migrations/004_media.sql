-- Correr en el SQL Editor de Supabase DESPUES de las migraciones anteriores.
-- En un proyecto nuevo esto ya viene incluido en schema.sql.
-- Fotos/imagenes que carga el admin desde el panel (canchas, partidos, etc.)
-- usando Supabase Storage. Los assets fijos (logo, flyer, videos cortos) van
-- bundleados directo en el sitio, no acá.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_bucket_select_publico" on storage.objects for select using (bucket_id = 'media');
create policy "media_bucket_insert_admin" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "media_bucket_delete_admin" on storage.objects for delete to authenticated using (bucket_id = 'media');

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('cancha', 'partido', 'general')),
  storage_path text not null,
  titulo text,
  orden int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_media_categoria on media(categoria);

alter table media enable row level security;
create policy "media_select_publico" on media for select using (true);
create policy "media_insert_admin" on media for insert to authenticated with check (true);
create policy "media_update_admin" on media for update to authenticated using (true) with check (true);
create policy "media_delete_admin" on media for delete to authenticated using (true);
