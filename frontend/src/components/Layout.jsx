import { Link, NavLink, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getConfiguracion } from '../lib/api'
import { NOMBRE_MARCA, LOGO_URL } from '../lib/marca'
import { PhoneIcon, ChatIcon, MailIcon, InstagramIcon, FacebookIcon, WhatsAppIcon } from './icons'

const CONTACTOS = [
  { key: 'telefono', Icon: PhoneIcon, href: (v) => `tel:${v}` },
  { key: 'whatsapp', Icon: ChatIcon, href: (v) => `https://wa.me/${v.replace(/\D/g, '')}` },
  { key: 'email', Icon: MailIcon, href: (v) => `mailto:${v}` },
  { key: 'instagram', Icon: InstagramIcon, href: (v) => `https://instagram.com/${v.replace('@', '')}` },
  { key: 'facebook', Icon: FacebookIcon, href: (v) => v },
]

const FOOTER_IZQUIERDA = ['Complejo de canchas', 'Eventos', 'Cumpleaños', 'Parrilla']
const FOOTER_DERECHA = ['Torneos de fútbol', 'Premios', 'Reconocimientos']

const NAV_CLS = ({ isActive }) =>
  `text-sm font-medium px-3 py-2 rounded-md transition-colors ${
    isActive ? 'bg-brand-700 text-white' : 'text-gray-600 hover:bg-gray-100'
  }`

export default function Layout() {
  const { data: config } = useQuery({ queryKey: ['configuracion'], queryFn: getConfiguracion })

  const contactosActivos = CONTACTOS.filter(({ key }) => config?.[key])
  const socialesActivos = contactosActivos.filter(({ key }) => key !== 'whatsapp')
  const whatsappUrl = config?.whatsapp ? `https://wa.me/${config.whatsapp.replace(/\D/g, '')}` : null

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
        <div className="max-w-5xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-3 sm:items-start">
          <ul className="space-y-2 text-center sm:text-left order-2 sm:order-1">
            {FOOTER_IZQUIERDA.map((item) => (
              <li key={item} className="text-sm text-gray-600">
                {item}
              </li>
            ))}
          </ul>

          <div className="order-1 sm:order-2 flex flex-col items-center text-center">
            <img src={LOGO_URL} alt={NOMBRE_MARCA} className="w-12 h-12 rounded-md object-contain mb-2" />
            <p className="font-bold text-lg tracking-tight">{NOMBRE_MARCA}</p>

            {socialesActivos.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {socialesActivos.map(({ key, Icon, href }) => (
                  <a
                    key={key}
                    href={href(config[key])}
                    target={key === 'facebook' || key === 'instagram' ? '_blank' : undefined}
                    rel="noreferrer"
                    aria-label={key}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-800 text-white hover:bg-accent-500 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-full px-5 py-2.5 text-sm"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Envianos un mensaje
              </a>
            )}
          </div>

          <ul className="space-y-2 text-center sm:text-right order-3">
            {FOOTER_DERECHA.map((item) =>
              item === 'Torneos de fútbol' ? (
                <li key={item}>
                  <Link to="/torneos" className="text-sm text-gray-600 hover:text-accent-600">
                    {item}
                  </Link>
                </li>
              ) : (
                <li key={item} className="text-sm text-gray-600">
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="border-t border-gray-200 bg-brand-900">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-white/60">
            <span>
              © {new Date().getFullYear()} {NOMBRE_MARCA} — Todos los derechos reservados
            </span>
            <Link to="/admin/login" className="hover:text-white/90 hover:underline">
              Acceso admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
