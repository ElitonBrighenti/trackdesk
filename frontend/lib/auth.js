import { supabase } from './supabase'

export const signInWithEmail = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

export const signUp = (email, password) =>
  supabase.auth.signUp({ email, password })

export const logout = () => supabase.auth.signOut()

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Busca o profile para pegar a role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return {
    ...user,
    role: profile?.role || 'membro'
  }
}
