import type { Composicao } from '@/lib/composicao'
import type { CategoriaId } from './categorias'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CADASTRO DE NOVOS PROTOCOLOS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Este é o único arquivo que precisa ser editado para acrescentar um protocolo.
 * Ele entra na busca e no índice junto com os 101 do livro, e o desenho é gerado
 * em SVG a partir da composição — não precisa de imagem.
 *
 * ── Como escrever cada posição ────────────────────────────────────────────
 *
 * Três formas equivalentes, use a que for mais cômoda:
 *
 *     'AUG'      o códon (T também funciona no lugar de U)
 *     41         o número do hexagrama no arranjo do Rei Wen
 *     '110001'   as seis linhas, de baixo para cima — 1 é yang, 0 é yin
 *
 * ── A ordem do anel ───────────────────────────────────────────────────────
 *
 * São 8 posições, escritas nesta ordem, como se lê um texto:
 *
 *              NO    N   NE
 *               O   ( )   L          →   ['NO','N','NE','O','L','SO','S','SE']
 *              SO    S   SE
 *
 * O centro vai separado, no campo `centro`.
 *
 * ── Erros ─────────────────────────────────────────────────────────────────
 *
 * Códon inexistente, número fora de 1–64 ou anel com número de posições
 * diferente de 8 param a aplicação com uma mensagem dizendo o que está errado.
 */

export type ProtocoloNovo = {
  /** Continue a partir de 102: os números de 1 a 101 são os do livro. */
  numero: number
  titulo: string
  /** Texto entre parênteses no título, se houver. */
  complemento?: string
  /** Uma linha explicando o protocolo, se ajudar. */
  descricao?: string
  /** Sintomas e sinônimos — é por aqui que a busca encontra o protocolo. */
  palavrasChave: string[]
  /**
   * Completa a frase "Indicado para…". Escreva corrido, sem repetir o "Indicado para".
   * Ex.: 'enxaqueca e dor de cabeça com aura, e para a náusea que a acompanha'.
   * Se não escrever, o texto é montado das palavras-chave.
   */
  indicacao?: string
  /**
   * Grupos em que o protocolo aparece na busca — obrigatório, e pelo menos um.
   * Sem categoria o protocolo sumiria ao filtrar por grupo.
   * Um protocolo pode estar em mais de uma. Os identificadores estão em categorias.ts.
   */
  categorias: CategoriaId[]
  /** Onde desenhar, quando o local importa. Ex.: 'Sobre as vértebras afetadas'. */
  notaAplicacao?: string
  sugestao?: string
  /** Relações energéticas, se quiser registrar. */
  relacoes?: string
  composicao: Composicao
}

export const protocolosNovos: ProtocoloNovo[] = [
  // 102 · Treino Muscular — código em linha com os três aminoácidos de que o corpo
  // faz a creatina: metionina, arginina e glicina. Cada um entra com todos os seus
  // códons, na ordem canônica da terceira base (U, C, A, G), como nos protocolos
  // do livro. Duas fileiras: a metionina abre, a arginina completa a primeira e a
  // glicina fecha embaixo — lê-se como uma sequência só.
  //
  //     AUG · CGU CGC CGA CGG AGA AGG
  //     GGU GGC GGA GGG
  {
    numero: 102,
    titulo: 'Treino Muscular',
    complemento: 'Força e Recuperação',
    descricao:
      'Apoio para quem treina: os três aminoácidos que o corpo combina para fazer ' +
      'creatina, o que sustenta a força no esforço curto e a recuperação depois dele.',
    palavrasChave: [
      'Treino',
      'Musculação',
      'Massa muscular',
      'Recuperação muscular',
      'Dor muscular',
      'Fadiga',
      'Fraqueza',
      'Resistência',
    ],
    indicacao:
      'quem treina e quer sustentar força e massa muscular, e para a dor e a fadiga ' +
      'que vêm depois do esforço',
    categorias: ['neuromuscular', 'circulacao'],
    notaAplicacao: 'Sobre o grupo muscular trabalhado, ou na região lombar antes do treino',
    relacoes:
      'Metionina abre o enxofre e o fígado; arginina abre o vaso pelo óxido nítrico e ' +
      'leva o sangue ao músculo; glicina fecha no colágeno e no descanso.',
    composicao: {
      arranjo: 'linha',
      hexagramas: [
        ['AUG', 'CGU', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG'],
        ['GGU', 'GGC', 'GGA', 'GGG'],
      ],
    },
  },
]
