import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, supabaseConfigurado } from './supabase'

type AuthContexto = {
  user: User | null
  session: Session | null
  carregando: boolean
  entrar: (email: string, senha: string) => Promise<{ erro: string | null }>
  cadastrar: (email: string, senha: string) => Promise<{ erro: string | null }>
  sair: () => Promise<void>
}

const Contexto = createContext<AuthContexto | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!supabaseConfigurado) {
      setCarregando(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCarregando(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSession(novaSessao)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const valor = useMemo<AuthContexto>(
    () => ({
      user: session?.user ?? null,
      session,
      carregando,
      entrar: async (email, senha) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
        return { erro: error?.message ?? null }
      },
      cadastrar: async (email, senha) => {
        const { error } = await supabase.auth.signUp({ email, password: senha })
        return { erro: error?.message ?? null }
      },
      sair: async () => {
        await supabase.auth.signOut()
      },
    }),
    [session, carregando],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useAuth() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
