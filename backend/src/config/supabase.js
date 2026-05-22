const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('[TrackDesk] SUPABASE_URL e SUPABASE_KEY são obrigatórias no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('[TrackDesk] Supabase conectado na schema: public')

module.exports = supabase

