# TorneosApp

Web pública de torneos de fútbol (tablas de posiciones, goleadores, torneos disponibles, precios y contacto) + panel admin para cargar todo. Pensada para que el **cliente sea dueño de toda la infraestructura** (Supabase + Vercel + su dominio) — nadie más queda a cargo de mantener servidores ni bases de datos.

## Estructura

- `frontend/` — app Vite + React (sitio público y panel admin en `/admin`).
- `supabase/schema.sql` — todo el modelo de datos: tablas, índices, vistas de cálculo automático y políticas de seguridad (RLS).

## 1. Crear el proyecto en Supabase (cuenta del cliente)

1. Crear cuenta en [supabase.com](https://supabase.com) con el email del cliente y crear un proyecto nuevo.
2. Ir a **SQL Editor** y correr el contenido completo de `supabase/schema.sql`. Esto crea las tablas, los índices, las vistas de posiciones/goleadores y las políticas de seguridad (RLS).
3. Ir a **Authentication → Users** y crear a mano el usuario admin (email + contraseña). **No** debe quedar habilitado el registro público — solo este usuario podrá cargar datos.
4. Ir a **Authentication → URL Configuration** y dejar únicamente las URLs reales del sitio (producción + `localhost` mientras se desarrolla).
5. (Opcional pero recomendado) Activar hCaptcha en **Authentication → Attack Protection** y copiar el site key — se usa en el login del admin para frenar fuerza bruta.
6. Ir a **Project Settings → API** y copiar `Project URL` y `anon public key` — van en el `.env` del frontend.
7. Ir a **Storage** y crear un bucket público (ej. `logos`) para los escudos de equipo y el logo del sitio, con límite de tamaño (2MB) y tipos permitidos (`image/png`, `image/jpeg`, `image/webp`).

## 2. Configurar el frontend

```
cd frontend
cp .env.example .env
```

Completar `.env` con los valores de Supabase (y el hCaptcha site key si se activó):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_HCAPTCHA_SITE_KEY=...
```

```
npm install
npm run dev
```

## 3. Publicar en Vercel (cuenta del cliente)

1. Crear cuenta en [vercel.com](https://vercel.com) con el email del cliente.
2. Importar el repo, con **Root Directory = `frontend`**.
3. Cargar las mismas variables de entorno del `.env` en **Settings → Environment Variables**.
4. Conectar el dominio propio del cliente en **Settings → Domains**.

`vercel.json` ya incluye los headers de seguridad (CSP, HSTS, X-Frame-Options, etc.) — no hace falta configurarlos aparte.

## Notas de seguridad

- La seguridad de escritura corre por **Row Level Security** en Postgres (definido en `schema.sql`): cualquiera puede leer, pero solo el usuario admin autenticado puede insertar/editar/borrar. Antes de dar el proyecto por cerrado, probar explícitamente que un visitante sin sesión no puede modificar nada.
- No compartir la `service_role key` de Supabase con nadie ni pegarla en el frontend — el frontend solo debe usar la `anon key` (que es pública por diseño, la seguridad real la da RLS).
- Si en algún momento se necesita cobro online, evaluarlo como una etapa aparte (no está contemplado en esta versión).

## Rendimiento

- El sitio es un SPA estático servido por CDN (Vercel) — soporta picos de visitas sin configuración extra.
- Las lecturas públicas usan cache en el cliente (React Query, ~2 min) para no repetir consultas innecesarias.
- Si se espera tráfico fuerte en fechas puntuales, considerar pasar el proyecto de Supabase a un plan pago (la cuenta y el costo son del cliente).
