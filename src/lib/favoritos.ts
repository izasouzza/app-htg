import { useSyncExternalStore } from 'react'

/*
 * Protocolos favoritos.
 *
 * Sem login, o lugar natural é o próprio aparelho: uma lista de números de
 * protocolo no localStorage. No app nativo o WebView guarda esse armazenamento
 * como qualquer navegador. Se ele falhar (aba anônima, cota cheia), os
 * favoritos valem só até fechar o app — nada quebra.
 *
 * Todas as telas leem a mesma lista em memória por useSyncExternalStore, então
 * marcar a estrela num protocolo já atualiza o Índice e a aba de favoritos.
 */

const CHAVE = 'htg:favoritos'

function ler(): number[] {
  try {
    const bruto = JSON.parse(localStorage.getItem(CHAVE) ?? '[]')
    return Array.isArray(bruto) ? bruto.filter((n) => typeof n === 'number') : []
  } catch {
    return []
  }
}

let favoritos: readonly number[] = ler()
const ouvintes = new Set<() => void>()

function gravar(proximos: number[]) {
  favoritos = proximos
  try {
    localStorage.setItem(CHAVE, JSON.stringify(proximos))
  } catch {
    // sem armazenamento: segue valendo em memória
  }
  for (const avisar of ouvintes) avisar()
}

function inscrever(avisar: () => void) {
  ouvintes.add(avisar)
  // outra aba do navegador mexeu na lista
  function deOutraAba(e: StorageEvent) {
    if (e.key !== CHAVE) return
    favoritos = ler()
    avisar()
  }
  window.addEventListener('storage', deOutraAba)
  return () => {
    ouvintes.delete(avisar)
    window.removeEventListener('storage', deOutraAba)
  }
}

/** Liga/desliga o favorito. O mais recente entra no começo da lista. */
export function alternarFavorito(numero: number) {
  gravar(
    favoritos.includes(numero)
      ? favoritos.filter((n) => n !== numero)
      : [numero, ...favoritos],
  )
}

/** Números dos protocolos favoritos, do marcado mais recentemente ao mais antigo. */
export function useFavoritos(): readonly number[] {
  return useSyncExternalStore(inscrever, () => favoritos)
}
