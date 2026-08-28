import {
  AMINOACIDOS,
  CODIGO_GENETICO,
  hexagramaParaCodon,
  linhasDoHexagrama,
  unicodeDoHexagrama,
  KING_WEN,
  numeroDoHexagrama,
  TRIGRAMAS,
} from './genetica'
import type { HexagramaCodificado, TrigramaCodificado } from './genetica'

/**
 * Uma posição do bagua pode ser escrita de quatro jeitos, o que for mais cômodo
 * na hora de cadastrar o protocolo:
 *
 *   'Metionina' — o nome do aminoácido, quando ele tem um só códon
 *   'AUG'       — o códon
 *   41          — o número do hexagrama no arranjo do Rei Wen
 *   '110001'    — as seis linhas, de baixo para cima
 */
export type PosicaoBagua = string | number

/**
 * Nem todo bagua tem hexagrama no centro. A Arritmia traz cinco pontos — um no
 * meio e quatro em cruz ao redor. Enquanto não se sabe o que eles dizem, o centro
 * entra pelo número de pontos e a assinatura energética o chama só de "Centro".
 */
export type CentroDePontos = { pontos: number }

export function ehCentroDePontos(centro: unknown): centro is CentroDePontos {
  return typeof centro === 'object' && centro !== null && 'pontos' in centro
}

/** Ordem em que as oito posições do anel são escritas. */
export const ORDEM_DO_ANEL = ['NO', 'N', 'NE', 'O', 'L', 'SO', 'S', 'SE'] as const

/**
 * Nem todo protocolo é um bagua. O livro também traz fileiras de hexagramas
 * lado a lado — as Aftas, por exemplo, são quatro em linha.
 */
export type Composicao =
  | {
      arranjo?: 'bagua'
      /** Um hexagrama ou, quando o livro não desenha hexagrama ali, `{ pontos: 5 }`. */
      centro: PosicaoBagua | CentroDePontos
      /** Exatamente 8 posições, na ordem de ORDEM_DO_ANEL. */
      anel: PosicaoBagua[]
      /**
       * Alguns desenhos trazem dois baguas — a Queimadura é assim. O segundo é desenhado
       * embaixo do primeiro e lido depois dele.
       */
      segundo?: { centro: PosicaoBagua | CentroDePontos; anel: PosicaoBagua[] }
      /**
       * Alguns baguas trazem ainda uma fileira de hexagramas embaixo, completando o
       * desenho — a Ciatalgia é assim. Mesma escrita do arranjo em linha, e lê-se
       * depois do anel.
       */
      complemento?: PosicaoBagua[] | PosicaoBagua[][]
    }
  | {
      arranjo: 'linha'
      /**
       * Da esquerda para a direita. Uma lista simples desenha tudo numa fileira;
       * uma lista de listas desenha uma fileira por sublista, como no livro.
       */
      hexagramas: PosicaoBagua[] | PosicaoBagua[][]
    }

const CODON_PARA_LINHAS = new Map(KING_WEN.map((linhas) => [hexagramaParaCodon(linhas), linhas]))

const semAcento = (texto: string) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()

/** Códons de um aminoácido escrito por nome, sigla ou letra. Vazio se não reconhecer. */
function codonsDoNome(nome: string): string[] {
  const procurado = semAcento(nome)
  const aminoacido = AMINOACIDOS.find(
    (a) =>
      semAcento(a.nome) === procurado ||
      semAcento(a.sigla) === procurado ||
      a.codigo.toLowerCase() === procurado,
  )
  if (!aminoacido) return []
  return Object.entries(CODIGO_GENETICO)
    .filter(([, codigo]) => codigo === aminoacido.codigo)
    .map(([codon]) => codon)
    .sort()
}

