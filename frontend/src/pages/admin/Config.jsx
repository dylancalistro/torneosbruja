import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getConfiguracion, actualizarConfiguracion } from '../../lib/api'

const CAMPOS = [
  { key: 'telefono', label: 'Teléfono' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'email', label: 'Email' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'descripcion_general', label: 'Descripción general (se muestra en el inicio)' },
  { key: 'logo_url', label: 'URL del logo' },
]

const INPUT_CLS =
  'w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'

export default function Config() {
  const queryClient = useQueryClient()
  const { data: config, isLoading } = useQuery({ queryKey: ['configuracion'], queryFn: getConfiguracion })
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (config) setForm(config)
  }, [config])

  const guardar = useMutation({
    mutationFn: () =>
      actualizarConfiguracion({
        telefono: form.telefono || null,
        whatsapp: form.whatsapp || null,
        email: form.email || null,
        instagram: form.instagram || null,
        facebook: form.facebook || null,
        direccion: form.direccion || null,
        servicios: form.servicios || null,
        descripcion_general: form.descripcion_general || null,
        logo_url: form.logo_url || null,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['configuracion'] }),
  })

  if (isLoading || !form) return <p className="text-sm text-gray-500">Cargando…</p>

  return (
    <div className="max-w-md space-y-4">
      <Link to="/admin" className="text-sm text-gray-500 hover:underline">
        ← Volver
      </Link>
      <h1 className="text-xl font-semibold">Datos de contacto</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          guardar.mutate()
        }}
        className="space-y-3"
      >
        {CAMPOS.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm text-gray-500 mb-1">{label}</label>
            <input
              value={form[key] ?? ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className={INPUT_CLS}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Servicios (uno por línea, se muestran como lista en el inicio)
          </label>
          <textarea
            rows={3}
            value={form.servicios ?? ''}
            onChange={(e) => setForm({ ...form, servicios: e.target.value })}
            placeholder={'3 Canchas de Fútbol 9\nTorneos, Amistosos y Eventos\nTurnos y Consultas'}
            className={INPUT_CLS}
          />
        </div>

        {guardar.isError && <p className="text-sm text-red-500">No se pudo guardar.</p>}
        {guardar.isSuccess && <p className="text-sm text-green-600">Guardado.</p>}

        <button
          type="submit"
          disabled={guardar.isPending}
          className="bg-brand-700 hover:bg-brand-800 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          Guardar
        </button>
      </form>
    </div>
  )
}
