import { Link, NavLink, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getConfiguracion } from '../lib/api'
import { NOMBRE_MARCA, LOGO_URL } from '../lib/marca'
import { PhoneIcon, ChatIcon, MailIcon, InstagramIcon, FacebookIcon } from './icons'

const CONTACTOS = [
  { key: 'telefono', Icon: PhoneIcon, href: (v) => `tel:${v}` },
  { key: 'whatsapp', Icon: ChatIcon, href: (v) => `https://wa.me/${v.replace(/\D/g, '')}` },
  { key: 'email', Icon: MailIcon, href: (v) => `mailto:${v}` },
  { key: 'instagram', Icon: InstagramIcon, href: (v) => `https://instagram.com/${v.replace('@', '')}` },
  { key: 'facebook', Icon: FacebookIcon, href: (v) => v },
]

const NAV_CLS = ({ isActive }) =>
  `text-sm font-medium px-3 py-2 rounded-md transition-colors ${
    isActive ? 'bg-brand-700 text-white' : 'text-gray-600 hover:bg-gray-100'
  }`

export default function Layout() {
  const { data: config } = useQuery({ queryKey: ['configuracion'], queryFn: getConfiguracion })

  const contactosActivos = CONTACTOS.filter(({ key }) => config?.[key])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <img src={LOGO_URL} alt={NOMBRE_MARCA} className="w-9 h-9 rounded-md object-contain" />
            {NOMBRE_MARCA}
          </Link>
          <div className="flex items-center gap-1">
            <NavLink to="/" end className={NAV_CLS}>
              Inicio
            </NavLink>
            <NavLink to="/torneos" className={NAV_CLS}>
              Torneos
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-brand-50 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2">
          <div className="flex gap-3">
            <img src={LOGO_URL} alt={NOMBRE_MARCA} className="w-10 h-10 rounded-md object-contain shrink-0" />
            <div>
              <p className="font-semibold">{NOMBRE_MARCA}</p>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                {config?.descripcion_general || 'Complejo de fútbol 9, torneos, amistosos y eventos.'}
              </p>
            </div>
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
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-accent-600"
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

        <div className="border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-gray-400">
            <span>
              © {new Date().getFullYear()} {NOMBRE_MARCA}
            </span>
            <Link to="/admin/login" className="hover:text-gray-600 hover:underline">
              Acceso admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
