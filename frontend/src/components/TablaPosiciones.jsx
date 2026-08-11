export default function TablaPosiciones({ filas }) {
  if (!filas || filas.length === 0) {
    return <p className="text-sm text-gray-500">Todavía no hay equipos inscriptos en este torneo.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-gray-500">
            <th className="py-2 pr-2">#</th>
            <th className="py-2 pr-2">Equipo</th>
            <th className="py-2 px-2 text-center">PJ</th>
            <th className="py-2 px-2 text-center">PG</th>
            <th className="py-2 px-2 text-center">PE</th>
            <th className="py-2 px-2 text-center">PP</th>
            <th className="py-2 px-2 text-center">GF</th>
            <th className="py-2 px-2 text-center">GC</th>
            <th className="py-2 px-2 text-center">DG</th>
            <th className="py-2 pl-2 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={fila.equipo_id} className="border-b border-gray-100 dark:border-gray-900">
              <td className="py-2 pr-2 text-gray-500">{i + 1}</td>
              <td className="py-2 pr-2 font-medium">{fila.equipo_nombre}</td>
              <td className="py-2 px-2 text-center">{fila.pj}</td>
              <td className="py-2 px-2 text-center">{fila.pg}</td>
              <td className="py-2 px-2 text-center">{fila.pe}</td>
              <td className="py-2 px-2 text-center">{fila.pp}</td>
              <td className="py-2 px-2 text-center">{fila.gf}</td>
              <td className="py-2 px-2 text-center">{fila.gc}</td>
              <td className="py-2 px-2 text-center">{fila.dg}</td>
              <td className="py-2 pl-2 text-center font-semibold">{fila.puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
