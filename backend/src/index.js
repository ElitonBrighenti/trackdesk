require('dotenv').config()
const express = require('express')
const cors = require('cors')
const ticketsRoutes = require('./routes/tickets')
const colunasRoutes = require('./routes/colunas')

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://trackdesk-front.netlify.app'
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Rotas
app.use('/api/tickets', ticketsRoutes)
app.use('/api/colunas', colunasRoutes)

// Start
app.listen(PORT, () => {
  console.log(`[TrackDesk] Backend rodando na porta ${PORT}`)
})
