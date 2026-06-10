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

describe('Tickets API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('POST /api/tickets com payload válido deve retornar 201 com sessao UUID', async () => {
    supabase.single.mockResolvedValueOnce({ data: { sessao: 'uuid', titulo: 'Test' }, error: null })
    
    const res = await request(app)
      .post('/api/tickets')
      .send({ titulo: 'Test Ticket', descricao: 'Test' })
      
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('sessao')
  })

  it('POST /api/tickets sem titulo deve retornar 400', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .send({ descricao: 'Test' })
      
    expect(res.statusCode).toEqual(400)
  })

  it('GET /api/tickets deve retornar 200 com array', async () => {
    supabase.order.mockResolvedValueOnce({ data: [{ id: 1, titulo: 'A' }], error: null })
    
    const res = await request(app).get('/api/tickets')
    
    expect(res.statusCode).toEqual(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('PATCH /api/tickets/:id/status com status válido deve retornar 200', async () => {
    supabase.single.mockResolvedValueOnce({ data: { id: 1, status: 'Novo' }, error: null })
    
    const res = await request(app)
      .patch('/api/tickets/1/status')
      .send({ status: 'Novo' })
      
    expect(res.statusCode).toEqual(200)
  })

  it('PATCH /api/tickets/:id/status sem status deve retornar 400', async () => {
    const res = await request(app)
      .patch('/api/tickets/1/status')
      .send({})
      
    expect(res.statusCode).toEqual(400)
  })
})
