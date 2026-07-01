const { randomUUID } = require('crypto')
const supabase = require('../config/supabase')

/**
 * POST /api/tickets
 * Cria ticket a partir do payload do n8n.
 * - Gera sessao (UUID) aqui — nunca vem do n8n
 * - Define origem como 'whatsapp'
 * - Ignora campo data_criacao do payload (usa created_at do Supabase)
 */
const criarTicket = async (req, res) => {
  try {
    const payload = req.body

    if (!payload.titulo) {
      return res.status(400).json({ error: 'Campo "titulo" é obrigatório' })
    }

    const ticket = {
      sessao: randomUUID(),
      origem: payload.origem || 'whatsapp',
      titulo: payload.titulo,
      descricao: payload.descricao,
      categoria: payload.categoria,
      prioridade: payload.prioridade,
      status: payload.status ?? 'Novo',
      responsavel: payload.responsavel ?? null,
      nome: payload.nome,
      contato: payload.contato,
      email: payload.email,
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert(ticket)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    console.log(`[novo ticket] ${data.sessao} - ${data.titulo}`)
    return res.status(201).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * GET /api/tickets
 * Lista todos os tickets ordenados por created_at decrescente.
 */
const listarTickets = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * PATCH /api/tickets/:id/status
 * Atualiza o status de um ticket (usado no drag & drop do Kanban).
 */
const atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ error: 'Campo "status" é obrigatório' })
    }

    const { data, error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // Webhook n8n para status Resolvido (disparo síncrono para log e toast)
    let webhookResult = null

    if (status === 'Resolvido') {
      const { data: webhook } = await supabase
        .from('webhooks')
        .select('url, ativo')
        .eq('evento', 'ticket_resolvido')
        .single()

      if (webhook && webhook.ativo && webhook.url) {
        const payload = {
          evento: 'ticket_resolvido',
          ticket: {
            id: data.id,
            sessao: data.sessao,
            origem: data.origem,
            status: data.status,
            titulo: data.titulo,
            descricao: data.descricao,
            prioridade: data.prioridade,
            categoria: data.categoria
          },
          cliente: {
            nome: data.nome,
            telefone: data.contato,
            email: data.email
          }
        }

        let logRecord = {
          evento: 'ticket_resolvido',
          url: webhook.url,
          sucesso: false,
          status_http: null,
          erro: null
        }

        if (typeof fetch !== 'undefined') {
          try {
            const response = await fetch(webhook.url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            })

            logRecord.status_http = response.status
            if (response.ok) {
              logRecord.sucesso = true
              webhookResult = { success: true }
              console.log(`[Webhook] Disparado para n8n: Ticket ${data.id}`)
            } else {
              logRecord.erro = `HTTP ${response.status}`
              webhookResult = { success: false, error: logRecord.erro }
              console.error(`[Webhook Erro] HTTP ${response.status}`)
            }
          } catch (e) {
            logRecord.erro = e.message
            webhookResult = { success: false, error: logRecord.erro }
            console.error(`[Webhook Erro] Falha: ${e.message}`)
          }
          
          await supabase.from('webhook_logs').insert(logRecord)
        }
      }
    }

    return res.status(200).json({ ...data, webhook_result: webhookResult })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * DELETE /api/tickets/:id
 * Exclui um ticket do banco de dados.
 */
const deletarTicket = async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true, message: 'Ticket excluído com sucesso' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = {
  criarTicket,
  listarTickets,
  atualizarStatus,
  deletarTicket
}
