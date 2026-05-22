'use client'

import { Search, Bell, Clock, HelpCircle } from 'lucide-react'

export default function TopBar({ user }) {
  // Helpers para o fallback de nome e iniciais
  const nome = user?.nome || 'Usuário'
  const cargo = user?.cargo || 'Membro'
  
  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const initials = getInitials(nome)

  return (
    <header className="fixed top-0 left-[220px] right-0 h-[56px] bg-white border-b border-gray-100 flex items-center justify-between px-6 z-30">
      {/* Campo de busca */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar no workspace..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E4FD8]/20 focus:border-[#1E4FD8]/40 transition-all"
          />
        </div>
      </div>

      {/* Ações à direita */}
      <div className="flex items-center gap-2 ml-6">
        {/* Histórico */}
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Clock size={18} />
        </button>

        {/* Notificações */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Ajuda */}
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide ml-1">
          Ajuda
        </span>

        {/* Separador */}
        <div className="w-px h-6 bg-gray-200 mx-2" />

        {/* Avatar + nome */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {nome}
            </p>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide leading-tight">
              {cargo}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E4FD8] to-[#6366F1] flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
