// TODO: Implementar lógica de cada controller

const criarTicket = async (req, res) => {
  // POST /api/tickets — Cria ticket com sessao UUID gerado aqui
  res.status(501).json({ message: 'criarTicket ainda não implementado' })
}

const listarTickets = async (req, res) => {
  // GET /api/tickets — Retorna lista de tickets do Supabase
  res.status(501).json({ message: 'listarTickets ainda não implementado' })
}

const atualizarStatus = async (req, res) => {
  // PATCH /api/tickets/:id/status — Atualiza status do ticket
  res.status(501).json({ message: 'atualizarStatus ainda não implementado' })
}

module.exports = {
  criarTicket,
  listarTickets,
  atualizarStatus,
}
