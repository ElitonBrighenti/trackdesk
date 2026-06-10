const request = require('supertest')
const app = require('../index')
const supabase = require('../config/supabase')

jest.mock('../config/supabase', () => {
  return {
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis()
  }
})

describe('Colunas API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('GET /api/colunas deve retornar 200 com array', async () => {
    supabase.order.mockResolvedValueOnce({ data: [{ id: 1, nome: 'Backlog' }], error: null })
    
    const res = await request(app).get('/api/colunas')
    
    expect(res.statusCode).toEqual(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /api/colunas com nome e ordem deve retornar 201', async () => {
    supabase.single.mockResolvedValueOnce({ data: { id: 1, nome: 'Backlog', ordem: 0 }, error: null })
    
    const res = await request(app)
      .post('/api/colunas')
      .send({ nome: 'Backlog', ordem: 0 })
      
    expect(res.statusCode).toEqual(201)
  })

  it('PATCH /api/colunas/:id deve retornar 200', async () => {
    supabase.single.mockResolvedValueOnce({ data: { id: 1, nome: 'Novo Nome' }, error: null })
    
    const res = await request(app)
      .patch('/api/colunas/1')
      .send({ nome: 'Novo Nome' })
      
    expect(res.statusCode).toEqual(200)
  })

  it('DELETE /api/colunas/:id sem tickets ativos deve retornar 200', async () => {
    // 1ª chamada: single() retorna a coluna
    supabase.single.mockResolvedValueOnce({ data: { nome: 'Backlog' }, error: null })
    // 2ª chamada: limit() retorna array vazio de tickets
    supabase.limit.mockResolvedValueOnce({ data: [], error: null })
    // 3ª chamada: delete().eq() apenas retorna o chain mockado. Como não tem a prop 'error', simula sucesso.

    const res = await request(app).delete('/api/colunas/1')
    
    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toBe('Coluna deletada com sucesso')
  })
})
