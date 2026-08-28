/**
 * Aminoácidos derivados: os que o corpo produz a partir de outros e que, por isso,
 * não têm códon próprio nem hexagrama. Eles não ocupam posição no bagua — são uma
 * leitura do que a combinação de hexagramas significa.
 */
export type Derivado = {
  nome: string
  /** Códigos de uma letra dos aminoácidos que precisam estar presentes. */
  exige: string[]
  /** De onde vem, em uma linha. */
  origem: string
}

export const DERIVADOS: Derivado[] = [
  {
    nome: 'Taurina',
    exige: ['M', 'C'],
    origem: 'junção de metionina e cisteína',
  },
]

/** Quais derivados a lista de aminoácidos de um protocolo forma. */
export function derivadosPresentes(codigos: string[]): Derivado[] {
  const tem = new Set(codigos)
  return DERIVADOS.filter((d) => d.exige.every((c) => tem.has(c)))
}
