-- Correr en el SQL Editor de Supabase DESPUES de las migraciones anteriores.
-- En un proyecto nuevo esto ya viene incluido en schema.sql.

alter table configuracion_sitio add column if not exists direccion text;
alter table configuracion_sitio add column if not exists servicios text;
