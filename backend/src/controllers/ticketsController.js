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
      origem: 'whatsapp',
      titulo: payload.titulo,
      descricao: payload.descricao,
      categoria: payload.categoria,
      prioridade: payload.prioridade,
      status: payload.status ?? 'Backlog',
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

    // Webhook n8n para status Resolvido (disparo assíncrono/fire-and-forget)
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

        if (typeof fetch !== 'undefined') {
          fetch(webhook.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
          .then(() => console.log(`[Webhook] Disparado para n8n: Ticket ${data.id}`))
          .catch(e => console.error(`[Webhook Erro] falha ao enviar pro n8n: ${e.message}`))
        }
      }
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = {
  criarTicket,
  listarTickets,
  atualizarStatus,
}
