'use client'

import { useEffect, useState } from 'react'
import { Plug, Save, Webhook, Lock, Play, Activity } from 'lucide-react'
import { getWebhooks, atualizarWebhook, testarWebhook, getWebhookLogs } from '@/lib/api'
import toast from 'react-hot-toast'

export default function IntegracoesPage() {
  const [url, setUrl] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState([])
  const [showLogs, setShowLogs] = useState(false)

  const carregarLogs = async () => {
    try {
      const data = await getWebhookLogs('ticket_resolvido')
      setLogs(data)
    } catch (e) {
      console.error('Erro ao carregar logs', e)
    }
  }

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

    carregarLogs()
  }, [])

  const handleSave = async () => {
    if (!url.trim()) return
    setSaving(true)
    try {
      await atualizarWebhook('ticket_resolvido', { url, ativo })
      toast.success('Configurações salvas!')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    if (!url.trim()) return
    setTesting(true)
    try {
      await testarWebhook('ticket_resolvido', url)
      toast.success('Teste enviado com sucesso!')
      carregarLogs()
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Erro ao testar webhook.')
      carregarLogs()
    } finally {
      setTesting(false)
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

        {/* Logs do Webhook */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div 
            className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setShowLogs(!showLogs)}
          >
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-gray-500" />
              <h3 className="text-sm font-bold text-gray-700">Histórico de Disparos</h3>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {showLogs ? 'Ocultar' : 'Mostrar'} últimos disparos
            </span>
          </div>
          
          {showLogs && (
            <div className="overflow-x-auto max-h-80 custom-scrollbar">
              <table className="w-full text-left text-sm">
                <thead className="bg-white sticky top-0 border-b border-gray-100 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600">Data/Hora</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Erro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-6 text-center text-gray-500">Nenhum disparo registrado ainda.</td>
                    </tr>
                  ) : (
                    logs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${log.sucesso ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {log.sucesso ? 'OK' : 'ERRO'} {log.status_http ? `(${log.status_http})` : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate" title={log.erro}>
                          {log.erro || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
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
