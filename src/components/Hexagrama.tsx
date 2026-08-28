/**
 * Desenha um hexagrama (6 linhas) ou trigrama (3 linhas) em SVG.
 *
 * Gerado por código em vez de caractere Unicode porque assim é nítido em qualquer
 * tamanho, gira sem depender de fonte, e imprime bem — que é o uso real: a pessoa
 * copia o desenho com uma caneta.
 */

/**
 * A barra tem 11% da largura do glifo e o vão entre barras, 9% — mais aberto que o traço
 * do livro, que aperta o vão a 5%, porque na tela o desenho respira melhor assim.
 *
 * O vão é o que manda na altura do glifo: com 9 ele fica em 111 de altura para 100 de
 * largura. Passar de 9 começa a encostar os glifos vizinhos do bagua, que ficam a 29,8%
 * do lado uns dos outros — por isso este é o teto prático.
 */
const LARGURA = 100
const ALTURA_LINHA = 11
const ESPACO = 9
/** Metade da linha yin, deixando o vão central. */
const METADE_YIN = 41

export default function Hexagrama({
  linhas,
  rotacao = 0,
  tamanho = 72,
  cor = 'currentColor',
  cores,
  titulo,
}: {
  /** '1' = yang (inteira), '0' = yin (partida). Escrito de baixo para cima. */
  linhas: string
  /** Graus no sentido horário, como os protocolos do livro usam (0, 45, 90, 135). */
  rotacao?: number
  tamanho?: number
  cor?: string
  /** Uma cor por digrama, de baixo para cima — pinta cada base como no material do curso. */
  cores?: string[]
  titulo?: string
}) {
  const total = linhas.length
  const altura = total * ALTURA_LINHA + (total - 1) * ESPACO

  // a string vem de baixo para cima; na tela a primeira linha fica embaixo
  const deCimaParaBaixo = [...linhas].reverse()

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${altura}`}
      width={tamanho}
      height={(tamanho * altura) / LARGURA}
      role={titulo ? 'img' : 'presentation'}
      aria-label={titulo}
      style={{
        transform: rotacao ? `rotate(${rotacao}deg)` : undefined,
        overflow: 'visible',
      }}
    >
      {titulo && <title>{titulo}</title>}
      {deCimaParaBaixo.map((linha, i) => {
        const y = i * (ALTURA_LINHA + ESPACO)
        // i conta de cima; o digrama 0 é o de baixo
        const digrama = Math.floor((total - 1 - i) / 2)
        const tinta = cores?.[digrama] ?? cor
        return linha === '1' ? (
          <rect key={i} x={0} y={y} width={LARGURA} height={ALTURA_LINHA} fill={tinta} />
        ) : (
          <g key={i}>
            <rect x={0} y={y} width={METADE_YIN} height={ALTURA_LINHA} fill={tinta} />
            <rect
              x={LARGURA - METADE_YIN}
              y={y}
              width={METADE_YIN}
              height={ALTURA_LINHA}
              fill={tinta}
            />
          </g>
        )
      })}
    </svg>
  )
}
