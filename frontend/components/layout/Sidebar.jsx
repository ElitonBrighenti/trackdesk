'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Ticket,
  Kanban,
  Plug,
  BookOpen,
  Settings,
  HelpCircle,
  Plus,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chamados', label: 'Chamados', icon: Ticket },
  { href: '/kanban', label: 'Kanban', icon: Kanban },
  { href: '/integracoes', label: 'Integrações', icon: Plug },
  { href: '/base-conhecimento', label: 'Base de Conhecimento', icon: BookOpen },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#1E4FD8] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">A</span>
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-gray-900 leading-tight">
              TrackDesk
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider leading-tight">
              Motor de Helpdesk
            </p>
          </div>
        </div>
      </div>

      {/* Botão Novo Chamado */}
      <div className="px-4 pb-4">
        <button
          className="w-full flex items-center justify-center gap-2 bg-[#1E4FD8] hover:bg-[#1a45c0] text-white text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          Novo Chamado
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#DBEAFE] text-[#1E4FD8] border-l-[3px] border-[#1E4FD8] pl-[9px]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Rodapé — Suporte */}
      <div className="px-3 pb-5 pt-2">
        <Link
          href="/suporte"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <HelpCircle size={18} strokeWidth={1.8} />
          Suporte
        </Link>
      </div>
    </aside>
  )
}
