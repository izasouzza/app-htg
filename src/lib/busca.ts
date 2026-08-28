import { protocolos } from '@/dados/protocolos'
import type { Protocolo } from '@/dados/protocolos'
import { sinonimosDe } from './sinonimos'

/** Minúsculas, sem acento e sem pontuação — para comparar "Insônia" com "insonia". */
export function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Palavras que a pessoa digita junto com a queixa e que não ajudam a filtrar. */
const IGNORADAS = new Set([
  'a','o','as','os','um','uma','de','da','do','das','dos','na','no','nas','nos','em','com','sem',
  'e','ou','para','pra','por','que','meu','minha','meus','minhas','muito','muita','tenho','estou',
  'sinto','sentindo','ando','ta','esta','dor','dores','problema','problemas','ajuda','nao',
  'consigo','sempre','toda','todo','dia','noite','pouco','mais','menos','bem','mal','ser','ta',
])

/**
 * Cada termo digitado vira um grupo: a palavra em si mais os sinônimos do livro.
 * Assim "dormir" alcança "Insônia" sem precisar que a pessoa saiba o nome técnico.
 */
function tokenizar(consulta: string): string[][] {
  const termos = normalizar(consulta)
    .split(' ')
    .filter((t) => t.length >= 2 && !IGNORADAS.has(t))
  return termos.map((termo) => [termo, ...sinonimosDe(termo)])
}

/** Distância de edição limitada a 1 — cobre erros de digitação simples. */
function pertoUmaLetra(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false
  let i = 0
  let j = 0
  let diferencas = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++
      j++
      continue
    }
    if (++diferencas > 1) return false
    if (a.length > b.length) i++
    else if (a.length < b.length) j++
    else {
      i++
      j++
    }
  }
  return diferencas + (a.length - i) + (b.length - j) <= 1
}

type Indexado = {
  protocolo: Protocolo
  titulo: string
  palavras: string[]
  secundario: string
}

const indice: Indexado[] = protocolos.map((protocolo) => ({
  protocolo,
  titulo: normalizar(`${protocolo.titulo} ${protocolo.complemento}`),
  palavras: protocolo.palavrasChave.map(normalizar),
  secundario: normalizar(
    `${protocolo.descricao} ${protocolo.relacoes} ${protocolo.sugestao} ${protocolo.notaAplicacao}`,
  ),
}))

/** Pontua um item para um único termo. 0 significa que o termo não apareceu. */
function pontuar(item: Indexado, termo: string) {
  if (item.titulo === termo) return 14
  if (new RegExp(`\\b${termo}`).test(item.titulo)) return 12
  if (item.titulo.includes(termo)) return 9

  let melhor = 0
  for (const palavra of item.palavras) {
    if (palavra === termo) melhor = Math.max(melhor, 10)
    else if (new RegExp(`\\b${termo}`).test(palavra)) melhor = Math.max(melhor, 8)
    else if (palavra.includes(termo)) melhor = Math.max(melhor, 6)
  }
  if (melhor) return melhor

  if (item.secundario.includes(termo)) return 3

  // só então tentamos tolerar erro de digitação, e apenas em palavras longas
  if (termo.length >= 5) {
    const candidatas = [...item.titulo.split(' '), ...item.palavras.flatMap((p) => p.split(' '))]
    if (candidatas.some((c) => c.length >= 4 && pertoUmaLetra(c, termo))) return 5
  }

  return 0
}

export type Resultado = {
  protocolo: Protocolo
  pontuacao: number
  /** Quantos termos da busca este protocolo atendeu. */
  termosAtendidos: number
  /** Quantos termos a busca tinha ao todo. */
  totalDeTermos: number
  /** Fração dos termos atendidos, de 0 a 1 — é o "percentual de combinação". */
  combinacao: number
}

/**
 * Busca por texto livre e/ou palavras-chave selecionadas.
 * Ordena primeiro por quantos termos o protocolo atende, depois pela pontuação.
 */
export function buscar(consulta: string, chavesSelecionadas: string[] = []): Resultado[] {
  const grupos = [...tokenizar(consulta), ...chavesSelecionadas.flatMap((c) => tokenizar(c))]

  // dois termos digitados podem expandir para o mesmo grupo; contar uma vez só
  const vistos = new Set<string>()
  const unicos = grupos.filter((g) => {
    const id = g.join('|')
    if (vistos.has(id)) return false
    vistos.add(id)
    return true
  })

  if (unicos.length === 0) {
    return indice.map((item) => ({
      protocolo: item.protocolo,
      pontuacao: 0,
      termosAtendidos: 0,
      totalDeTermos: 0,
      combinacao: 0,
    }))
  }

  const resultados: Resultado[] = []
  for (const item of indice) {
    let pontuacao = 0
    let termosAtendidos = 0
    for (const grupo of unicos) {
      // o termo digitado vale cheio; sinônimo vale um pouco menos
      const p = Math.max(
        pontuar(item, grupo[0]),
        ...grupo.slice(1).map((s) => pontuar(item, s) * 0.8),
      )
      if (p > 0) {
        pontuacao += p
        termosAtendidos++
      }
    }
    if (termosAtendidos > 0) {
      resultados.push({
        protocolo: item.protocolo,
        pontuacao,
        termosAtendidos,
        totalDeTermos: unicos.length,
        combinacao: termosAtendidos / unicos.length,
      })
    }
  }

  return resultados.sort(
    (a, b) =>
      b.termosAtendidos - a.termosAtendidos ||
      b.pontuacao - a.pontuacao ||
      a.protocolo.numero - b.protocolo.numero,
  )
}
