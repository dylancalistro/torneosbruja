import { useQuery } from '@tanstack/react-query'
import { getMedia, urlDeMedia } from '../lib/api'

export default function GaleriaGrid({ categoria, vacio }) {
  const { data: items, isLoading } = useQuery({
    queryKey: ['media', categoria ?? 'todas'],
    queryFn: () => getMedia(categoria),
  })

  if (isLoading) return <p className="text-sm text-gray-500">Cargando…</p>
  if (!items || items.length === 0) {
    return vacio ? <p className="text-sm text-gray-500">{vacio}</p> : null
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item) => {
        const url = urlDeMedia(item.storage_path)
        return (
          <a
            key={item.id}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="block aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <img
              src={url}
              alt={item.titulo ?? ''}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </a>
        )
      })}
    </div>
  )
}
