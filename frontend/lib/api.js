const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Busca todos os tickets
 * GET /api/tickets
 */
export async function getTickets() {
  // TODO: implementar
}

/**
 * Cria um novo ticket
 * POST /api/tickets
 */
export async function createTicket(data) {
  // TODO: implementar
}

/**
 * Atualiza o status de um ticket (Kanban drag & drop)
 * PATCH /api/tickets/:id/status
 */
export async function updateTicketStatus(id, status) {
  // TODO: implementar
}

/**
 * Health check do backend
 * GET /health
 */
export async function healthCheck() {
  // TODO: implementar
}
