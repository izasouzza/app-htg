import bruto from './protocolos.json'
import indicacoes from './indicacoes.json'
import categorias from './categorias.json'
import { protocolosNovos } from './protocolosNovos'
import { COMPOSICOES } from './composicoes'
import { ehSintoma } from './naoSintomas'
import type { CategoriaId } from './categorias'
import type { Composicao } from '@/lib/composicao'

/** Monta um "Indicado para…" a partir das palavras-chave, quando não há texto escrito. */
function indicacaoAutomatica(titulo: string, chaves: string[]): string {
  const termos = [titulo.toLowerCase(), ...chaves.map((c) => c.toLowerCase())]
  const unicos = [...new Set(termos)]
  if (unicos.length === 1) return unicos[0]
  return `${unicos.slice(0, -1).join(', ')} e ${unicos[unicos.length - 1]}`
}

export type Protocolo = {
  /** 1 a 101 são os do livro; de 102 em diante, os cadastrados em protocolosNovos.ts. */
  numero: number
  titulo: string
  /** Texto entre parênteses no título, ex.: "Nutrição p/ Paciente". */
  complemento: string
  /** Linha explicativa abaixo do título, quando existe. */
  descricao: string
  /** Relações energéticas — informação voltada a terapeutas. */
  relacoes: string
  palavrasChave: string[]
  sugestao: string
  /** Onde desenhar, quando o protocolo pede um local específico. */
  notaAplicacao: string
  /** Página no livro impresso. Ausente nos protocolos cadastrados depois. */
  pagina?: number
  /** Hexagramas do bagua. Quando presente, o desenho é gerado em SVG. */
  composicao?: Composicao
  /** Texto corrido que completa a frase "Indicado para…". */
  indicacao: string
  categorias: CategoriaId[]
}

const textos = indicacoes as Record<string, string>
const grupos = categorias as Record<string, CategoriaId[]>

const doLivro: Protocolo[] = (bruto as Protocolo[]).map((p) => ({
  ...p,
  indicacao: textos[String(p.numero)] ?? indicacaoAutomatica(p.titulo, p.palavrasChave),
  categorias: grupos[String(p.numero)] ?? [],
  // quando a composição está cadastrada, a tela desenha em SVG no lugar da imagem
  composicao: COMPOSICOES[p.numero],
}))

const cadastrados: Protocolo[] = protocolosNovos.map((p) => ({
  numero: p.numero,
  titulo: p.titulo,
  complemento: p.complemento ?? '',
  descricao: p.descricao ?? '',
  relacoes: p.relacoes ?? '',
  palavrasChave: p.palavrasChave,
  sugestao: p.sugestao ?? '',
  notaAplicacao: p.notaAplicacao ?? '',
  composicao: p.composicao,
  indicacao: p.indicacao ?? indicacaoAutomatica(p.titulo, p.palavrasChave),
  categorias: p.categorias,
}))

// um protocolo sem categoria desapareceria ao filtrar por grupo
const semCategoria = [...doLivro, ...cadastrados].filter((p) => p.categorias.length === 0)
if (semCategoria.length > 0) {
  throw new Error(
    `Protocolo sem categoria: ${semCategoria.map((p) => `${p.numero} (${p.titulo})`).join(', ')}. ` +
      'Todo protocolo precisa de pelo menos uma categoria.',
  )
}

// números repetidos silenciosamente sumiriam da busca; melhor falhar na hora
const repetidos = [...doLivro, ...cadastrados]
  .map((p) => p.numero)
  .filter((n, i, todos) => todos.indexOf(n) !== i)
if (repetidos.length > 0) {
  throw new Error(
    `Número de protocolo repetido: ${[...new Set(repetidos)].join(', ')}. ` +
      'Em protocolosNovos.ts, use números a partir de 102.',
  )
}

export const protocolos: Protocolo[] = [...doLivro, ...cadastrados].sort(
  (a, b) => a.numero - b.numero,
)

export function protocoloPorNumero(numero: number) {
  return protocolos.find((p) => p.numero === numero)
}

/** Todas as palavras-chave, sem repetição, com quantos protocolos citam cada uma. */
export const palavrasChave = (() => {
  const contagem = new Map<string, number>()
  for (const p of protocolos) {
    for (const chave of p.palavrasChave) {
      contagem.set(chave, (contagem.get(chave) ?? 0) + 1)
    }
  }
  return [...contagem.entries()]
    .map(([chave, total]) => ({ chave, total }))
    .sort((a, b) => b.total - a.total || a.chave.localeCompare(b.chave, 'pt-BR'))
})()

/**
 * Só o que é sintoma ou condição, para os chips da busca — de lá a pessoa escolhe
 * o que está sentindo, e "Joelhos" ou "Hormônios" não respondem a essa pergunta.
 * A busca por texto continua enxergando o vocabulário inteiro.
 */
export const sintomas = palavrasChave.filter(({ chave }) => ehSintoma(chave))

/**
 * Sintomas que aparecem nos protocolos de uma categoria, do mais citado ao menos.
 * Sem categoria, devolve todos — assim os dois filtros da busca conversam:
 * escolher um grupo deixa à mostra só o que existe dentro dele.
 */
export function sintomasDaCategoria(id: string) {
  if (!id) return sintomas

  const contagem = new Map<string, number>()
  for (const p of protocolos) {
    if (!p.categorias.includes(id as CategoriaId)) continue
    for (const chave of p.palavrasChave) {
      if (ehSintoma(chave)) contagem.set(chave, (contagem.get(chave) ?? 0) + 1)
    }
  }
  return [...contagem.entries()]
    .map(([chave, total]) => ({ chave, total }))
    .sort((a, b) => b.total - a.total || a.chave.localeCompare(b.chave, 'pt-BR'))
}
