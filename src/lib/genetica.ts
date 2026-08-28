/**
 * Ponte entre hexagramas e o código genético.
 *
 * A parte objetiva: um hexagrama tem 6 linhas = 3 pares de linhas (digramas).
 * Cada digrama tem 4 estados, e 4³ = 64 — exatamente o número de códons.
 * O código genético em si (códon → aminoácido) é ciência estabelecida.
 *
 * A parte convencionada: QUAL digrama corresponde a QUAL base (A, U, C, G).
 * Isso é escolha, não dedução — autores diferentes escolhem diferente.
 * Por isso a correspondência é um parâmetro trocável, não algo fixo no código.
 */

export type Base = 'A' | 'U' | 'C' | 'G'
/** Digrama: duas linhas, escritas de baixo para cima. '1' = yang, '0' = yin. */
export type Digrama = '00' | '01' | '10' | '11'
/** Seis linhas, de baixo para cima. */
export type Linhas = string

// ---------------------------------------------------------------- hexagramas

/** Sequência do Rei Wen: linhas de baixo para cima. Mesma ordem do bloco Unicode U+4DC0. */
export const KING_WEN: Linhas[] = `111111 000000 100010 010001 111010 010111 010000 000010
111011 110111 111000 000111 101111 111101 001000 000100
100110 011001 110000 000011 100101 101001 000001 100000
100111 111001 100001 011110 010010 101101 001110 011100
001111 111100 000101 101000 101011 110101 001010 010100
110001 100011 111110 011111 000110 011000 010110 011010
101110 011101 100100 001001 001011 110100 101100 001101
011011 110110 010011 110010 110011 001100 101010 010101`.split(/\s+/)

const NUMERO_POR_LINHAS = new Map(KING_WEN.map((linhas, i) => [linhas, i + 1]))

/** Número no arranjo do Rei Wen (1 a 64) a partir das linhas. */
export function numeroDoHexagrama(linhas: Linhas): number | undefined {
  return NUMERO_POR_LINHAS.get(linhas)
}

export function linhasDoHexagrama(numero: number): Linhas {
  return KING_WEN[numero - 1]
}

/** Caractere Unicode do hexagrama — útil para copiar em texto, não para desenhar na tela. */
export function unicodeDoHexagrama(numero: number): string {
  return String.fromCodePoint(0x4dc0 + numero - 1)
}

/**
 * Os oito trigramas, pelas três linhas de baixo para cima.
 *
 * Trigrama não vira códon: são três linhas, e cada base pede duas. No livro ele aparece
 * no anel de alguns baguas, com um hexagrama no centro — a Contusão é assim.
 */
export const TRIGRAMAS: Record<string, { nome: string; unicode: string }> = {
  '111': { nome: 'Céu', unicode: '☰' },
  '110': { nome: 'Lago', unicode: '☱' },
  '101': { nome: 'Fogo', unicode: '☲' },
  '100': { nome: 'Trovão', unicode: '☳' },
  '011': { nome: 'Vento', unicode: '☴' },
  '010': { nome: 'Água', unicode: '☵' },
  '001': { nome: 'Montanha', unicode: '☶' },
  '000': { nome: 'Terra', unicode: '☷' },
}

// ------------------------------------------------------- convenção digrama→base

export type Convencao = {
  id: string
  nome: string
  descricao: string
  /** Digrama (baixo, cima) → base. */
  mapa: Record<Digrama, Base>
}

export const CONVENCOES: Convencao[] = [
  {
    id: 'htg',
    nome: 'HTG',
    descricao:
      'A linha de baixo do digrama define o grupo: yin embaixo são as bases yin ' +
      '(Uracila e Guanina), yang embaixo são as bases yang (Citosina e Adenina). ' +
      'Conferida contra a tabela "Bases dos Aminoácidos" do material do curso.',
    mapa: { '00': 'U', '01': 'G', '10': 'C', '11': 'A' },
  },
  {
    id: 'purina-forca',
    nome: 'Purina / força da ligação',
    descricao:
      'Linha de baixo diz se a base é purina (yang: A, G) ou pirimidina (yin: C, U). ' +
      'Linha de cima diz se a ligação é forte, de três pontes de hidrogênio (yang: G, C), ' +
      'ou fraca, de duas (yin: A, U). Alternativa, não usada pelo HTG.',
    mapa: { '11': 'G', '10': 'A', '01': 'C', '00': 'U' },
  },
  {
    id: 'binaria-direta',
    nome: 'Binária direta',
    descricao: 'Lê o digrama como número de 0 a 3 e percorre a ordem U, C, A, G.',
    mapa: { '00': 'U', '01': 'C', '10': 'A', '11': 'G' },
  },
]

export const CONVENCAO_PADRAO = CONVENCOES[0]

/**
 * Cada base tem um elemento e uma cor no HTG. As cores são as do material do curso
 * e servem para desenhar cada digrama do hexagrama na cor da sua base.
 */
export const BASES: Record<Base, { nome: string; elemento: string; cor: string; yin: boolean }> = {
  U: { nome: 'Uracila', elemento: 'Água', cor: 'var(--color-base-u)', yin: true },
  G: { nome: 'Guanina', elemento: 'Metal', cor: 'var(--color-base-g)', yin: true },
  C: { nome: 'Citosina', elemento: 'Madeira', cor: 'var(--color-base-c)', yin: false },
  A: { nome: 'Adenina', elemento: 'Fogo', cor: 'var(--color-base-a)', yin: false },
}

