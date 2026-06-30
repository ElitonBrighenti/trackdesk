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

module.exports = {
  listarWebhooks,
  atualizarWebhook
}
