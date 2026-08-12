import { Link, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getConfiguracion } from '../lib/api'
import { PhoneIcon, ChatIcon, MailIcon, InstagramIcon, FacebookIcon } from './icons'

const CONTACTOS = [
  { key: 'telefono', Icon: PhoneIcon, href: (v) => `tel:${v}` },
  { key: 'whatsapp', Icon: ChatIcon, href: (v) => `https://wa.me/${v.replace(/\D/g, '')}` },
  { key: 'email', Icon: MailIcon, href: (v) => `mailto:${v}` },
  { key: 'instagram', Icon: InstagramIcon, href: (v) => `https://instagram.com/${v.replace('@', '')}` },
  { key: 'facebook', Icon: FacebookIcon, href: (v) => v },
]

export default function Layout() {
  const { data: config } = useQuery({ queryKey: ['configuracion'], queryFn: getConfiguracion })

  const contactosActivos = CONTACTOS.filter(({ key }) => config?.[key])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
              TA
            </span>
            TorneosApp
          </Link>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="font-semibold">TorneosApp</p>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">
              {config?.descripcion_general || 'Organización de torneos de fútbol amateur.'}
            </p>
          </div>

          {contactosActivos.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Contacto</p>
              <ul className="space-y-2">
                {contactosActivos.map(({ key, Icon, href }) => (
                  <li key={key}>
                    <a
                      href={href(config[key])}
                      target={key === 'facebook' || key === 'instagram' || key === 'whatsapp' ? '_blank' : undefined}
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                      <Icon className="w-4 h-4 shrink-0 text-gray-400" />
                      {config[key]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-gray-400">
            <span>© {new Date().getFullYear()} TorneosApp</span>
            <Link to="/admin/login" className="hover:text-gray-600 dark:hover:text-gray-300 hover:underline">
              Acceso admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
