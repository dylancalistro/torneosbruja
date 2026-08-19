import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTorneos, crearTorneo } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'
import { ImageIcon, ContactCardIcon } from '../../components/icons'
import { estadoCfg } from '../../lib/estados'

const ACCESOS = [
  {
    to: '/admin/galeria',
    Icon: ImageIcon,
    titulo: 'Galería',
    descripcion: 'Subir y ordenar las fotos del complejo',
    badge: 'bg-accent-500',
    hover: 'hover:border-accent-500 hover:bg-accent-50',
  },
  {
    to: '/admin/config',
    Icon: ContactCardIcon,
    titulo: 'Datos de contacto',
    descripcion: 'Teléfono, WhatsApp, redes y descripción del complejo',
    badge: 'bg-brand-700',
    hover: 'hover:border-brand-500 hover:bg-brand-50',
  },
]

export default function Dashboard() {
  const { signOut } = useAuth()
  const queryClient = useQueryClient()
  const { data: torneos, isLoading } = useQuery({ queryKey: ['torneos'], queryFn: getTorneos })

  const [nombre, setNombre] = useState('')
  const crear = useMutation({
    mutationFn: () => crearTorneo({ nombre }),
    onSuccess: () => {
      setNombre('')
      queryClient.invalidateQueries({ queryKey: ['torneos'] })
    },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Panel admin</h1>
        <button onClick={() => signOut()} className="text-sm text-gray-500 hover:underline">
          Cerrar sesión
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ACCESOS.map(({ to, Icon, titulo, descripcion, badge, hover }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors ${hover}`}
          >
            <span className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-full text-white ${badge}`}>
              <Icon className="w-5 h-5" />
            </span>
            <span>
              <span className="block font-semibold">{titulo}</span>
              <span className="block text-sm text-gray-500 mt-0.5">{descripcion}</span>
            </span>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Torneos</h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (nombre.trim()) crear.mutate()
        }}
        className="flex gap-2"
      >
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del nuevo torneo"
          className="flex-1 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={crear.isPending}
          className="bg-brand-700 hover:bg-brand-800 text-white rounded px-4 disabled:opacity-50"
        >
          Crear
        </button>
      </form>
      {crear.isError && <p className="text-sm text-red-500">No se pudo crear el torneo.</p>}

      {isLoading && <p className="text-sm text-gray-500">Cargando…</p>}
      <ul className="space-y-2">
        {torneos?.map((t) => {
          const cfg = estadoCfg(t.estado)
          return (
            <li
              key={t.id}
              className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{t.nombre}</p>
                <span className={`inline-block text-xs font-medium rounded-full px-2.5 py-0.5 mt-1 ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
              <Link to={`/admin/torneos/${t.id}`} className="text-sm text-brand-700 font-medium hover:underline">
                Gestionar →
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
