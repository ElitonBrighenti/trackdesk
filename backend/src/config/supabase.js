const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('[TrackDesk] SUPABASE_URL e SUPABASE_KEY são obrigatórias no .env')
  process.exit(1)
}

const schema = process.env.NODE_ENV === 'production' ? 'public' : 'development'
const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema } })

console.log(`[TrackDesk] Supabase conectado na schema: ${schema}`)

module.exports = supabase
