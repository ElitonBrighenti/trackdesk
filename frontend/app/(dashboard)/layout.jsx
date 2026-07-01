'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import NewTicketModal from '@/components/tickets/NewTicketModal'
import { Toaster } from 'react-hot-toast'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const loggedUser = await getUser()
      if (!loggedUser) {
        router.push('/login')
      } else {
        setUser(loggedUser)
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (loading) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Toaster position="bottom-right" />
      <Sidebar />
      <TopBar user={user} />
      <NewTicketModal />

      {/* Área de conteúdo principal */}
      <main className="ml-[220px] mt-[56px] p-6">
        {children}
      </main>
    </div>
  )
}
