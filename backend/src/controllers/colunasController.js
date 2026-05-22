const supabase = require('../config/supabase')

/**
 * GET /api/colunas
 * Lista todas as colunas ordenadas por campo "ordem" crescente.
 */
const listarColunas = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('colunas')
      .select('*')
      .order('ordem', { ascending: true })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * POST /api/colunas
 * Cria uma nova coluna. Recebe nome, ordem e cor (opcional).
 */
const criarColuna = async (req, res) => {
  try {
    const { nome, ordem, cor } = req.body

    if (!nome || ordem === undefined) {
      return res.status(400).json({ error: 'Campos "nome" e "ordem" são obrigatórios' })
    }

    const coluna = { nome, ordem, cor: cor ?? null }

    const { data, error } = await supabase
      .from('colunas')
      .insert(coluna)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    console.log(`[nova coluna] ${data.id} - ${data.nome}`)
    return res.status(201).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

/**
 * PATCH /api/colunas/:id
 * Atualiza uma coluna. Aceita nome, ordem e cor no body.
 */
const atualizarColuna = async (req, res) => {
  try {
    const { id } = req.params
    const { nome, ordem, cor } = req.body

    const updates = {}
    if (nome !== undefined) updates.nome = nome
    if (ordem !== undefined) updates.ordem = ordem
    if (cor !== undefined) updates.cor = cor

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' })
    }

    const { data, error } = await supabase
      .from('colunas')
      .update(updates)
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

/**
 * DELETE /api/colunas/:id
 * Deleta uma coluna. Verifica se existem tickets com esse status antes.
 */
const deletarColuna = async (req, res) => {
  try {
    const { id } = req.params

    // Buscar o nome da coluna para verificar tickets
    const { data: coluna, error: errColuna } = await supabase
      .from('colunas')
      .select('nome')
      .eq('id', id)
      .single()

    if (errColuna) {
      return res.status(500).json({ error: errColuna.message })
    }

    // Verificar se existem tickets com esse status
    const { data: tickets, error: errTickets } = await supabase
      .from('tickets')
      .select('id')
      .eq('status', coluna.nome)
      .limit(1)

    if (errTickets) {
      return res.status(500).json({ error: errTickets.message })
    }

    if (tickets && tickets.length > 0) {
      return res.status(400).json({
        error: 'Coluna possui tickets ativos',
      })
    }

    // Deletar a coluna
    const { error: errDelete } = await supabase
      .from('colunas')
      .delete()
      .eq('id', id)

    if (errDelete) {
      return res.status(500).json({ error: errDelete.message })
    }

    return res.status(200).json({ message: 'Coluna deletada com sucesso' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = {
  listarColunas,
  criarColuna,
  atualizarColuna,
  deletarColuna,
}
