import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Torneos from './pages/Torneos'
import TorneoDetalle from './pages/TorneoDetalle'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import TorneoAdmin from './pages/admin/TorneoAdmin'
import Config from './pages/admin/Config'
import Galeria from './pages/admin/Galeria'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="torneos" element={<Torneos />} />
        <Route path="torneos/:id" element={<TorneoDetalle />} />

        <Route path="admin/login" element={<Login />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/torneos/:id"
          element={
            <ProtectedRoute>
              <TorneoAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/config"
          element={
            <ProtectedRoute>
              <Config />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/galeria"
          element={
            <ProtectedRoute>
              <Galeria />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
