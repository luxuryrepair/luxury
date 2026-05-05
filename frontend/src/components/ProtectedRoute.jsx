'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useAuthStore from '@/store/authStore'

export default function ProtectedRoute({ children }) {
  const { user, loading, initialize } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  if (!user) return null

  return children
}
