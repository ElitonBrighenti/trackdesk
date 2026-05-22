const { Router } = require('express')
const colunasController = require('../controllers/colunasController')

const router = Router()

// GET /api/colunas — Lista todas as colunas
router.get('/', colunasController.listarColunas)

// POST /api/colunas — Cria coluna
router.post('/', colunasController.criarColuna)

// PATCH /api/colunas/:id — Atualiza coluna
router.patch('/:id', colunasController.atualizarColuna)

// DELETE /api/colunas/:id — Deleta coluna
router.delete('/:id', colunasController.deletarColuna)

module.exports = router
