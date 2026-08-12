import { useQuery } from '@tanstack/react-query'
import { getTorneos, getConfiguracion } from '../lib/api'
import TorneoCard from '../components/TorneoCard'

const GRUPOS = [
  { estado: 'activo', titulo: 'En curso' },
  { estado: 'proximamente', titulo: 'Próximamente' },
  { estado: 'finalizado', titulo: 'Finalizados' },
]

export default function Home() {
  const { data: torneos, isLoading, isError } = useQuery({
    queryKey: ['torneos'],
    queryFn: getTorneos,
  })
  const { data: config } = useQuery({ queryKey: ['configuracion'], queryFn: getConfiguracion })

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Torneos</h1>
        {config?.descripcion_general && (
          <p className="text-gray-500 mt-1">{config.descripcion_general}</p>
        )}
      </section>

      {isLoading && <p className="text-sm text-gray-500">Cargando torneos…</p>}
      {isError && <p className="text-sm text-red-500">No se pudieron cargar los torneos.</p>}
      {torneos && torneos.length === 0 && (
        <p className="text-sm text-gray-500">Todavía no hay torneos publicados.</p>
      )}

      {GRUPOS.map(({ estado, titulo }) => {
        const items = torneos?.filter((t) => t.estado === estado) ?? []
        if (items.length === 0) return null

        return (
          <section key={estado}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">{titulo}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((torneo) => (
                <TorneoCard key={torneo.id} torneo={torneo} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
