export default function TablaPosicionesCompacta({ filas }) {
  if (!filas || filas.length === 0) {
    return <p className="text-sm text-gray-500 px-4 py-3">Sin equipos inscriptos todavía.</p>
  }

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-gray-400 text-xs uppercase">
          <th className="py-2 pl-4 pr-1 font-medium">#</th>
          <th className="py-2 pr-1 font-medium">Equipo</th>
          <th className="py-2 px-1 text-center font-medium">PJ</th>
          <th className="py-2 px-1 text-center font-medium">DG</th>
          <th className="py-2 pr-4 pl-1 text-center font-medium">Pts</th>
        </tr>
      </thead>
      <tbody>
        {filas.map((fila, i) => (
          <tr key={fila.equipo_id} className="border-b border-gray-100 dark:border-gray-900 last:border-0">
            <td className="py-1.5 pl-4 pr-1 text-gray-400">{i + 1}</td>
            <td className="py-1.5 pr-1 font-medium truncate max-w-[9rem]">{fila.equipo_nombre}</td>
            <td className="py-1.5 px-1 text-center text-gray-500">{fila.pj}</td>
            <td className="py-1.5 px-1 text-center text-gray-500">{fila.dg}</td>
            <td className="py-1.5 pr-4 pl-1 text-center font-semibold">{fila.puntos}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
