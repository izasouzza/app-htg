import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { protocoloPorNumero, protocolos } from '@/dados/protocolos'
import { nomeDaCategoria } from '@/dados/categorias'
import {
  ehCentroDePontos,
  resolverComposicao,
  sequenciaDeAminoacidos,
  trigramasDaComposicao,
} from '@/lib/composicao'
import { AMINOACIDO_POR_CODIGO } from '@/lib/genetica'
import { derivadosPresentes } from '@/dados/derivados'
import DesenhoProtocolo from '@/components/DesenhoProtocolo'
import AvisoSaude from '@/components/AvisoSaude'

export default function Protocolo() {
  const { numero } = useParams()
  const navegar = useNavigate()
  const protocolo = protocoloPorNumero(Number(numero))

  if (!protocolo) return <Navigate to="/" replace />

  const anterior = protocolos.find((p) => p.numero === protocolo.numero - 1)
  const proximo = protocolos.find((p) => p.numero === protocolo.numero + 1)
  const bagua = protocolo.composicao ? resolverComposicao(protocolo.composicao) : undefined
  // na ordem do desenho: centro, depois o anel do norte em diante, no horário
  const aminoacidos = bagua ? sequenciaDeAminoacidos(bagua) : []
  // quando o centro é de pontos, não há aminoácido ali: abre a assinatura como "Centro"
  const centrosDePontos =
    bagua?.arranjo === 'bagua'
      ? bagua.rosetas.map((r) => r.centro).filter(ehCentroDePontos)
      : []
  // trigrama também não tem aminoácido: entra na assinatura pelo nome
  const trigramas = bagua ? trigramasDaComposicao(bagua) : []
  // dois baguás empilhados ocupam o dobro da altura no papel; o CSS de impressão usa isto
  const duasRosetas = bagua?.arranjo === 'bagua' && bagua.rosetas.length > 1
  const derivados = derivadosPresentes(aminoacidos.map((a) => a.codigo))

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-line bg-surface/95 px-3 py-2 backdrop-blur md:static md:mx-auto md:max-w-4xl md:border-0 md:px-6 md:pt-8">
        <button
          type="button"
          onClick={() => navegar(-1)}
          className="rounded-lg px-2 py-1 text-sm text-chip hover:bg-surface-muted active:bg-surface-muted"
        >
          ‹ Voltar
        </button>
      </div>

      {/*
        No celular tudo empilha na ordem do DOM.
        No desktop viram duas colunas: o desenho à esquerda, acompanhando a rolagem,
        e o texto à direita — por isso as posições de grade são explícitas.
      */}
      <div className="px-5 pt-5 md:mx-auto md:grid md:max-w-4xl md:grid-cols-[340px_minmax(0,1fr)] md:items-start md:gap-x-10 md:px-6 md:pt-4">
        <div className="md:col-start-2 md:row-start-1">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-ink md:text-3xl">
            {protocolo.titulo}
          </h1>
          {protocolo.complemento && (
            <p className="mt-0.5 text-sm text-ink-muted">{protocolo.complemento}</p>
          )}

          <p className="mt-2 leading-relaxed text-ink-muted">
            Indicado para {protocolo.indicacao}.
          </p>

          {protocolo.descricao && (
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{protocolo.descricao}</p>
          )}

          {protocolo.categorias.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {protocolo.categorias.map((id) => (
                <li key={id}>
                  <Link
                    to={`/?cat=${id}`}
                    className="inline-block rounded-full border border-chip px-3 py-1 text-xs text-chip hover:bg-surface-muted active:bg-surface-muted"
                  >
                    {nomeDaCategoria(id)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <figure className="mt-4 md:col-start-1 md:row-span-2 md:row-start-1 md:sticky md:top-24 md:mt-0">
          {bagua && (
            <h2 className="mb-2 text-sm font-medium">
              {bagua.arranjo !== 'bagua'
                ? 'Código em linha'
                : bagua.complemento
                  ? 'Bagua e código em linha'
                  : bagua.rosetas.length > 1
                    ? 'Baguas'
                    : 'Bagua'}
            </h2>
          )}
          {/*
            Todo protocolo desenha em SVG a partir da composição. O recorte do livro,
            que era o plano B, saiu do app junto com as imagens — quem não tiver
            composição cadastrada avisa aqui, em vez de mostrar figura quebrada.
          */}
          {bagua ? (
            <div className="paraImprimir" data-alto={duasRosetas ? 'sim' : 'nao'}>
              {/* só no papel: na tela o nome já está no alto da página */}
              <p className="hidden print:mb-3 print:block print:text-center print:text-base print:font-semibold">
                {protocolo.titulo}
                {protocolo.complemento && ` (${protocolo.complemento})`}
              </p>
              <DesenhoProtocolo composicao={bagua} />
            </div>
          ) : (
            <p className="rounded-card border border-dashed border-line bg-surface-muted p-6 text-center text-sm text-ink-muted">
              O desenho deste protocolo ainda não foi cadastrado.
            </p>
          )}
          {bagua && (
            <figcaption className="mt-2 text-center text-xs text-ink-muted">
              Desenhe este protocolo com qualquer caneta.
            </figcaption>
          )}

          {bagua && (
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-bloco border border-chip px-4 py-2.5 text-sm font-medium text-chip transition-colors hover:bg-chip-suave active:bg-chip-suave print:hidden"
            >
              <span aria-hidden>⎙</span>
              Imprimir protocolo
            </button>
          )}
        </figure>

        <div className="md:col-start-2 md:row-start-2 md:mt-8">
          {bagua && (
            <section className="mt-4 md:mt-0">
              <h2 className="text-sm font-medium">Assinatura energética deste protocolo</h2>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {centrosDePontos.map((centro, i) => (
                  <li key={`centro-${i}`}>
                    <span
                      title={`${centro.pontos} pontos no centro do bagua, no lugar do hexagrama`}
                      className="inline-block rounded-full border border-chip px-3 py-1.5 text-sm text-chip"
                    >
                      Centro
                      <span className="ml-1.5 font-medium tabular-nums text-chip">
                        {centro.pontos}
                      </span>
                    </span>
                  </li>
                ))}

                {aminoacidos.map(({ codigo, hexagramas }, i) => (
                  <li key={`${codigo}-${i}`}>
                    <Link
                      to={`/aminoacido/${codigo}`}
                      className="inline-block rounded-full border border-chip px-3 py-1.5 text-sm text-chip hover:bg-surface-muted active:bg-surface-muted"
                    >
                      {AMINOACIDO_POR_CODIGO.get(codigo)?.nome ?? codigo}
                      <span
                        className="ml-1.5 font-medium tabular-nums text-chip"
                        title={`${hexagramas} ${hexagramas === 1 ? 'hexagrama' : 'hexagramas'} na formação deste aminoácido`}
                      >
                        {hexagramas}
                      </span>
                    </Link>
                  </li>
                ))}

                {trigramas.map(({ nome, unicode, posicoes }) => (
                  <li key={nome}>
                    <span
                      title={`Trigrama ${nome}, em ${posicoes} das oito posições do anel`}
                      className="inline-block rounded-full border border-chip px-3 py-1.5 text-sm text-chip"
                    >
                      <span aria-hidden className="mr-1">
                        {unicode}
                      </span>
                      {nome}
                      <span className="ml-1.5 font-medium tabular-nums text-chip">{posicoes}</span>
                    </span>
                  </li>
                ))}

                {/* derivados não têm hexagrama: nascem da combinação dos que têm */}
                {derivados.map((d) => (
                  <li key={d.nome}>
                    <span
                      title={`${d.nome}: ${d.origem}`}
                      className="inline-block rounded-full border border-dashed border-chip px-3 py-1.5 text-sm text-chip"
                    >
                      {d.nome}
                    </span>
                  </li>
                ))}
              </ul>

              {derivados.length > 0 && (
                <p className="mt-2 text-xs text-ink-muted">
                  {derivados.map((d) => `${d.nome} - ${d.origem}`).join('; ')}.
                </p>
              )}
            </section>
          )}

          {protocolo.notaAplicacao && (
            <p className="mt-4 rounded-card border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
              <strong className="font-medium">Onde desenhar:</strong> {protocolo.notaAplicacao}.
            </p>
          )}

          {protocolo.sugestao && (
            <p className="mt-4 rounded-card border border-line bg-surface-muted px-4 py-3 text-sm leading-relaxed">
              <strong className="font-medium">Sugestão:</strong> {protocolo.sugestao}
            </p>
          )}

          {protocolo.palavrasChave.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-medium">Sintomas relacionados</h2>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {protocolo.palavrasChave.map((chave) => (
                  <li key={chave}>
                    <Link
                      to={`/?chave=${encodeURIComponent(chave)}`}
                      className="inline-block rounded-full border border-chip px-3 py-1.5 text-sm text-chip hover:bg-surface-muted active:bg-surface-muted"
                    >
                      {chave}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {protocolo.relacoes && (
            <section className="mt-8">
              <h2 className="text-sm font-medium">Relações energéticas</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{protocolo.relacoes}</p>
              <p className="mt-1 text-xs text-ink-muted">
                Informação voltada a terapeutas; não é necessária para usar o protocolo.
              </p>
            </section>
          )}

          <div className="mt-8">
            <AvisoSaude compacto />
          </div>

          <nav className="mt-8 flex gap-2">
            {anterior && (
              <Link
                to={`/protocolo/${anterior.numero}`}
                className="flex-1 rounded-bloco border border-chip px-3 py-3 text-sm text-chip hover:bg-surface-muted active:bg-surface-muted"
              >
                <span className="block text-xs text-chip">‹ Anterior</span>
                <span className="line-clamp-1">{anterior.titulo}</span>
              </Link>
            )}
            {proximo && (
              <Link
                to={`/protocolo/${proximo.numero}`}
                className="flex-1 rounded-bloco border border-chip px-3 py-3 text-right text-sm text-chip hover:bg-surface-muted active:bg-surface-muted"
              >
                <span className="block text-xs text-chip">Próximo ›</span>
                <span className="line-clamp-1">{proximo.titulo}</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
