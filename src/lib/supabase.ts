import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * `false` enquanto as chaves do Supabase não estiverem no .env.local.
 * As telas usam isso para funcionar em modo de demonstração em vez de quebrar.
 */
export const supabaseConfigurado = Boolean(url && anonKey)

export const supabase = createClient(url ?? 'http://localhost', anonKey ?? 'chave-ausente', {
  auth: {
    // mantém o usuário logado entre aberturas do app (web e celular)
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
