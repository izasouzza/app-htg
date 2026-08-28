import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { protocolos } from '@/dados/protocolos'

export default function Indice() {
  // agrupa em ordem alfabética, como o sumário do livro
  const grupos = useMemo(() => {
    const ordenados = [...protocolos].sort((a, b) =>
      a.titulo.localeCompare(b.titulo, 'pt-BR'),
    )
    const mapa = new Map<string, typeof protocolos>()
    for (const p of ordenados) {
      const letra = p.titulo
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')[0]
        .toUpperCase()
      mapa.set(letra, [...(mapa.get(letra) ?? []), p])
    }
    return [...mapa.entries()]
  }, [])

  return (
    <div className="px-5 pt-6 md:px-6 md:pt-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">Índice</h1>
      <p className="mt-1 text-sm text-ink-muted">Os protocolos estão ordenados em ordem alfabética.</p>

      <div className="md:columns-2 lg:columns-3 md:gap-x-8">
      {grupos.map(([letra, itens]) => (
        <section key={letra} className="mt-5 break-inside-avoid">
          <h2 className="sticky top-0 bg-surface py-1 text-xl font-bold text-chip md:static">
            {letra}
          </h2>
          <ul className="divide-y divide-line border-y border-line">
            {itens.map((p) => (
              <li key={p.numero}>
                <Link
                  to={`/protocolo/${p.numero}`}
                  className="flex items-center gap-3 py-3 active:bg-surface-muted"
                >
                  <span className="flex-1 text-ink">
                    {p.titulo}
                    {p.complemento && (
                      <span className="text-sm text-ink-muted"> ({p.complemento})</span>
                    )}
                  </span>
                  <span className="text-ink-muted">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      </div>
    </div>
  )
}
