import { Link, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getConfiguracion } from '../lib/api'

export default function Layout() {
  const { data: config } = useQuery({ queryKey: ['configuracion'], queryFn: getConfiguracion })

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="font-semibold text-lg">
            {config?.descripcion_general ? 'Torneos' : 'TorneosApp'}
          </Link>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-500 flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {config?.telefono && <span>Tel: {config.telefono}</span>}
            {config?.whatsapp && <span>WhatsApp: {config.whatsapp}</span>}
            {config?.email && <span>{config.email}</span>}
            {config?.instagram && <span>IG: {config.instagram}</span>}
            {config?.facebook && <span>{config.facebook}</span>}
          </div>
          <Link to="/admin/login" className="hover:underline">
            Acceso admin
          </Link>
        </div>
      </footer>
    </div>
  )
}
