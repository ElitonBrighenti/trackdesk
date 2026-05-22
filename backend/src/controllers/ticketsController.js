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
