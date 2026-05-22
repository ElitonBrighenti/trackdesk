const API_URL = 'http://localhost:3001/api'

// --- TICKETS ---

export const getTickets = async () => {
  const res = await fetch(`${API_URL}/tickets`)
  if (!res.ok) throw new Error('Falha ao carregar tickets')
  return res.json()
}

export const updateTicketStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/tickets/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
  if (!res.ok) throw new Error('Falha ao atualizar status do ticket')
  return res.json()
}

// --- COLUNAS ---

export const getColunas = async () => {
  const res = await fetch(`${API_URL}/colunas`)
  if (!res.ok) throw new Error('Falha ao carregar colunas')
  return res.json()
}

export const criarColuna = async (dados) => {
  const res = await fetch(`${API_URL}/colunas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  if (!res.ok) throw new Error('Falha ao criar coluna')
  return res.json()
}

export const atualizarColuna = async (id, dados) => {
  const res = await fetch(`${API_URL}/colunas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  if (!res.ok) throw new Error('Falha ao atualizar coluna')
  return res.json()
}

export const deletarColuna = async (id) => {
  const res = await fetch(`${API_URL}/colunas/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error || 'Falha ao deletar coluna')
  }
  return res.json()
}
