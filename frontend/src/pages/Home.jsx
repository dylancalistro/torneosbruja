import { useQuery } from '@tanstack/react-query'
import { getTorneos } from '../lib/api'
import TorneoCard from '../components/TorneoCard'
import TorneoTablaCard from '../components/TorneoTablaCard'
import InfoComplejo from '../components/InfoComplejo'

export default function Home() {
  const { data: torneos, isLoading, isError } = useQuery({
    queryKey: ['torneos'],
    queryFn: getTorneos,
  })

  const conTabla = torneos?.filter((t) => t.estado === 'activo' || t.estado === 'finalizado') ?? []
  const proximos = torneos?.filter((t) => t.estado === 'proximamente') ?? []

  return (
    <div className="space-y-10">
      <InfoComplejo />

      {isLoading && <p className="text-sm text-gray-500">Cargando torneos…</p>}
      {isError && <p className="text-sm text-red-500">No se pudieron cargar los torneos.</p>}
      {torneos && torneos.length === 0 && (
        <p className="text-sm text-gray-500">Todavía no hay torneos publicados.</p>
      )}

      {conTabla.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Posiciones
          </h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {conTabla.map((torneo) => (
              <TorneoTablaCard key={torneo.id} torneo={torneo} />
            ))}
          </div>
        </section>
      )}

      {proximos.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Próximamente
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {proximos.map((torneo) => (
              <TorneoCard key={torneo.id} torneo={torneo} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
