'use client'

import { useEffect, useState } from 'react'
import { Filter, Download } from 'lucide-react'
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

  // Filtros de Data
  const [filterPeriod, setFilterPeriod] = useState('todos') // 'todos', 'hoje', '7d', '30d', 'custom'
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

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
    
    // Escuta evento de novo chamado criado no modal global
    const handleTicketCreated = () => fetchData()
    window.addEventListener('ticket-created', handleTicketCreated)
    
    return () => window.removeEventListener('ticket-created', handleTicketCreated)
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

  // Lógica de Filtro
  const filteredTickets = tickets.filter(t => {
    if (filterPeriod === 'todos') return true
    
    const ticketDate = new Date(t.created_at)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    if (filterPeriod === 'hoje') {
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)
      return ticketDate >= startOfToday && ticketDate <= today
    }
    if (filterPeriod === '7d') {
      const past7 = new Date()
      past7.setDate(today.getDate() - 7)
      past7.setHours(0, 0, 0, 0)
      return ticketDate >= past7 && ticketDate <= today
    }
    if (filterPeriod === '30d') {
      const past30 = new Date()
      past30.setDate(today.getDate() - 30)
      past30.setHours(0, 0, 0, 0)
      return ticketDate >= past30 && ticketDate <= today
    }
    if (filterPeriod === 'custom') {
      if (!customStartDate || !customEndDate) return true
      
      const start = new Date(customStartDate)
      // Resolve fuso horário ao instanciar de YYYY-MM-DD
      start.setHours(0, 0, 0, 0)
      start.setDate(start.getDate() + 1) // Ajuste UTC->Local
      
      const end = new Date(customEndDate)
      end.setHours(23, 59, 59, 999)
      end.setDate(end.getDate() + 1)

      return ticketDate >= start && ticketDate <= end
    }
    return true
  })

  // Exportar para CSV
  const handleExportCSV = () => {
    if (filteredTickets.length === 0) {
      alert('Não há chamados para exportar nesse período.')
      return
    }

    const headers = ['ID', 'Status', 'Prioridade', 'Categoria', 'Cliente', 'Contato', 'Email', 'Data de Criação', 'Título']
    const csvContent = [
      headers.join(','),
      ...filteredTickets.map(t => [
        t.id,
        t.status,
        t.prioridade || 'Normal',
        t.categoria || 'Não classificada',
        `"${(t.nome || '').replace(/"/g, '""')}"`,
        t.contato || '',
        t.email || '',
        new Date(t.created_at).toLocaleString('pt-BR'),
        `"${(t.titulo || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `chamados_${filterPeriod}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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

          <div className="flex items-center gap-3">
            {/* Filtros de Data */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              <div className="flex items-center px-2 text-gray-500">
                <Filter size={16} />
              </div>
              <select 
                className="bg-transparent text-sm text-gray-700 font-medium py-1 pr-4 outline-none border-none cursor-pointer"
                value={filterPeriod}
                onChange={e => setFilterPeriod(e.target.value)}
              >
                <option value="todos">Todos os dias</option>
                <option value="hoje">Hoje</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="custom">Personalizado</option>
              </select>

              {filterPeriod === 'custom' && (
                <div className="flex items-center gap-2 pl-2 border-l border-gray-200 pr-1">
                  <input 
                    type="date" 
                    className="text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none text-gray-600 focus:border-blue-500"
                    value={customStartDate}
                    onChange={e => setCustomStartDate(e.target.value)}
                  />
                  <span className="text-gray-400 text-xs font-medium">até</span>
                  <input 
                    type="date" 
                    className="text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none text-gray-600 focus:border-blue-500"
                    value={customEndDate}
                    onChange={e => setCustomEndDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Exportar */}
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-[#1E4FD8] hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Download size={16} />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1">
        <KanbanBoard 
          initialColunas={colunas} 
          initialTickets={filteredTickets} 
          loading={loading} 
          error={error} 
          onRetry={fetchData} 
        />
      </div>
    </div>
  )
}
