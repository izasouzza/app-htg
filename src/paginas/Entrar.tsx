import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export default function Entrar() {
  const { entrar, cadastrar } = useAuth()
  const navegar = useNavigate()
  const local = useLocation() as { state?: { de?: string } }

  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault()
    setErro(null)
    setAviso(null)
    setEnviando(true)

    const resultado = modo === 'entrar' ? await entrar(email, senha) : await cadastrar(email, senha)
    setEnviando(false)

    if (resultado.erro) {
      setErro(resultado.erro)
      return
    }

    if (modo === 'cadastrar') {
      setAviso('Conta criada. Confirme o e-mail que enviamos para você.')
      return
    }

    navegar(local.state?.de ?? '/', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center bg-surface px-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {modo === 'entrar' ? 'Entrar' : 'Criar conta'}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">Use seu e-mail e uma senha.</p>

      <form onSubmit={enviar} className="mt-6 space-y-3">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-control border border-line bg-surface-muted px-4 py-3 text-base outline-none focus:border-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chip"
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full rounded-control border border-line bg-surface-muted px-4 py-3 text-base outline-none focus:border-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chip"
        />

        {erro && <p className="text-sm text-red-600">{erro}</p>}
        {aviso && <p className="text-sm text-brand-600">{aviso}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-control bg-brand-600 py-3 font-medium text-white active:bg-brand-700 disabled:opacity-60"
        >
          {enviando ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          setModo(modo === 'entrar' ? 'cadastrar' : 'entrar')
          setErro(null)
          setAviso(null)
        }}
        className="mt-5 text-sm text-ink-muted underline underline-offset-4"
      >
        {modo === 'entrar' ? 'Não tenho conta' : 'Já tenho conta'}
      </button>
    </div>
  )
}
