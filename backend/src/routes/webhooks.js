const { Router } = require('express')
const webhooksController = require('../controllers/webhooksController')

const router = Router()

router.get('/', webhooksController.listarWebhooks)
router.put('/:evento', webhooksController.atualizarWebhook)

module.exports = router
