'use client'

import { BarChart3, Bot, Clock } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Visão Geral</h1>
        <p className="text-sm text-gray-500 mt-1">
          Performance em tempo real e fluxo de chamados ativos.
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Chamados Hoje */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#DBEAFE] rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-[#1E4FD8]" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              +12% vs ontem
            </span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            Chamados Hoje
          </p>
          <p className="text-3xl font-bold text-gray-900">142</p>
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1E4FD8] rounded-full" style={{ width: '72%' }} />
          </div>
        </div>

        {/* Resolvidos por IA */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#EDE9FE] rounded-lg flex items-center justify-center">
              <Bot size={20} className="text-[#7C3AED]" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Otimizado
            </span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">
            Resolvidos por IA
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-gray-900">84</p>
            <span className="text-sm text-gray-400">/ 59%</span>
          </div>
          <div className="mt-3 flex gap-1">
            {[60, 45, 80, 55, 70, 90, 65].map((h, i) => (
              <div key={i} className="flex-1 bg-[#EDE9FE] rounded-sm" style={{ height: `${h / 5}px` }} />
            ))}
          </div>
        </div>

        {/* Tempo Médio de Resposta */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-[#DC2626]" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
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

      {/* Placeholder para gráficos futuros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Tendências de Volume de Chamados
        </h2>
        <div className="flex items-end gap-3 h-48">
          {[65, 45, 80, 70, 55, 90, 40].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-[#1E4FD8]/80 rounded-t-md transition-all hover:bg-[#1E4FD8]"
                style={{ height: `${h * 1.8}px` }}
              />
              <span className="text-[10px] text-gray-400 uppercase">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
