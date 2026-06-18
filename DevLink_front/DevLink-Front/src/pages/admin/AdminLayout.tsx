import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import AdminSidebar from './AdminSidebar'

function AdminLayout() {
  const { isLoggedIn, role } = useAuthStore()

  if (!isLoggedIn || role !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout