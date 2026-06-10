'use client'

import { useState } from 'react'
import { X, User, Mail, Phone, Calendar, Tag, MessageSquare, Send } from 'lucide-react'
import { updateTicketStatus } from '@/lib/api'

// Helper para formatar a data
const formatDate = (dateString) => {
  if (!dateString) return 'Desconhecido'
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Cores baseadas na prioridade
const getPriorityStyles = (prioridade) => {
  const p = prioridade?.toLowerCase()
  if (p === 'urgente') return 'bg-[#FEE2E2] text-[#DC2626]'
  if (p === 'alta') return 'bg-[#FEF3C7] text-[#D97706]'
  if (p === 'média' || p === 'media') return 'bg-[#DBEAFE] text-[#2563EB]'
  return 'bg-[#F3F4F6] text-[#6B7280]'
}

// Cores baseadas no status
const getStatusStyles = (status) => {
  const s = status?.toLowerCase()
  if (s === 'resolvido') return 'bg-[#D1FAE5] text-[#059669]'
  if (s === 'em andamento') return 'bg-[#FEF3C7] text-[#D97706]'
  if (s === 'em análise' || s === 'em analise') return 'bg-[#DBEAFE] text-[#1D4ED8]'
  return 'bg-[#F3F4F6] text-[#6B7280]' // Novo ou Backlog
}

export default function TicketModal({ ticket, colunas, onClose, onTicketUpdate }) {
  const [comentario, setComentario] = useState('')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  if (!ticket) return null

  // Previne clique dentro do modal de propagar para o overlay
  const stopPropagation = (e) => e.stopPropagation()

  const handleStatusChange = async (e) => {
    const novoStatus = e.target.value
    if (novoStatus === ticket.status) return

    setIsUpdatingStatus(true)
    try {
      // 1. Atualiza API
      await updateTicketStatus(ticket.id, novoStatus)
      // 2. Avisa o KanbanBoard para atualizar o state global otimisticamente
      if (onTicketUpdate) {
        onTicketUpdate(ticket.id, novoStatus)
      }
    } catch (err) {
      console.error('Erro ao atualizar status do ticket no modal', err)
      alert('Falha ao atualizar status. Tente novamente.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleComentarioSubmit = () => {
    if (!comentario.trim()) return
    console.log(`[Ticket ${ticket.id}] Novo comentário: ${comentario}`)
    setComentario('')
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Drawer Container */}
      <div 
        className="bg-white shadow-2xl w-full sm:w-[480px] h-full overflow-hidden flex flex-col animate-in slide-in-from-right duration-300"
        onClick={stopPropagation}
      >
        {/* Header do Modal */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                #TKT-{ticket.id}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusStyles(ticket.status)}`}>
                {ticket.status || 'Novo'}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getPriorityStyles(ticket.prioridade)}`}>
                {ticket.prioridade || 'Normal'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {ticket.titulo}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-8">
          
          {/* Informações do Cliente */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 flex items-center gap-1"><User size={12}/> Nome</span>
                <span className="text-sm font-medium text-gray-900">{ticket.nome || 'Não informado'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12}/> Contato</span>
                <span className="text-sm font-medium text-gray-900">{ticket.contato || 'Não informado'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> Email</span>
                <span className="text-sm font-medium text-gray-900 truncate" title={ticket.email}>{ticket.email || 'Não informado'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 flex items-center gap-1"><MessageSquare size={12} className="text-green-500"/> Origem</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{ticket.origem || 'whatsapp'}</span>
              </div>
            </div>
          </section>

          {/* Detalhes do Chamado */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
              Detalhes do Chamado
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 flex items-center gap-1"><Tag size={12}/> Categoria</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{ticket.categoria || 'Não classificada'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Prioridade</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{ticket.prioridade || 'Normal'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Responsável</span>
                <span className="text-sm font-medium text-gray-900">{ticket.responsavel || 'Não atribuído'}</span>
              </div>
              
              {/* Select Status Editável */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">Status</span>
                <select 
                  value={ticket.status || 'Novo'}
                  onChange={handleStatusChange}
                  disabled={isUpdatingStatus}
                  className="text-sm font-medium text-gray-900 border border-gray-200 rounded px-2 py-1 outline-none focus:border-[#1E4FD8] bg-white disabled:opacity-50"
                >
                  {colunas?.map(col => (
                    <option key={col.id} value={col.nome}>{col.nome}</option>
                  ))}
                  {/* Fallback caso as colunas demorem a carregar */}
                  {(!colunas || colunas.length === 0) && (
                    <option value={ticket.status}>{ticket.status || 'Novo'}</option>
                  )}
                </select>
              </div>
            </div>
          </section>

          {/* Resumo da IA */}
          <section>
            <div className="bg-[#F8FAFC] rounded-xl p-4 border border-indigo-50">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[#8B5CF6] text-sm">✦</span>
                <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider">
                  Resumo da IA
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {ticket.descricao || 'Sem descrição fornecida pela IA.'}
              </p>
            </div>
          </section>

          {/* Histórico */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
              Histórico
            </h3>
            <div className="flex gap-3">
              <div className="mt-1 flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-px h-full bg-gray-100 my-1"></div>
              </div>
              <p className="text-sm text-gray-600 pb-4">
                Ticket criado em <span className="font-semibold text-gray-900">{formatDate(ticket.created_at)}</span>
              </p>
            </div>
          </section>
        </div>

        {/* Footer do Modal (Comentário) */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Adicionar comentário..." 
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComentarioSubmit()}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1E4FD8] focus:bg-white transition-colors"
            />
            <button 
              onClick={handleComentarioSubmit}
              className="bg-[#1E4FD8] text-white p-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