/** Resolve qualquer uma das três formas de escrita para um hexagrama completo. */
export function resolverPosicao(posicao: PosicaoBagua): HexagramaCodificado {
  let linhas: string | undefined

  if (typeof posicao === 'number') {
    if (posicao < 1 || posicao > 64) {
      throw new Error(`Hexagrama ${posicao} não existe: use um número de 1 a 64.`)
    }
    linhas = linhasDoHexagrama(posicao)
  } else if (/^[01]{6}$/.test(posicao)) {
    linhas = posicao
  } else if (/^[AUTCGautcg]{3}$/.test(posicao)) {
    const codon = posicao.toUpperCase().replace(/T/g, 'U')
    if (!(codon in CODIGO_GENETICO)) {
      throw new Error(`Códon "${posicao}" não existe: use três letras de A, U (ou T), C e G.`)
    }
    linhas = CODON_PARA_LINHAS.get(codon)
  } else {
    // nome de aminoácido: só resolve sozinho quando há um único códon possível
    const codons = codonsDoNome(posicao)
    if (codons.length === 0) {
      throw new Error(
        `Não reconheci "${posicao}". Use o nome de um aminoácido, um códon de três ` +
          'letras, o número do hexagrama (1 a 64) ou as seis linhas.',
      )
    }
    if (codons.length > 1) {
      throw new Error(
        `"${posicao}" tem ${codons.length} códons: ${codons.join(', ')}. ` +
          'Escreva qual deles vai nesta posição — o nome sozinho não diz qual hexagrama é.',
      )
    }
    linhas = CODON_PARA_LINHAS.get(codons[0])
  }

  const numero = linhas ? numeroDoHexagrama(linhas) : undefined
  if (!linhas || !numero) {
    throw new Error(`Não consegui montar o hexagrama de "${posicao}".`)
  }

  return {
    numero,
    linhas,
    codon: hexagramaParaCodon(linhas),
    unicode: unicodeDoHexagrama(numero),
  }
}

/** No anel do bagua cabem os dois: hexagrama de seis linhas ou trigrama de três. */
export type GlifoCodificado = HexagramaCodificado | TrigramaCodificado

export function ehTrigrama(glifo: GlifoCodificado): glifo is TrigramaCodificado {
  return glifo.linhas.length === 3
}

/**
 * Resolve uma posição que também aceita trigrama — pelas três linhas ('001') ou pelo
 * nome ('Montanha'). Qualquer outra escrita cai em resolverPosicao, como hexagrama.
 */
export function resolverGlifo(posicao: PosicaoBagua): GlifoCodificado {
  if (typeof posicao === 'string') {
    const linhas = /^[01]{3}$/.test(posicao)
      ? posicao
      : Object.keys(TRIGRAMAS).find((k) => semAcento(TRIGRAMAS[k].nome) === semAcento(posicao))
    if (linhas) return { linhas, ...TRIGRAMAS[linhas] }
  }
  return resolverPosicao(posicao)
}

export type RosetaResolvida = {
  centro: HexagramaCodificado | CentroDePontos
  /** Os oito do anel, já na ordem de ORDEM_DO_ANEL. */
  anel: GlifoCodificado[]
}

export type ComposicaoResolvida =
  | {
      arranjo: 'bagua'
      /** Uma ou duas; a segunda é desenhada embaixo da primeira. */
      rosetas: RosetaResolvida[]
      /** A fileira de baixo, quando o desenho tem uma. */
      complemento?: GlifoCodificado[][]
    }
  | { arranjo: 'linha'; fileiras: GlifoCodificado[][] }

/** Aceita tanto uma lista simples quanto uma lista de fileiras. */
function resolverFileiras(escrito: PosicaoBagua[] | PosicaoBagua[][]): GlifoCodificado[][] {
  const bruto = (Array.isArray(escrito[0]) ? escrito : [escrito]) as PosicaoBagua[][]
  return bruto.map((fila) => fila.map(resolverGlifo))
}

export function resolverComposicao(composicao: Composicao): ComposicaoResolvida {
  if (composicao.arranjo === 'linha') {
    if (composicao.hexagramas.length === 0) {
      throw new Error('A fileira precisa de pelo menos um hexagrama.')
    }
    return { arranjo: 'linha', fileiras: resolverFileiras(composicao.hexagramas) }
  }

  const resolverRoseta = (roseta: {
    centro: PosicaoBagua | CentroDePontos
    anel: PosicaoBagua[]
  }): RosetaResolvida => {
    if (roseta.anel.length !== 8) {
      throw new Error(
        `O anel precisa de 8 posições, recebi ${roseta.anel.length}. ` +
          `Ordem esperada: ${ORDEM_DO_ANEL.join(', ')}.`,
      )
    }
    return {
      centro: ehCentroDePontos(roseta.centro) ? roseta.centro : resolverPosicao(roseta.centro),
      anel: roseta.anel.map(resolverGlifo),
    }
  }

  return {
    arranjo: 'bagua',
    rosetas: [composicao, ...(composicao.segundo ? [composicao.segundo] : [])].map(resolverRoseta),
    complemento: composicao.complemento?.length
      ? resolverFileiras(composicao.complemento)
      : undefined,
  }
}

