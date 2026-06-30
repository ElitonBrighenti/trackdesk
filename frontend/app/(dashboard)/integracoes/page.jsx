'use client'

import { useEffect, useState } from 'react'
import { Plug, Save, Webhook, Lock, Play } from 'lucide-react'
import { getWebhooks, atualizarWebhook, testarWebhook } from '@/lib/api'

export default function IntegracoesPage() {
  const [url, setUrl] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState(null)

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
    setFeedback(null)
    try {
      await atualizarWebhook('ticket_resolvido', { url, ativo })
      setFeedback({ type: 'success', message: 'Configurações salvas!' })
    } catch (err) {
      console.error(err)
      setFeedback({ type: 'error', message: 'Erro ao salvar.' })
    } finally {
      setSaving(false)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const handleTest = async () => {
    if (!url.trim()) return
    setTesting(true)
    setFeedback(null)
    try {
      await testarWebhook('ticket_resolvido', url)
      setFeedback({ type: 'success', message: 'Teste enviado com sucesso!' })
    } catch (err) {
      console.error(err)
      setFeedback({ type: 'error', message: 'Erro ao conectar com a URL.' })
    } finally {
      setTesting(false)
      setTimeout(() => setFeedback(null), 4000)
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

      {feedback && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {feedback.message}
        </div>
      )}

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
              onClick={handleTest}
              disabled={testing || loading || !url.trim()}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
            >
              <Play size={16} className={testing ? "animate-pulse" : ""} />
              {testing ? 'Testando...' : 'Testar'}
            </button>

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
