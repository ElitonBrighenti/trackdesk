'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import KanbanColumn from './KanbanColumn'
import { getColunas, getTickets, criarColuna } from '@/lib/api'

export default function KanbanBoard({ initialColunas, initialTickets, loading, error, onRetry }) {
  const [colunas, setColunas] = useState([])
  const [tickets, setTickets] = useState([])

  // Estado para adicionar nova coluna
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnName, setNewColumnName] = useState('')

  // Sincroniza props com o state interno
  useEffect(() => {
    setColunas(initialColunas || [])
    setTickets(initialTickets || [])
  }, [initialColunas, initialTickets])

  const handleColumnUpdate = (updatedColumn) => {
    setColunas((prev) =>
      prev.map((col) => (col.id === updatedColumn.id ? updatedColumn : col))
    )
  }

  const handleAddColumnSubmit = async (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter') return
    if (!newColumnName.trim()) {
      setIsAddingColumn(false)
      return
    }

    try {
      const nextOrder = colunas.length > 0 ? Math.max(...colunas.map(c => c.ordem)) + 1 : 1
      const nova = await criarColuna({ nome: newColumnName, ordem: nextOrder })
      setColunas([...colunas, nova])
    } catch (err) {
      console.error('Erro ao criar coluna:', err)
    } finally {
      setNewColumnName('')
      setIsAddingColumn(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <div className="w-8 h-8 border-4 border-[#1E4FD8]/20 border-t-[#1E4FD8] rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-red-500">
        <p>Erro ao carregar o Kanban: {error}</p>
        <button onClick={onRetry} className="mt-4 text-[#1E4FD8] hover:underline">Tentar novamente</button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6 overflow-x-auto pb-4 custom-scrollbar">
      {/* Colunas Existentes */}
      {colunas.map((coluna) => {
        const columnTickets = tickets.filter((t) => t.status === coluna.nome)
        return (
          <KanbanColumn
            key={coluna.id}
            coluna={coluna}
            tickets={columnTickets}
            onColumnUpdate={handleColumnUpdate}
          />
        )
      })}

      {/* Adicionar Nova Coluna */}
      <div className="w-[320px] min-w-[320px] flex-shrink-0">
        {isAddingColumn ? (
          <div className="bg-[#F8F9FA] rounded-xl p-3 border border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onBlur={handleAddColumnSubmit}
              onKeyDown={handleAddColumnSubmit}
              autoFocus
              placeholder="Nome da coluna"
              className="text-sm font-bold text-gray-900 bg-white border border-[#1E4FD8] rounded px-3 py-2 w-full outline-none"
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAddingColumn(true)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 bg-transparent hover:bg-gray-100 w-full rounded-xl p-4 transition-colors border border-transparent hover:border-gray-200"
          >
            <Plus size={20} />
            <span className="text-sm font-bold tracking-wide">Adicionar Coluna</span>
          </button>
        )}
      </div>
    </div>
  )
}
