import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { fichaCompleta } from '@/dados/aminoacidos'
import { BASES, basesDoHexagrama, CONVENCAO_PADRAO } from '@/lib/genetica'
import Hexagrama from '@/components/Hexagrama'
import AvisoSaude from '@/components/AvisoSaude'

export default function Aminoacido() {
  const { codigo } = useParams()
  const navegar = useNavigate()
  const ficha = codigo ? fichaCompleta(codigo) : undefined

  if (!ficha) return <Navigate to="/aminoacidos" replace />

  const coresDe = (linhas: string) =>
    basesDoHexagrama(linhas, CONVENCAO_PADRAO).map((b) => BASES[b].cor)

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-line bg-surface/95 px-3 py-2 backdrop-blur">
        <button
          type="button"
          onClick={() => navegar(-1)}
          className="rounded-lg px-2 py-1 text-sm text-chip active:bg-surface-muted"
        >
          ‹ Voltar
        </button>
        <span className="ml-auto text-xs text-ink-muted">
          {ficha.sigla} · {ficha.essencial === 'Essencial' ? 'essencial' : ficha.essencial.toLowerCase()}
        </span>
      </div>

      <div className="mx-auto px-5 pt-5 md:max-w-3xl md:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{ficha.nome}</h1>
        <p className="mt-1 text-sm text-ink-muted">{ficha.funcoes.join(' · ')}</p>

        <section className="mt-8">
          <h2 className="text-sm font-medium">
            {ficha.hexagramas.length}{' '}
            {ficha.hexagramas.length === 1 ? 'hexagrama codifica' : 'hexagramas codificam'} este
            aminoácido
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {ficha.hexagramas.map((h) => (
              <li key={h.numero} className="rounded-card border border-line p-3">
                <div className="flex items-center justify-center py-1">
                  <Hexagrama
                    linhas={h.linhas}
                    cores={coresDe(h.linhas)}
                    tamanho={84}
                    titulo={`Hexagrama ${h.numero}`}
                  />
                </div>
                <p className="mt-2 text-center text-sm font-medium tabular-nums">{h.codon}</p>
                <p className="text-center text-xs text-ink-muted">
                  nº {h.numero} {h.unicode}
                </p>
                <p className="mt-1 text-center text-[11px] leading-tight text-ink-muted">
                  {basesDoHexagrama(h.linhas).map((b) => BASES[b].elemento).join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-medium">Sintomas de deficiência</h2>
          <ul className="mt-3 flex flex-wrap gap-2.5">
            {ficha.sintomasDeficiencia.map((s) => (
              <li
                key={s}
                className="rounded-full border border-chip px-3 py-1.5 text-sm text-chip"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-medium">Principais fontes alimentares</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{ficha.fontes.join(', ')}</p>
        </section>

        <div className="mt-6">
          <AvisoSaude compacto />
        </div>
      </div>
    </div>
  )
}
