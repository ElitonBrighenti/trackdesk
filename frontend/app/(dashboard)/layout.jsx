'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loggedUser = getUser()
    if (!loggedUser) {
      router.push('/login')
    } else {
      setUser(loggedUser)
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return null // Retorna null enquanto verifica a autenticação para evitar flash de tela não autenticada
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <TopBar user={user} />

      {/* Área de conteúdo principal */}
      <main className="ml-[220px] mt-[56px] p-6">
        {children}
      </main>
    </div>
  )
}
