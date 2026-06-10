const request = require('supertest')
const app = require('../index')

describe('Health Check API', () => {
  it('GET /health deve retornar 200 com status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('status', 'ok')
    expect(res.body).toHaveProperty('timestamp')
  })
})
