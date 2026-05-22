require('dotenv').config()
const express = require('express')
const cors = require('cors')
const ticketsRoutes = require('./routes/tickets')

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Rotas
app.use('/api/tickets', ticketsRoutes)

// Start
app.listen(PORT, () => {
  console.log(`[TrackDesk] Backend rodando na porta ${PORT}`)
})
