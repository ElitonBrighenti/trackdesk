'use client'

import { MessageSquare } from 'lucide-react'
import { Draggable } from '@hello-pangea/dnd'

// Helper para calcular tempo relativo
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
  if (p === 'urgente' || p === 'alta') {
    return 'bg-orange-100 text-orange-800'
  }
  if (p === 'média' || p === 'media') {
    return 'bg-purple-100 text-purple-800'
  }
  // Baixa / Normal
  return 'bg-blue-100 text-blue-800'
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

export default function TicketCard({ ticket, index }) {
  const handleCardClick = () => {
    console.log(`[TicketCard] Clicou no ticket ID: ${ticket.id}`)
  }

  return (
    <Draggable draggableId={String(ticket.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleCardClick}
          className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all flex flex-col gap-3 ${
            snapshot.isDragging
              ? 'rotate-2 scale-105 shadow-xl cursor-grabbing z-50'
              : 'hover:shadow-md cursor-grab'
          }`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {/* Header do Card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getPriorityStyles(
                  ticket.prioridade
                )}`}
              >
                {ticket.prioridade || 'Normal'}
              </span>
              <span className="text-xs text-gray-400 font-medium">#TKT-{ticket.id}</span>
            </div>
            <MessageSquare size={14} className="text-gray-300" />
          </div>

          {/* Título */}
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">
            {ticket.titulo}
          </h3>

          {/* Resumo IA */}
          <div className="bg-[#F8FAFC] rounded-lg p-3 mt-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[#8B5CF6] text-xs">✦</span>
              <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">
                Resumo da IA
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
              {ticket.descricao}
            </p>
          </div>

          {/* Footer do Card */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-[10px] font-bold">
                {getInitials(ticket.nome)}
              </div>
              <span className="text-xs font-medium text-gray-700">
                {ticket.nome || 'Usuário'}
              </span>
            </div>
            <span className="text-xs text-gray-400">{getRelativeTime(ticket.created_at)}</span>
          </div>
        </div>
      )}
    </Draggable>
  )
}
