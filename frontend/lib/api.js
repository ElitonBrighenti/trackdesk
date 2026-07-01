const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trackdesk-production.up.railway.app'

export const getTickets = () => fetch(`${API_URL}/api/tickets`).then(r => r.json())

export const criarTicket = (dados) => fetch(`${API_URL}/api/tickets`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dados)
}).then(async r => {
  if (!r.ok) {
    const err = await r.json().catch(() => ({}))
    throw new Error(err.error || 'Erro ao criar chamado')
  }
  return r.json()
})

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

export const getWebhooks = () => fetch(`${API_URL}/api/webhooks`).then(async r => {
  if (!r.ok) {
    throw new Error('Erro ao buscar webhooks')
  }
  return r.json()
})

export const atualizarWebhook = (evento, dados) => fetch(`${API_URL}/api/webhooks/${evento}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dados)
}).then(async r => {
  if (!r.ok) {
    const err = await r.json().catch(() => ({}))
    throw new Error(err.error || 'Erro ao atualizar webhook')
  }
  return r.json()
})

export const testarWebhook = (evento, url) => fetch(`${API_URL}/api/webhooks/${evento}/test`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url })
}).then(r => {
  if (!r.ok) throw new Error('Erro ao disparar teste no destino')
  return r.json()
})

export const getWebhookLogs = (evento) => fetch(`${API_URL}/api/webhooks/${evento}/logs`).then(async r => {
  if (!r.ok) {
    throw new Error('Erro ao buscar logs')
  }
  return r.json()
})

// Perfis / Equipe
export const getProfiles = () => fetch(`${API_URL}/api/profiles`).then(r => r.json())

export const updateRole = (id, role) => fetch(`${API_URL}/api/profiles/${id}/role`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ role })
}).then(async r => {
  if (!r.ok) throw new Error('Erro ao atualizar nível')
  return r.json()
})