/** Centro e anel de uma roseta, na ordem de leitura: o centro e o anel no horário. */
function glifosDaRoseta(roseta: RosetaResolvida): GlifoCodificado[] {
  return [
    ...(ehCentroDePontos(roseta.centro) ? [] : [roseta.centro]),
    ...ORDEM_HORARIA.map(
      (pos) => roseta.anel[ORDEM_DO_ANEL.indexOf(pos as (typeof ORDEM_DO_ANEL)[number])],
    ),
  ]
}

/** Todos os hexagramas de uma composição, seja bagua ou fileira. */
export function hexagramasDaComposicao(resolvida: ComposicaoResolvida): HexagramaCodificado[] {
  const soHexagramas = (glifos: GlifoCodificado[]) =>
    glifos.filter((glifo): glifo is HexagramaCodificado => !ehTrigrama(glifo))

  if (resolvida.arranjo === 'linha') return soHexagramas(resolvida.fileiras.flat())
  // centro de pontos e trigramas não são hexagramas e não entram na conta
  return soHexagramas([
    ...resolvida.rosetas.flatMap(glifosDaRoseta),
    ...(resolvida.complemento?.flat() ?? []),
  ])
}

/**
 * Os trigramas do desenho, na ordem de leitura e agrupados: no lugar do aminoácido, que
 * eles não têm, a assinatura mostra o nome de cada um e quantas posições ocupa.
 */
export function trigramasDaComposicao(resolvida: ComposicaoResolvida) {
  const emOrdem =
    resolvida.arranjo === 'linha'
      ? resolvida.fileiras.flat()
      : [...resolvida.rosetas.flatMap(glifosDaRoseta), ...(resolvida.complemento?.flat() ?? [])]

  const contagem = new Map<string, { nome: string; unicode: string; posicoes: number }>()
  for (const glifo of emOrdem) {
    if (!ehTrigrama(glifo)) continue
    const achado = contagem.get(glifo.linhas)
    if (achado) achado.posicoes += 1
    else contagem.set(glifo.linhas, { nome: glifo.nome, unicode: glifo.unicode, posicoes: 1 })
  }
  return [...contagem.values()]
}

/** Do norte, no sentido horário — a ordem em que se lê o bagua. */
export const ORDEM_HORARIA = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'] as const

/** Quantos hexagramas (códons) um aminoácido tem na sua formação. */
export function hexagramasDoCodigo(codigo: string): number {
  return Object.values(CODIGO_GENETICO).filter((c) => c === codigo).length
}

/**
 * A sequência de aminoácidos na ordem do desenho: no bagua, cada roseta pelo centro e
 * pelo anel do norte em diante no sentido horário e, por último, o complemento de baixo;
 * na fileira, da esquerda para a direita. Posições seguidas do mesmo aminoácido viram uma entrada só
 * — é assim que o protocolo se lê em voz alta.
 *
 * Um centro de pontos fica de fora: não é hexagrama, não tem aminoácido. Quem
 * mostra a assinatura é que o anuncia à parte, antes do anel.
 */
export function sequenciaDeAminoacidos(resolvida: ComposicaoResolvida) {
  const glifos: GlifoCodificado[] =
    resolvida.arranjo === 'linha'
      ? resolvida.fileiras.flat()
      : [...resolvida.rosetas.flatMap(glifosDaRoseta), ...(resolvida.complemento?.flat() ?? [])]
  // trigrama não fecha códon: fica de fora, e a assinatura o mostra pelo nome
  const emOrdem = glifos.filter((glifo): glifo is HexagramaCodificado => !ehTrigrama(glifo))

  const sequencia: { codigo: string; hexagramas: number }[] = []
  for (const hex of emOrdem) {
    const codigo = CODIGO_GENETICO[hex.codon]
    if (sequencia[sequencia.length - 1]?.codigo === codigo) continue
    sequencia.push({ codigo, hexagramas: hexagramasDoCodigo(codigo) })
  }
  return sequencia
}
