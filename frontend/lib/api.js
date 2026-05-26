const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trackdesk-production.up.railway.app'

export const getTickets = () => fetch(`${API_URL}/api/tickets`).then(r => r.json())

export const getColunas = () => fetch(`${API_URL}/api/colunas`).then(r => r.json())

export const updateTicketStatus = (id, status) => fetch(`${API_URL}/api/tickets/${id}/status`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status })
}).then(r => r.json())

export const criarColuna = (dados) => fetch(`${API_URL}/api/colunas`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dados)
}).then(r => r.json())

export const atualizarColuna = (id, dados) => fetch(`${API_URL}/api/colunas/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dados)
}).then(r => r.json())

export const deletarColuna = (id) => fetch(`${API_URL}/api/colunas/${id}`, {
  method: 'DELETE'
}).then(r => r.json())
