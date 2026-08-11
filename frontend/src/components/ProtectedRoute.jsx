import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="p-8 text-center">Cargando…</p>
  if (!session) return <Navigate to="/admin/login" replace />

  return children
}
