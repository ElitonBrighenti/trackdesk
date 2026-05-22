import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <TopBar />

      {/* Área de conteúdo principal */}
      <main className="ml-[220px] mt-[56px] p-6">
        {children}
      </main>
    </div>
  )
}
