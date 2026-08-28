/** Categorias na ordem em que aparecem na tela de busca. */
export const CATEGORIAS = [
  { id: 'neuromuscular', nome: 'Neuromuscular e Mobilidade' },
  { id: 'dores', nome: 'Dores e Ossos' },
  { id: 'digestao', nome: 'Digestão e Fígado' },
  { id: 'respiratorio', nome: 'Respiratório' },
  { id: 'emocional', nome: 'Emocionais e Mentais' },
  { id: 'sono', nome: 'Alterações do Sono' },
  { id: 'mulher', nome: 'Saúde da Mulher' },
  { id: 'urinario', nome: 'Urinário e Renal' },
  { id: 'circulacao', nome: 'Circulação e Metabolismo' },
  { id: 'pele', nome: 'Pele e Imunidade' },
  { id: 'cabeca', nome: 'Cabeça e Órgãos dos Sentidos' },
] as const

export type CategoriaId = (typeof CATEGORIAS)[number]['id']

const NOME_POR_ID = new Map(CATEGORIAS.map((c) => [c.id as string, c.nome]))

export function nomeDaCategoria(id: string) {
  return NOME_POR_ID.get(id) ?? id
}
