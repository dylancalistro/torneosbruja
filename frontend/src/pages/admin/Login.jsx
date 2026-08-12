import { useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useAuth } from '../../lib/AuthContext'

const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY

export default function Login() {
  const { session, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const captchaRef = useRef(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  if (session) {
    const destino = location.state?.from ?? '/admin'
    return <Navigate to={destino} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (HCAPTCHA_SITE_KEY && !captchaToken) {
      setError('Completá el captcha antes de continuar.')
      return
    }

    setLoading(true)
    const { error } = await signIn(email, password, captchaToken ? { captchaToken } : undefined)
    setLoading(false)

    if (error) {
      // Mensaje genérico: no confirmar si el email existe o no (evita enumeración de usuarios).
      setError('Email o contraseña incorrectos.')
      captchaRef.current?.resetCaptcha()
      setCaptchaToken(null)
      return
    }

    navigate('/admin', { replace: true })
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Acceso admin</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-500 mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>

        {HCAPTCHA_SITE_KEY && (
          <HCaptcha
            ref={captchaRef}
            sitekey={HCAPTCHA_SITE_KEY}
            onVerify={setCaptchaToken}
            onExpire={() => setCaptchaToken(null)}
          />
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded px-3 py-2 disabled:opacity-50"
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
