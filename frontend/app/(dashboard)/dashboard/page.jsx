'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Bot, Clock, MessageSquare } from 'lucide-react'
import { getTickets } from '@/lib/api'

// Helper para tempo relativo
const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  const diff = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `há ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  return `há ${days}d`
}

// Cores baseadas na prioridade
const getPriorityStyles = (prioridade) => {
  const p = prioridade?.toLowerCase()
  if (p === 'urgente') {
    return 'bg-[#FEE2E2] text-[#DC2626]'
  }
  if (p === 'alta') {
    return 'bg-[#FEF3C7] text-[#D97706]'
  }
  if (p === 'média' || p === 'media') {
    return 'bg-[#DBEAFE] text-[#2563EB]'
  }
  return 'bg-[#F3F4F6] text-[#6B7280]'
}

// Helper para pegar as iniciais do nome
const getInitials = (name) => {
  if (!name) return 'U'
  const parts = name.split(' ')
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getTickets()
        setTickets(data || [])
      } catch (error) {
        console.error("Erro ao carregar tickets", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // --- CÁLCULOS DOS DADOS REAIS ---
  
  // 1. Chamados Hoje (compara o dia)
  const todayStr = new Date().toISOString().split('T')[0]
  const chamadosHojeCount = tickets.filter(t => t.created_at?.startsWith(todayStr)).length

  // 2. Resolvidos por IA (Status = Resolvido)
  const resolvidosCount = tickets.filter(t => t.status === 'Resolvido').length
  const resolvidosPct = tickets.length > 0 ? Math.round((resolvidosCount / tickets.length) * 100) : 0

  // 3. Gráfico de Barras por Dia da Semana
  // Agrupar tickets por dia da semana (0 = Dom, 1 = Seg ... 6 = Sab)
  const chartData = [0, 0, 0, 0, 0, 0, 0] // Dom a Sab
  tickets.forEach(t => {
    if (t.created_at) {
      const day = new Date(t.created_at).getDay()
      chartData[day]++
    }
  })
  // Reordenar para Seg a Dom para exibição
  const displayChartData = [
    chartData[1], // Seg
    chartData[2], // Ter
    chartData[3], // Qua
    chartData[4], // Qui
    chartData[5], // Sex
    chartData[6], // Sáb
    chartData[0]  // Dom
  ]
  const maxChartVal = Math.max(...displayChartData, 1) // evitar div por 0

  // 4. Feed WhatsApp ao Vivo (5 mais recentes)
  const feedTickets = [...tickets]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <div className="w-8 h-8 border-4 border-[#1E4FD8]/20 border-t-[#1E4FD8] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Visão Geral</h1>
          <p className="text-sm text-gray-500 mt-1">
            Performance em tempo real e fluxo de chamados ativos.
          </p>
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Chamados Hoje */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-[#1E4FD8]" />
            </div>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            Chamados Hoje
          </p>
          <p className="text-3xl font-bold text-gray-900">{chamadosHojeCount}</p>
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1E4FD8] rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Resolvidos por IA */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#EDE9FE] rounded-lg flex items-center justify-center">
              <Bot size={20} className="text-[#7C3AED]" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Otimizado
            </span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            Resolvidos por IA
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-gray-900">{resolvidosCount}</p>
            <span className="text-sm text-gray-400">/ {resolvidosPct}%</span>
          </div>
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-[#7C3AED] rounded-full" style={{ width: `${resolvidosPct}%` }} />
          </div>
        </div>

        {/* Tempo Médio de Resposta (Fixo por enquanto conforme pedido) */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-[#DC2626]" />
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              Melhoria de -6m
            </span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            Tempo Médio de Resposta
          </p>
          <p className="text-3xl font-bold text-gray-900">18m</p>
          <p className="text-xs text-gray-400 mt-1">Meta padrão: 25m</p>
        </div>
      </div>

      {/* Grid Principal Inferior: Gráfico + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Gráfico */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-base font-semibold text-gray-900">
              Tendências de Volume de Chamados
            </h2>
          </div>
          
          <div className="flex items-end gap-3 h-48 mt-4">
            {displayChartData.map((h, i) => {
              // Calcular altura proporcional ao maior valor (max height = 100%)
              const heightPct = Math.round((h / maxChartVal) * 100) || 5; 
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full bg-[#1E4FD8]/80 rounded-t-md transition-all hover:bg-[#1E4FD8] min-h-[4px]"
                    style={{ height: `${heightPct}%` }}
                    title={`${h} chamados`}
                  />
                  <span className="text-[10px] text-gray-400 uppercase">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Feed WhatsApp ao Vivo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-green-500" />
              <h2 className="text-base font-semibold text-gray-900">WhatsApp ao Vivo</h2>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          
          <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar" style={{ maxHeight: '320px' }}>
            {feedTickets.length === 0 && (
              <p className="text-sm text-gray-400 text-center mt-4">Nenhum chamado ativo.</p>
            )}
            {feedTickets.map(tkt => (
              <div key={tkt.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    #TKT-{tkt.id}
                  </span>
                  <span className="text-[10px] text-gray-400">{getRelativeTime(tkt.created_at)}</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-2 truncate">
                  {tkt.titulo}
                </h4>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-[9px] font-bold">
                      {getInitials(tkt.nome)}
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 truncate max-w-[100px]">
                      {tkt.nome || 'Cliente'}
                    </span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${getPriorityStyles(tkt.prioridade)}`}>
                    {tkt.prioridade || 'Normal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
