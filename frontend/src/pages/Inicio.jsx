import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getConfiguracion } from '../lib/api'
import { NOMBRE_MARCA } from '../lib/marca'
import { IMG_HERO, IMG_CANCHA, IMG_CUMPLE, VIDEO_CANCHA, VIDEO_NAVARRO, VIDEO_TROGLIO } from '../lib/assets'
import { ChatIcon } from '../components/icons'
import GaleriaGrid from '../components/GaleriaGrid'

export default function Inicio() {
  const { data: config } = useQuery({ queryKey: ['configuracion'], queryFn: getConfiguracion })

  const servicios = (config?.servicios ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  const whatsappUrl = config?.whatsapp ? `https://wa.me/${config.whatsapp.replace(/\D/g, '')}` : null

  return (
    <div>
      <section className="relative bg-cover bg-center" style={{ backgroundImage: `url(${IMG_HERO})` }}>
        <div className="absolute inset-0 bg-brand-900/70" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-4 py-24 sm:py-32 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{NOMBRE_MARCA}</h1>
          <p className="mt-3 text-lg text-white/90 max-w-xl mx-auto">
            {config?.descripcion_general || 'Fútbol 9, torneos, amistosos y eventos en La Plata.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/torneos"
              className="bg-white text-brand-800 font-semibold rounded-full px-6 py-3 hover:bg-gray-100"
            >
              Ver torneos
            </Link>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-full px-6 py-3"
              >
                <ChatIcon className="w-5 h-5" /> Consultanos
              </a>
            )}
          </div>
        </div>
      </section>

      {servicios.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-center mb-8">Lo que ofrecemos</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {servicios.map((s) => (
              <div key={s} className="text-center border border-gray-200 rounded-xl p-6">
                <span className="w-3 h-3 rounded-full bg-accent-500 inline-block mb-3" aria-hidden="true" />
                <p className="font-medium">{s}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-gray-50 py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Conocé el complejo</h2>
          <div className="grid gap-4 sm:grid-cols-2 items-center">
            <img
              src={IMG_CANCHA}
              alt="Cancha de Complejo 35"
              className="w-full h-64 sm:h-80 object-cover rounded-xl"
            />
            <video
              src={VIDEO_CANCHA}
              controls
              preload="metadata"
              className="w-full h-64 sm:h-80 object-cover rounded-xl bg-black"
            />
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-center mb-2">Galería</h2>
        <p className="text-center text-gray-500 mb-8">Fotos de partidos y jornadas en el complejo</p>
        <GaleriaGrid categoria="partido" vacio="Todavía no hay fotos cargadas." />
      </section>

      <section className="bg-gray-50 py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2">Nos recomiendan</h2>
          <p className="text-center text-gray-500 mb-8">Ex jugadores que ya nos visitaron</p>
          <div className="flex flex-wrap justify-center gap-4">
            <video
              src={VIDEO_NAVARRO}
              controls
              preload="metadata"
              className="w-full max-w-xs sm:max-w-sm aspect-video object-cover rounded-xl bg-black"
            />
            <video
              src={VIDEO_TROGLIO}
              controls
              preload="metadata"
              className="w-full max-w-xs sm:max-w-sm aspect-video object-cover rounded-xl bg-black"
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-700 py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Festejá tu cumpleaños en {NOMBRE_MARCA}</h2>
          <img
            src={IMG_CUMPLE}
            alt="Festejá tu cumpleaños en Complejo 35"
            className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
          />
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-full px-6 py-3"
            >
              <ChatIcon className="w-5 h-5" /> Consultar por WhatsApp
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
