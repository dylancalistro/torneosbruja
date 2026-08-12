export default function TablaSuspendidos({ filas }) {
  if (!filas || filas.length === 0) {
    return <p className="text-sm text-gray-500">No hay jugadores suspendidos en este torneo.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-gray-500">
            <th className="py-2 pr-2">Jugador</th>
            <th className="py-2 pr-2">Equipo</th>
            <th className="py-2 pr-2">Motivo</th>
            <th className="py-2 pl-2 text-center">Restan / Total</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((s) => (
            <tr key={s.id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="py-2 pr-2 font-medium">{s.jugador?.nombre}</td>
              <td className="py-2 pr-2 text-gray-500">{s.equipo?.nombre}</td>
              <td className="py-2 pr-2 text-gray-500">{s.motivo || '—'}</td>
              <td className="py-2 pl-2 text-center font-semibold">
                {s.partidos_restantes} / {s.partidos_totales}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