/** As três bases de um hexagrama, da primeira (embaixo) à terceira (em cima). */
export function basesDoHexagrama(linhas: Linhas, convencao = CONVENCAO_PADRAO): Base[] {
  return [linhas.slice(0, 2), linhas.slice(2, 4), linhas.slice(4, 6)].map(
    (par) => convencao.mapa[par as Digrama],
  )
}

/** Caminho inverso: monta as 6 linhas a partir de um códon. */
export function codonParaHexagrama(codon: string, convencao = CONVENCAO_PADRAO): Linhas {
  const inverso = Object.fromEntries(
    Object.entries(convencao.mapa).map(([digrama, base]) => [base, digrama]),
  ) as Record<Base, Digrama>
  return [...codon].map((base) => inverso[base as Base]).join('')
}

/** Converte um hexagrama em códon usando a convenção escolhida. */
export function hexagramaParaCodon(linhas: Linhas, convencao = CONVENCAO_PADRAO): string {
  // linhas 1-2 = primeira base, 3-4 = segunda, 5-6 = terceira (de baixo para cima)
  const pares = [linhas.slice(0, 2), linhas.slice(2, 4), linhas.slice(4, 6)]
  return pares.map((par) => convencao.mapa[par as Digrama]).join('')
}

// ------------------------------------------------------------- código genético

export type Aminoacido = {
  codigo: string
  sigla: string
  nome: string
}

export const AMINOACIDOS: Aminoacido[] = [
  { codigo: 'F', sigla: 'Phe', nome: 'Fenilalanina' },
  { codigo: 'L', sigla: 'Leu', nome: 'Leucina' },
  { codigo: 'I', sigla: 'Ile', nome: 'Isoleucina' },
  { codigo: 'M', sigla: 'Met', nome: 'Metionina' },
  { codigo: 'V', sigla: 'Val', nome: 'Valina' },
  { codigo: 'S', sigla: 'Ser', nome: 'Serina' },
  { codigo: 'P', sigla: 'Pro', nome: 'Prolina' },
  { codigo: 'T', sigla: 'Thr', nome: 'Treonina' },
  { codigo: 'A', sigla: 'Ala', nome: 'Alanina' },
  { codigo: 'Y', sigla: 'Tyr', nome: 'Tirosina' },
  { codigo: 'H', sigla: 'His', nome: 'Histidina' },
  { codigo: 'Q', sigla: 'Gln', nome: 'Glutamina' },
  { codigo: 'N', sigla: 'Asn', nome: 'Asparagina' },
  { codigo: 'K', sigla: 'Lys', nome: 'Lisina' },
  { codigo: 'D', sigla: 'Asp', nome: 'Ácido aspártico' },
  { codigo: 'E', sigla: 'Glu', nome: 'Ácido glutâmico' },
  { codigo: 'C', sigla: 'Cys', nome: 'Cisteína' },
  { codigo: 'W', sigla: 'Trp', nome: 'Triptofano' },
  { codigo: 'R', sigla: 'Arg', nome: 'Arginina' },
  { codigo: 'G', sigla: 'Gly', nome: 'Glicina' },
  { codigo: '*', sigla: 'Fim', nome: 'Códon de parada' },
]

export const AMINOACIDO_POR_CODIGO = new Map(AMINOACIDOS.map((a) => [a.codigo, a]))

/** Código genético padrão. Ordem das bases: U, C, A, G. */
const TABELA_PADRAO = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG'
const ORDEM: Base[] = ['U', 'C', 'A', 'G']

export const CODIGO_GENETICO: Record<string, string> = (() => {
  const tabela: Record<string, string> = {}
  let i = 0
  for (const primeira of ORDEM) {
    for (const segunda of ORDEM) {
      for (const terceira of ORDEM) {
        tabela[`${primeira}${segunda}${terceira}`] = TABELA_PADRAO[i++]
      }
    }
  }
  return tabela
})()

export function aminoacidoDoCodon(codon: string): Aminoacido | undefined {
  return AMINOACIDO_POR_CODIGO.get(CODIGO_GENETICO[codon])
}

// ------------------------------------------------------------------- trigramas

export type TrigramaCodificado = {
  /** As três linhas, de baixo para cima. */
  linhas: Linhas
  nome: string
  unicode: string
}

// ------------------------------------------------------ hexagramas ↔ aminoácido

export type HexagramaCodificado = {
  numero: number
  linhas: Linhas
  codon: string
  unicode: string
}

/** Todos os 64 hexagramas já convertidos em códon, na convenção escolhida. */
export function tabelaCompleta(convencao = CONVENCAO_PADRAO): HexagramaCodificado[] {
  return KING_WEN.map((linhas, i) => ({
    numero: i + 1,
    linhas,
    codon: hexagramaParaCodon(linhas, convencao),
    unicode: unicodeDoHexagrama(i + 1),
  }))
}

/**
 * Hexagramas que compõem um aminoácido: um para cada códon que o codifica.
 * A quantidade varia de 1 (metionina, triptofano) a 6 (leucina, serina, arginina).
 */
export function hexagramasDoAminoacido(
  codigo: string,
  convencao = CONVENCAO_PADRAO,
): HexagramaCodificado[] {
  return tabelaCompleta(convencao)
    .filter((h) => CODIGO_GENETICO[h.codon] === codigo)
    .sort((a, b) => a.numero - b.numero)
}

/** Confere que a convenção gera os 64 códons sem repetir nenhum. */
export function convencaoEhValida(convencao: Convencao): boolean {
  const codons = new Set(KING_WEN.map((l) => hexagramaParaCodon(l, convencao)))
  return codons.size === 64
}
