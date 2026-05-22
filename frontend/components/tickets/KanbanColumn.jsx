'use client'

import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import TicketCard from './TicketCard'
import { atualizarColuna } from '@/lib/api'

export default function KanbanColumn({ coluna, tickets, onColumnUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [nome, setNome] = useState(coluna.nome)
  const [loading, setLoading] = useState(false)

  const handleEditSubmit = async (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter') return
    if (nome.trim() === '' || nome === coluna.nome) {
      setIsEditing(false)
      setNome(coluna.nome)
      return
    }

    setLoading(true)
    try {
      const updated = await atualizarColuna(coluna.id, { nome })
      onColumnUpdate(updated) // Callback para atualizar o estado global
    } catch (err) {
      console.error(err)
      setNome(coluna.nome) // Rollback
    } finally {
      setLoading(false)
      setIsEditing(false)
    }
  }

  return (
    <div className="bg-[#F8F9FA] rounded-xl flex flex-col w-[320px] min-w-[320px] max-h-full border border-gray-100">
      {/* Header */}
      <div className="p-4 flex items-center justify-between group">
        <div className="flex items-center gap-2 flex-1">
          {isEditing ? (
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleEditSubmit}
              autoFocus
              disabled={loading}
              className="text-sm font-bold text-gray-900 bg-white border border-[#1E4FD8] rounded px-2 py-0.5 w-full outline-none"
            />
          ) : (
            <h2
              onClick={() => setIsEditing(true)}
              className="text-sm font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:text-[#1E4FD8] transition-colors"
            >
              {coluna.nome}
            </h2>
          )}
          {!isEditing && (
            <span className="bg-[#E2E8F0] text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {tickets.length}
            </span>
          )}
        </div>

        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Linha separadora superior das colunas (Opcional visual) */}
      {/* (O Figma não mostra linha, o fundo é continuo) */}

      {/* Lista de Tickets (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3 custom-scrollbar">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
        {tickets.length === 0 && (
          <div className="h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-xs text-gray-400 font-medium">Solte cards aqui</span>
          </div>
        )}
      </div>
    </div>
  )
}
