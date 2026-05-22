'use client'

import { useEffect, useState } from 'react'
import { Filter } from 'lucide-react'
import KanbanBoard from '@/components/tickets/KanbanBoard'
import { getColunas, getTickets } from '@/lib/api'

// Helper para pegar iniciais do nome
const getInitials = (name) => {
  if (!name) return 'U'
  const parts = name.split(' ')
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export default function KanbanPage() {
  const [colunas, setColunas] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [colunasData, ticketsData] = await Promise.all([
        getColunas(),
        getTickets()
      ])
      setColunas(colunasData)
      setTickets(ticketsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Extrair responsáveis únicos dos tickets (por nome)
  const uniqueUsers = Array.from(new Set(tickets.filter(t => t.nome).map(t => t.nome)))
  const displayAvatars = uniqueUsers.slice(0, 2)
  const remainingCount = Math.max(0, uniqueUsers.length - 2)

  // Cores dinâmicas para os avatares baseadas no index (Mock simples de variação visual)
  const avatarColors = [
    'bg-blue-100 text-blue-600',
    'bg-orange-100 text-orange-600',
    'bg-green-100 text-green-600',
    'bg-purple-100 text-purple-600'
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header da Página Kanban */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            Quadro Kanban de Chamados
          </h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">
            WORKSPACE: <span className="text-[#1E4FD8]">Suporte (Nível 1)</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Avatares Reais do Workspace (baseado nos tickets) */}
          <div className="flex -space-x-2">
            {!loading && displayAvatars.map((nome, i) => (
              <div 
                key={nome}
                title={nome}
                className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${avatarColors[i % avatarColors.length]} z-[${30 - i * 10}]`}
              >
                {getInitials(nome)}
              </div>
            ))}
            {!loading && remainingCount > 0 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 z-10">
                +{remainingCount}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={16} />
            Filtros
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1">
        <KanbanBoard 
          initialColunas={colunas} 
          initialTickets={tickets} 
          loading={loading} 
          error={error} 
          onRetry={fetchData} 
        />
      </div>
    </div>
  )
}
