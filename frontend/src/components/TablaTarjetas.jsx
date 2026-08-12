export default function TablaTarjetas({ filas }) {
  if (!filas || filas.length === 0) {
    return <p className="text-sm text-gray-500">Todavía no hay tarjetas cargadas en este torneo.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[360px] text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-gray-500">
            <th className="py-2 pr-2">Jugador</th>
            <th className="py-2 pr-2">Equipo</th>
            <th className="py-2 px-2 text-center">🟨</th>
            <th className="py-2 pl-2 text-center">🟥</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={`${fila.jugador_id}`} className="border-b border-gray-100 dark:border-gray-900">
              <td className="py-2 pr-2 font-medium">{fila.jugador_nombre}</td>
              <td className="py-2 pr-2 text-gray-500">{fila.equipo_nombre}</td>
              <td className="py-2 px-2 text-center">{fila.amarillas}</td>
              <td className="py-2 pl-2 text-center">{fila.rojas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
