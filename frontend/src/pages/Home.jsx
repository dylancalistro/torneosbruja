import { useQuery } from '@tanstack/react-query'
import { getTorneos, getConfiguracion } from '../lib/api'
import TorneoCard from '../components/TorneoCard'

export default function Home() {
  const { data: torneos, isLoading, isError } = useQuery({
    queryKey: ['torneos'],
    queryFn: getTorneos,
  })
  const { data: config } = useQuery({ queryKey: ['configuracion'], queryFn: getConfiguracion })

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold mb-2">Torneos</h1>
        {config?.descripcion_general && (
          <p className="text-gray-500">{config.descripcion_general}</p>
        )}
      </section>

      <section>
        {isLoading && <p className="text-sm text-gray-500">Cargando torneos…</p>}
        {isError && <p className="text-sm text-red-500">No se pudieron cargar los torneos.</p>}
        {torneos && torneos.length === 0 && (
          <p className="text-sm text-gray-500">Todavía no hay torneos publicados.</p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {torneos?.map((torneo) => (
            <TorneoCard key={torneo.id} torneo={torneo} />
          ))}
        </div>
      </section>
    </div>
  )
}
