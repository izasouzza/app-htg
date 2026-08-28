import bruto from './aminoacidos.json'
import { AMINOACIDO_POR_CODIGO, hexagramasDoAminoacido } from '@/lib/genetica'
import type { Convencao } from '@/lib/genetica'

/** Dados clínicos dos 20 aminoácidos, vindos da planilha do material de estudo. */
export type AminoacidoClinico = {
  codigo: string
  nome: string
  essencial: string
  funcoes: string[]
  sintomasDeficiencia: string[]
  fontes: string[]
}

export const aminoacidosClinicos = bruto as AminoacidoClinico[]

export function aminoacidoClinico(codigo: string) {
  return aminoacidosClinicos.find((a) => a.codigo === codigo)
}

/** Junta o dado clínico com os hexagramas que codificam o aminoácido. */
export function fichaCompleta(codigo: string, convencao?: Convencao) {
  const clinico = aminoacidoClinico(codigo)
  const basico = AMINOACIDO_POR_CODIGO.get(codigo)
  if (!clinico || !basico) return undefined
  return { ...clinico, sigla: basico.sigla, hexagramas: hexagramasDoAminoacido(codigo, convencao) }
}
