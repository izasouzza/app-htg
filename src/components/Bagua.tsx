import Hexagrama from './Hexagrama'
import { BASES, basesDoHexagrama, hexagramasDoAminoacido } from '@/lib/genetica'
import { ehCentroDePontos, ehTrigrama } from '@/lib/composicao'
import type { HexagramaCodificado } from '@/lib/genetica'
import type { CentroDePontos, GlifoCodificado } from '@/lib/composicao'

/**
 * Arranjo em bagua: um hexagrama no centro e oito ao redor, em roseta.
 *
 * Não é uma grade 3×3 — os oito ficam todos à mesma distância do centro, o que
 * aproxima os cantos em relação a uma grade. As proporções abaixo foram medidas
 * no desenho do livro (protocolo 02, área de 711px):
 *
 *     raio, do centro a cada glifo ... 277px = 39,0% do lado
 *     largura do hexagrama .......... 151px = 21,2% do lado
 *
 * O bagua é riscado do centro para fora: a primeira linha de cada hexagrama fica
 * voltada para o centro. Como o hexagrama nasce apontando para cima, a rotação de
 * cada posição é a direção que aponta para fora — 0° no norte, girando no horário.
 */
const RAIO = 39.0
const LARGURA = 21.2

/**
 * Respiro entre o desenho e a borda da caixa, em % do lado.
 * No livro quem faz essa separação é a moldura de DNA; aqui, o espaço.
 */
const MARGEM = 8

/** Na ordem de leitura do anel (a mesma de ORDEM_DO_ANEL), com o ângulo de cada uma. */
export const POSICOES = [
  { id: 'NO', angulo: 315 },
  { id: 'N', angulo: 0 },
  { id: 'NE', angulo: 45 },
  { id: 'O', angulo: 270 },
  { id: 'L', angulo: 90 },
  { id: 'SO', angulo: 225 },
  { id: 'S', angulo: 180 },
  { id: 'SE', angulo: 135 },
] as const

/**
 * Centro padrão: metionina (AUG), o códon de iniciação — toda síntese de proteína
 * começa por ela. Decodificando os protocolos do livro, 42 trazem metionina no centro
 * e 24 trazem triptofano (UGG), estes ligados ao eixo da serotonina.
 */
export const CENTRO_METIONINA = hexagramasDoAminoacido('M')[0]
export const CENTRO_TRIPTOFANO = hexagramasDoAminoacido('W')[0]

/**
 * Alguns protocolos não trazem hexagrama no centro, e sim pontos — cinco, um no meio e
 * quatro em cruz.
 *
 * A cruz tem dois tamanhos, e é assim no livro: quando o anel é de hexagramas, o glifo é
 * alto e a cruz fica contida (10, 12, 89, 94); quando é de trigramas, o glifo tem metade
 * da altura, sobra espaço no meio e a cruz abre (43, 56, 78, 88). Um tamanho só para os
 * dois desequilibra a proporção, por isso ficaram separados.
 *
 * O braço saiu da medição direta do livro. O ponto é medido contra a barra, não contra o
 * raio: lá ele tem quase o dobro da espessura de uma linha do glifo (1,9×). Como as
 * barras daqui são mais finas que as impressas, o valor abaixo é 1,9× a espessura que a
 * barra tem no livro — é o que iguala o peso visual dos dois desenhos.
 *
 *                      braço      ponto
 *     hexagramas       9,3%       4,4%      medido nos protocolos 10, 12 e 89
 *     trigramas       14,0%       5,2%      medido no Esporão
 */
const CRUZ = {
  hexagrama: { braco: 9.3, ponto: 4.4 },
  trigrama: { braco: 14.0, ponto: 5.2 },
}

/** O ponto do meio e os demais em roda, a partir do norte. Com cinco, sai a cruz. */
function CentroEmPontos({
  quantos,
  medidas,
}: {
  quantos: number
  medidas: { braco: number; ponto: number }
}) {
  const emRoda = Array.from({ length: Math.max(quantos - 1, 0) }, (_, i) => {
    const radianos = (i * 2 * Math.PI) / (quantos - 1)
    return { x: medidas.braco * Math.sin(radianos), y: -medidas.braco * Math.cos(radianos) }
  })

  /*
   * Os pontos são círculos de SVG, e não caixas com cor de fundo, porque fundo o
   * navegador não imprime: sai só se a pessoa marcar "gráficos de segundo plano" na
   * caixa de impressão. Em SVG eles são conteúdo, como as barras dos hexagramas, e vão
   * para o papel sempre. O viewBox de 100 casa com as medidas, que já são % do lado.
   */
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {[{ x: 0, y: 0 }, ...emRoda].map(({ x, y }, i) => (
        <circle key={i} cx={50 + x} cy={50 + y} r={medidas.ponto / 2} fill="var(--color-tinta)" />
      ))}
    </svg>
  )
}

export default function Bagua({
  hexagramas,
  centro = CENTRO_METIONINA,
  colorido = true,
}: {
  /** Os glifos do anel — hexagramas ou trigramas —, na ordem em que ocupam as posições. */
  hexagramas: GlifoCodificado[]
  /** Hexagrama do centro — ou pontos, quando o livro desenha pontos. Por padrão, metionina. */
  centro?: HexagramaCodificado | CentroDePontos
  /** Pinta cada digrama na cor da sua base, como no material do curso. */
  colorido?: boolean
}) {
  if (hexagramas.length === 0) return null

  // trigrama não se divide em digramas, então não tem cor de base: sai em tinta cheia
  const cores = (glifo: GlifoCodificado) =>
    colorido && !ehTrigrama(glifo)
      ? basesDoHexagrama(glifo.linhas).map((b) => BASES[b].cor)
      : undefined

  const desenhar = (
    hex: GlifoCodificado,
    angulo: number,
    chave: string,
    x: number,
    y: number,
  ) => (
    <div
      key={chave}
      className="absolute [&>svg]:h-auto [&>svg]:w-full"
      style={{
        width: `${LARGURA}%`,
        left: `${50 + x}%`,
        top: `${50 + y}%`,
        transform: `translate(-50%, -50%) rotate(${angulo}deg)`,
      }}
    >
      <Hexagrama
        linhas={hex.linhas}
        tamanho={100}
        cores={cores(hex)}
        cor="var(--color-tinta)"
        titulo={
          ehTrigrama(hex)
            ? `Trigrama ${hex.unicode} ${hex.nome}`
            : `Hexagrama ${hex.numero}, códon ${hex.codon}`
        }
      />
    </div>
  )

  return (
    <div className="relative aspect-square w-full rounded-2xl border border-line bg-white">
      {/* o quadrado interno é a área de desenho; a folga até a borda vem daqui */}
      <div className="absolute" style={{ inset: `${MARGEM}%` }}>
        {ehCentroDePontos(centro) ? (
          // a cruz acompanha o anel: contida entre hexagramas, aberta entre trigramas
          <CentroEmPontos
            quantos={centro.pontos}
            medidas={ehTrigrama(hexagramas[0]) ? CRUZ.trigrama : CRUZ.hexagrama}
          />
        ) : (
          desenhar(centro, 0, 'C', 0, 0)
        )}

        {POSICOES.map((posicao, i) => {
          // o anel repete os glifos até fechar as oito posições
          const hex = hexagramas[i % hexagramas.length]
          const radianos = (posicao.angulo * Math.PI) / 180
          return desenhar(
            hex,
            posicao.angulo,
            posicao.id,
            RAIO * Math.sin(radianos),
            -RAIO * Math.cos(radianos),
          )
        })}
      </div>
    </div>
  )
}
