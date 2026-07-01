'use client'

import { useState, useEffect } from 'react'
import { X, Send, User, Phone, Mail, Tag, AlertCircle } from 'lucide-react'
import { criarTicket } from '@/lib/api'
import toast from 'react-hot-toast'

export default function NewTicketModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    nome: '',
    contato: '',
    email: '',
    categoria: '',
    prioridade: 'Normal'
  })

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-new-ticket', handleOpen)
    return () => window.removeEventListener('open-new-ticket', handleOpen)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.titulo.trim()) {
      toast.error('O título do chamado é obrigatório.')
      return
    }

    setIsSubmitting(true)
    try {
      await criarTicket({
        ...formData,
        origem: 'manual' // Define origem como manual ao invés de whatsapp
      })
      toast.success('Chamado criado com sucesso!')
      
      // Reseta form e fecha
      setFormData({
        titulo: '', descricao: '', nome: '', contato: '', 
        email: '', categoria: '', prioridade: 'Normal'
      })
      setIsOpen(false)
      
      // Dispara evento para o Kanban atualizar
      window.dispatchEvent(new CustomEvent('ticket-created'))
      
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Erro ao criar o chamado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  // Previne fechar ao clicar dentro do modal
  const stopPropagation = (e) => e.stopPropagation()

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-white shadow-2xl w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 m-4"
        onClick={stopPropagation}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">Novo Chamado</h2>
            <p className="text-sm text-gray-500 mt-1">Crie um chamado manualmente no sistema.</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Form) */}
        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <form id="new-ticket-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Bloco 1: Detalhes principais */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Título do Chamado *</label>
                <input 
                  type="text" 
                  name="titulo"
                  required
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ex: Problema com acesso ao sistema" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#1E4FD8] focus:border-[#1E4FD8] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                <textarea 
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Detalhes do problema ou solicitação..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#1E4FD8] focus:border-[#1E4FD8] outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Bloco 2: Informações do Cliente */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                Dados do Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nome</label>
                  <input 
                    type="text" 
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="João Silva" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4FD8] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Contato (Tel)</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      type="text" 
                      name="contato"
                      value={formData.contato}
                      onChange={handleChange}
                      placeholder="(11) 90000-0000" 
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4FD8] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">E-mail</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-2.5 text-gray-400" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@exemplo.com" 
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4FD8] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Bloco 3: Classificação */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag size={16} className="text-gray-400" />
                Classificação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Categoria</label>
                  <input 
                    type="text" 
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    placeholder="Ex: Financeiro, Suporte Técnico..." 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4FD8] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                    <AlertCircle size={12} className="text-gray-400" />
                    Prioridade
                  </label>
                  <select 
                    name="prioridade"
                    value={formData.prioridade}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1E4FD8] outline-none bg-white"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-5 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="new-ticket-form"
            disabled={isSubmitting || !formData.titulo.trim()}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-[#1E4FD8] hover:bg-[#1a45c0] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            {isSubmitting ? 'Criando...' : 'Criar Chamado'}
          </button>
        </div>
      </div>
    </div>
  )
}
