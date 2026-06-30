'use client'

import { useEffect, useState } from 'react'
import { Plug, Save, Webhook, Lock } from 'lucide-react'
import { getWebhooks, atualizarWebhook } from '@/lib/api'

export default function IntegracoesPage() {
  const [url, setUrl] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWebhooks().then(data => {
      const resol = data.find(w => w.evento === 'ticket_resolvido')
      if (resol) {
        setUrl(resol.url)
        setAtivo(resol.ativo)
      }
      setLoading(false)
    }).catch(e => {
      console.error(e)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    if (!url.trim()) return
    setSaving(true)
    try {
      await atualizarWebhook('ticket_resolvido', { url, ativo })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-100 rounded-xl">
          <Plug className="text-purple-600" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Integrações</h1>
          <p className="text-gray-500 text-sm mt-1">Conecte o TrackDesk a serviços externos via Webhooks.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Gatilho 1: Ticket Resolvido (Ativo) */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg border border-green-100">
                <Webhook className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ticket Resolvido</h3>
                <p className="text-sm text-gray-500">Disparado sempre que um chamado for movido para a coluna "Resolvido".</p>
              </div>
            </div>
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={ativo} 
                onChange={(e) => setAtivo(e.target.checked)}
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">{ativo ? 'Ativo' : 'Inativo'}</span>
            </label>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <input 
                type="url" 
                placeholder="https://sua-url-do-webhook.com/..." 
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all disabled:bg-gray-50"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
            </div>
            <button 
              onClick={handleSave}
              disabled={saving || loading || !url.trim()}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>

        {/* Gatilho 2: Novo Ticket (Em Breve) */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 opacity-60">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-200 rounded-lg">
                <Lock className="text-gray-500" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-600">Novo Ticket Criado</h3>
                <p className="text-sm text-gray-500">Disparado quando um novo chamado entra no Kanban via API.</p>
              </div>
            </div>
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Em Breve</span>
          </div>
        </div>

        {/* Gatilho 3: Nova Resposta (Em Breve) */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 opacity-60">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-200 rounded-lg">
                <Lock className="text-gray-500" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-600">Nova Resposta do Cliente</h3>
                <p className="text-sm text-gray-500">Disparado quando o cliente enviar uma nova mensagem no WhatsApp.</p>
              </div>
            </div>
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Em Breve</span>
          </div>
        </div>

      </div>
    </div>
  )
}
