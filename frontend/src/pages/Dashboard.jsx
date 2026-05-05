'use client'

import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import ProtectedRoute from '@/components/ProtectedRoute'

function DashboardContent() {
  const router = useRouter()
  const { user, signOut } = useAuthStore()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>📺 Mi Servicio Técnico</h2>
        </div>
        <div className="nav-user">
          <span>Hola, {user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h1>¡Bienvenido al Sistema de Gestión!</h1>
          <p>Administra tus reparaciones, clientes e inventario desde un solo lugar</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">🔧</div>
            <h3>Reparaciones</h3>
            <p>Gestiona las reparaciones en curso</p>
            <div className="card-stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Activas</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Clientes</h3>
            <p>Administra tu cartera de clientes</p>
            <div className="card-stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Registrados</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📦</div>
            <h3>Inventario</h3>
            <p>Control de piezas y repuestos</p>
            <div className="card-stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Productos</span>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💰</div>
            <h3>Presupuestos</h3>
            <p>Crea y gestiona presupuestos</p>
            <div className="card-stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Pendientes</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>🚀 Próximas Funcionalidades</h2>
          <ul>
            <li>✅ Sistema de autenticación con Supabase</li>
            <li>⏳ CRUD de clientes y reparaciones</li>
            <li>⏳ Gestión de inventario</li>
            <li>⏳ Generación de presupuestos</li>
            <li>⏳ Sistema de citas</li>
            <li>⏳ Reportes y estadísticas</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
