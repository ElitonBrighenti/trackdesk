const { Router } = require('express')
const ticketsController = require('../controllers/ticketsController')

const router = Router()

// POST /api/tickets — Cria ticket (chamado pelo n8n)
router.post('/', ticketsController.criarTicket)

// GET /api/tickets — Lista todos os tickets
router.get('/', ticketsController.listarTickets)

// PATCH /api/tickets/:id/status — Atualiza status (Kanban drag)
router.patch('/:id/status', ticketsController.atualizarStatus)

module.exports = router
