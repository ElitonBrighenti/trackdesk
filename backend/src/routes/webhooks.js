const { Router } = require('express')
const webhooksController = require('../controllers/webhooksController')

const router = Router()

router.get('/', webhooksController.listarWebhooks)
router.put('/:evento', webhooksController.atualizarWebhook)
router.post('/:evento/test', webhooksController.testarWebhook)
router.get('/:evento/logs', webhooksController.listarLogs)

module.exports = router
