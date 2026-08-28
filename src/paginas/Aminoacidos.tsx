import { Link } from 'react-router-dom'
import { aminoacidosClinicos } from '@/dados/aminoacidos'
import { hexagramasDoAminoacido } from '@/lib/genetica'

export default function Aminoacidos() {
  const lista = [...aminoacidosClinicos].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))

  return (
    <div className="px-5 pt-6 md:mx-auto md:max-w-3xl md:px-6 md:pt-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">Aminoácidos</h1>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        Escolha um aminoácido para ver os hexagramas que o codificam e montar o bagua.
      </p>

      {/*
        Mesma separação por fio de cabelo dos protocolos na tela de busca, e pelo mesmo
        motivo: em caixa, a sigla e a contagem de hexagramas não cabiam na largura de um
        iPhone e empurravam a página inteira para o lado. Em linha, com quebra permitida,
        nada é obrigado a ficar na mesma altura.
      */}
      <ul className="mt-4 border-t border-line">
        {lista.map((a) => {
          const total = hexagramasDoAminoacido(a.codigo).length
          return (
            <li key={a.codigo}>
              <Link
                to={`/aminoacido/${a.codigo}`}
                className="block border-b border-line py-4 transition-colors hover:bg-surface-muted active:bg-surface-muted"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-lg font-bold leading-tight text-ink">{a.nome}</h2>

                  <span className="text-[11px] uppercase tracking-[0.08em] text-chip">
                    {a.codigo}
                  </span>

                  <span className="ml-auto shrink-0 text-sm font-semibold tabular-nums text-chip">
                    {total} {total === 1 ? 'hexagrama' : 'hexagramas'}
                  </span>
                </div>

                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  {a.sintomasDeficiencia.join(', ')}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
