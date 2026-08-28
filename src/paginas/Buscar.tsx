import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { buscar } from '@/lib/busca'
import { protocolos, sintomasDaCategoria } from '@/dados/protocolos'
import { CATEGORIAS } from '@/dados/categorias'
import LinhaProtocolo from '@/components/LinhaProtocolo'
import Destaques from '@/components/Destaques'
import AvisoSaude from '@/components/AvisoSaude'
import { vibrar } from '@/lib/nativo'

const CHIPS_EM_DESTAQUE = 24

export default function Buscar() {
  // a busca fica na URL para que voltar de um protocolo devolva o mesmo resultado
  const [params, setParams] = useSearchParams()
  const consulta = params.get('q') ?? ''
  const categoria = params.get('cat') ?? ''
  const selecionadas = params.getAll('chave')
  const [verTodas, setVerTodas] = useState(false)

  function atualizar(novaConsulta: string, novasChaves: string[], novaCategoria: string) {
    const proximo = new URLSearchParams()
    if (novaConsulta.trim()) proximo.set('q', novaConsulta)
    if (novaCategoria) proximo.set('cat', novaCategoria)
    for (const chave of novasChaves) proximo.append('chave', chave)
    setParams(proximo, { replace: true })
  }

  function alternarChave(chave: string) {
    void vibrar()
    const proximas = selecionadas.includes(chave)
      ? selecionadas.filter((c) => c !== chave)
      : [...selecionadas, chave]
    atualizar(consulta, proximas, categoria)
  }

  const buscandoTexto = consulta.trim().length > 0 || selecionadas.length > 0
  const filtrando = buscandoTexto || categoria !== ''
  const chaveDasSelecionadas = selecionadas.join('|')

  // o que a busca por texto e sintomas encontrou, antes de aplicar a categoria.
  // "atendidos de total" é o que vira o percentual de combinação em cada cartão.
  const antesDaCategoria = useMemo(() => {
    if (!buscandoTexto) {
      return protocolos.map((protocolo) => ({ protocolo, atendidos: 0, total: 0 }))
    }
    return buscar(consulta, chaveDasSelecionadas ? chaveDasSelecionadas.split('|') : []).map(
      (r) => ({ protocolo: r.protocolo, atendidos: r.termosAtendidos, total: r.totalDeTermos }),
    )
  }, [consulta, chaveDasSelecionadas, buscandoTexto])

  // quantos protocolos cada categoria teria agora — é o que desabilita as vazias
  const quantidadePorCategoria = useMemo(() => {
    const contagem = new Map<string, number>()
    for (const { protocolo } of antesDaCategoria) {
      for (const id of protocolo.categorias) contagem.set(id, (contagem.get(id) ?? 0) + 1)
    }
    return contagem
  }, [antesDaCategoria])

  const resultados = useMemo(
    () =>
      categoria
        ? antesDaCategoria.filter((r) => r.protocolo.categorias.includes(categoria as never))
        : antesDaCategoria,
    [antesDaCategoria, categoria],
  )

  // ao escolher uma categoria, sobram só os sintomas que existem dentro dela
  const sintomasDisponiveis = useMemo(() => {
    const doGrupo = sintomasDaCategoria(categoria)
    // um sintoma já marcado continua à mostra mesmo fora do grupo, para poder desmarcar
    const presentes = new Set(doGrupo.map((s) => s.chave))
    const marcadas = chaveDasSelecionadas ? chaveDasSelecionadas.split('|') : []
    const orfaos = marcadas.filter((c) => !presentes.has(c)).map((chave) => ({ chave, total: 0 }))
    return [...doGrupo, ...orfaos]
  }, [categoria, chaveDasSelecionadas])

  const chavesVisiveis = verTodas
    ? [...sintomasDisponiveis].sort((a, b) => a.chave.localeCompare(b.chave, 'pt-BR'))
    : sintomasDisponiveis.slice(0, CHIPS_EM_DESTAQUE)

  return (
    <>
      <Destaques />

      {/* a folha branca sobe por cima do fim do carrossel, como no app de referência */}
      <div className="relative z-10 -mt-7 mx-auto rounded-t-[28px] bg-surface px-5 pt-7 md:mt-6 md:max-w-3xl md:rounded-none md:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-chip md:text-4xl">
        Como você está se sentindo?
      </h1>
      <p className="mt-1 text-sm text-ink-muted md:text-base">
        Selecione um ou mais sintomas para localizar o protocolo mais indicado.
      </p>

      <div className="relative mt-4 md:mt-6">
        <input
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Ex.: dor no joelho, insônia, ansiedade…"
          value={consulta}
          onChange={(e) => atualizar(e.target.value, selecionadas, categoria)}
          className="w-full rounded-control border border-line bg-surface-muted py-3 pl-10 pr-4 text-base outline-none focus:border-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chip"
        />
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
          🔍
        </span>
      </div>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Categorias</h2>
        <ul className="mt-3 flex flex-wrap gap-2.5">
          {[{ id: '', nome: 'Todas' }, ...CATEGORIAS].map((c) => {
            const ativa = categoria === c.id
            const quantos = c.id ? (quantidadePorCategoria.get(c.id) ?? 0) : antesDaCategoria.length
            // categoria sem nenhum protocolo no filtro atual levaria a uma tela vazia
            const vazia = quantos === 0
            return (
              <li key={c.id || 'todas'}>
                <button
                  type="button"
                  disabled={vazia && !ativa}
                  onClick={() => {
                    void vibrar()
                    atualizar(consulta, selecionadas, c.id)
                  }}
                  aria-pressed={ativa}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    ativa
                      ? 'border-chip bg-chip-suave font-medium text-chip-forte'
                      : vazia
                        ? 'cursor-not-allowed border-chip/30 text-chip/40'
                        : 'border-chip text-chip active:bg-surface-muted'
                  }`}
                >
                  {c.nome}
                  {filtrando && !vazia && (
                    <span className="ml-1.5 text-xs tabular-nums opacity-60">{quantos}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {verTodas ? 'Todos os sintomas' : 'Sintomas relacionados'}
          </h2>
          <button
            type="button"
            onClick={() => setVerTodas(!verTodas)}
            className="text-xs text-chip underline underline-offset-4"
          >
            {verTodas ? 'ver menos' : `ver todos (${sintomasDisponiveis.length})`}
          </button>
        </div>

        <ul className="mt-3 flex flex-wrap gap-2.5">
          {chavesVisiveis.map(({ chave }) => {
            const ativa = selecionadas.includes(chave)
            return (
              <li key={chave}>
                <button
                  type="button"
                  onClick={() => alternarChave(chave)}
                  aria-pressed={ativa}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    ativa
                      ? 'border-chip-forte bg-chip-forte text-white'
                      : 'border-chip bg-surface text-chip active:bg-surface-muted'
                  }`}
                >
                  {chave}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mt-8">
        {/* nada aqui antes de haver busca ou filtro: a tela abre limpa */}
        {!filtrando ? null : resultados.length === 0 ? (
          <div className="rounded-card border border-line bg-surface-muted p-5 text-center">
            <p className="font-medium">Nenhum protocolo encontrado</p>
            {categoria && antesDaCategoria.length > 0 ? (
              <>
                <p className="mt-1 text-sm text-ink-muted">
                  Há {antesDaCategoria.length}{' '}
                  {antesDaCategoria.length === 1 ? 'protocolo' : 'protocolos'} fora desta
                  categoria.
                </p>
                <button
                  type="button"
                  onClick={() => atualizar(consulta, selecionadas, '')}
                  className="mt-3 rounded-control bg-brand-600 px-4 py-2 text-sm font-medium text-white active:bg-brand-700"
                >
                  Ver em todas as categorias
                </button>
              </>
            ) : (
              <p className="mt-1 text-sm text-ink-muted">
                Tente outra palavra — por exemplo o sintoma principal, sozinho.
              </p>
            )}
          </div>
        ) : (
          <>
            {/*
              Cabeçalho dos resultados: à esquerda o rótulo e a contagem, que se leem
              juntos; à direita o botão de limpar, com a mesma pílula dos chips. Ele
              desfaz o que a pessoa acabou de montar, então precisa ser achado de
              relance — como texto sublinhado miúdo, passava despercebido.
            */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex items-baseline gap-2">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Protocolos
                </h2>
                <p className="text-sm text-ink-muted">
                  {resultados.length}{' '}
                  {resultados.length === 1 ? 'protocolo encontrado' : 'protocolos encontrados'}
                </p>
              </div>

              {(selecionadas.length > 0 || categoria) && (
                <button
                  type="button"
                  onClick={() => atualizar(consulta, [], '')}
                  className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-control border border-chip px-3 py-1.5 text-sm font-medium text-chip transition-colors hover:bg-chip-suave active:bg-chip-suave"
                >
                  <span aria-hidden className="text-base leading-none">×</span>
                  Limpar filtros
                </button>
              )}
            </div>

            <ul className="border-t border-line">
              {resultados.map(({ protocolo, atendidos, total }) => (
                <li key={protocolo.numero}>
                  <LinhaProtocolo
                    protocolo={protocolo}
                    combinacao={total > 0 ? { atendidos, total } : undefined}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <AvisoSaude compacto />
            </div>
          </>
        )}
      </section>
      </div>
    </>
  )
}
