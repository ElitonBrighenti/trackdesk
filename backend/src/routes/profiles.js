const { Router } = require('express')
const { listarPerfis, atualizarRole } = require('../controllers/profilesController')

const router = Router()

router.get('/', listarPerfis)
router.patch('/:id/role', atualizarRole)

module.exports = router
