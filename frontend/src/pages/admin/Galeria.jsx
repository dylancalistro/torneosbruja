import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMedia, urlDeMedia, subirMedia, eliminarMedia } from '../../lib/api'

const CATEGORIAS = [
  { value: 'partido', label: 'Partido' },
  { value: 'cancha', label: 'Cancha' },
  { value: 'general', label: 'General' },
]

export default function Galeria() {
  const queryClient = useQueryClient()
  const { data: items, isLoading } = useQuery({ queryKey: ['media', 'todas'], queryFn: () => getMedia() })
  const fileRef = useRef(null)

  const [categoria, setCategoria] = useState('partido')
  const [titulo, setTitulo] = useState('')

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ['media'] })

  const subir = useMutation({
    mutationFn: (file) => subirMedia({ file, categoria, titulo }),
    onSuccess: () => {
      setTitulo('')
      if (fileRef.current) fileRef.current.value = ''
      invalidar()
    },
  })

  const eliminar = useMutation({
    mutationFn: (item) => eliminarMedia(item),
    onSuccess: invalidar,
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <Link to="/admin" className="text-sm text-gray-500 hover:underline">
        ← Volver
      </Link>
      <h1 className="text-xl font-semibold">Galería</h1>

      <div className="border border-gray-200 rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium">Subir foto</p>
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 bg-white"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[10rem]">
            <label className="block text-xs text-gray-500 mb-1">Título (opcional)</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Archivo</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) subir.mutate(file)
              }}
              disabled={subir.isPending}
              className="text-sm"
            />
          </div>
        </div>
        {subir.isPending && <p className="text-sm text-gray-500">Subiendo…</p>}
        {subir.isError && <p className="text-sm text-red-500">No se pudo subir la foto.</p>}
      </div>

      {isLoading && <p className="text-sm text-gray-500">Cargando…</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items?.map((item) => (
          <div key={item.id} className="relative">
            <img
              src={urlDeMedia(item.storage_path)}
              alt={item.titulo ?? ''}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <span className="absolute top-1 left-1 text-[10px] font-medium bg-black/60 text-white rounded px-1.5 py-0.5">
              {item.categoria}
            </span>
            <button
              onClick={() => eliminar.mutate(item)}
              className="absolute top-1 right-1 text-[10px] font-medium bg-red-600/90 text-white rounded px-1.5 py-0.5"
            >
              Eliminar
            </button>
          </div>
        ))}
        {items?.length === 0 && <p className="text-sm text-gray-400 col-span-full">Sin fotos cargadas.</p>}
      </div>
    </div>
  )
}
