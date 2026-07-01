const supabase = require('../config/supabase')

const listarPerfis = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

const atualizarRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!['admin', 'gestor', 'membro'].includes(role)) {
      return res.status(400).json({ error: 'Role inválida' })
    }

    // Como o backend usa a service_role key, ele burla o RLS e atualiza com sucesso.
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = { listarPerfis, atualizarRole }
