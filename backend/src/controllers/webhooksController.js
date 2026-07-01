const supabase = require('../config/supabase')

/**
 * GET /api/webhooks
 * Lista todos os webhooks configurados
 */
const listarWebhooks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data || [])
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * PUT /api/webhooks/:evento
 * Cria ou atualiza a URL e o status (ativo) de um webhook específico.
 */
const atualizarWebhook = async (req, res) => {
  try {
    const { evento } = req.params
    const { url, ativo } = req.body

    const { data, error } = await supabase
      .from('webhooks')
      .upsert(
        { evento, url, ativo },
        { onConflict: 'evento' }
      )
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * POST /api/webhooks/:evento/test
 * Dispara um payload de teste para a URL fornecida (útil para validar antes de salvar).
 */
const testarWebhook = async (req, res) => {
  try {
    const { evento } = req.params
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL é obrigatória para o teste' })
    }

    const payloadMock = {
      evento: evento,
      ticket: {
        id: 9999,
        sessao: '00000000-0000-0000-0000-000000000000',
        origem: 'sistema_teste',
        status: 'Resolvido',
        titulo: 'Chamado de Teste de Integração',
        descricao: 'Este é um payload de teste disparado pelo painel do TrackDesk para validar a conexão.',
        prioridade: 'Média',
        categoria: 'Teste'
      },
      cliente: {
        nome: 'Usuário Teste TrackDesk',
        telefone: '5511900000000',
        email: 'teste@trackdesk.com'
      }
    }

    let logRecord = {
      evento,
      url,
      sucesso: false,
      status_http: null,
      erro: null
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadMock)
      })

      logRecord.status_http = response.status
      if (!response.ok) {
         logRecord.erro = `HTTP ${response.status}`
         await supabase.from('webhook_logs').insert(logRecord)
         return res.status(response.status).json({ error: `Servidor destino retornou HTTP ${response.status}` })
      }

      logRecord.sucesso = true
      await supabase.from('webhook_logs').insert(logRecord)
      return res.status(200).json({ success: true, message: 'Disparo de teste realizado com sucesso' })
    } catch (e) {
      logRecord.erro = e.message
      await supabase.from('webhook_logs').insert(logRecord)
      return res.status(500).json({ error: `Erro de conexão: ${e.message}` })
    }

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * GET /api/webhooks/:evento/logs
 * Retorna os últimos 50 disparos (logs) de um evento.
 */
const listarLogs = async (req, res) => {
  try {
    const { evento } = req.params
    const { data, error } = await supabase
      .from('webhook_logs')
      .select('*')
      .eq('evento', evento)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return res.status(500).json({ error: error.message })
    }
    
    return res.status(200).json(data || [])
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = {
  listarWebhooks,
  atualizarWebhook,
  testarWebhook,
  listarLogs
}
