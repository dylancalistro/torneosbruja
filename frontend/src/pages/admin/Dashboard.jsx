import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTorneos, crearTorneo } from '../../lib/api'
import { useAuth } from '../../lib/AuthContext'

const ESTADO_LABEL = {
  proximamente: 'Próximamente',
  activo: 'En curso',
  finalizado: 'Finalizado',
}

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
        <div className="flex flex-wrap gap-4 text-sm">
          <Link to="/admin/galeria" className="hover:underline">
            Galería
          </Link>
          <Link to="/admin/config" className="hover:underline">
            Datos de contacto
          </Link>
          <button onClick={() => signOut()} className="text-gray-500 hover:underline">
            Cerrar sesión
          </button>
        </div>
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
      <ul className="divide-y divide-gray-100 dark:divide-gray-900">
        {torneos?.map((t) => (
          <li key={t.id} className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{t.nombre}</p>
              <p className="text-xs text-gray-500">{ESTADO_LABEL[t.estado] ?? t.estado}</p>
            </div>
            <Link to={`/admin/torneos/${t.id}`} className="text-sm hover:underline">
              Gestionar →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
