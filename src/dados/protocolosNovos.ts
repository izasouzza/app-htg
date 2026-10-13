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

  // 103 · Hormonal — metionina no centro; horário a partir do norte: cisteína, glicina
  // com os quatro códons e glutamina — o mesmo arranjo do Covid-19 (29), com a glicina
  // na ordem canônica. A taurina não tem códon: entra pela cisteína, que com a metionina
  // do centro é de onde o corpo a faz, e a página do protocolo a anuncia sozinha
  // (derivados.ts). Transcrito do desenho enviado, 9 de 9 posições conferidas.
  //
  //            NO  CAG      N  UGU      NE  UGC
  //             O  CAA       (AUG)       L  GGU
  //            SO  GGG       S  GGA      SE  GGC
  {
    numero: 103,
    titulo: 'Hormonal',
    palavrasChave: [
      'Ciclo menstrual desregulado',
      'Muito fluxo menstrual',
      'Pouco fluxo menstrual',
    ],
    indicacao:
      'o ciclo menstrual desregulado, e para o fluxo menstrual em excesso ou escasso',
    categorias: ['mulher'],
    composicao: {
      centro: 'AUG',
      anel: ['CAG', 'UGU', 'UGC', 'CAA', 'GGU', 'GGG', 'GGA', 'GGC'],
    },
  },

  // 104 · Bruxismo — metionina no centro; horário a partir do norte: glicina com os
  // quatro códons, triptofano e taurina. A glicina gira na ordem do livro (protocolos
  // 29, 42 e 62); a taurina entra pela metionina e pela cisteína, lado a lado, o que
  // fecha as oito posições.
  //
  //            NO  UGC      N  GGA      NE  GGU
  //             O  UGU       (AUG)       L  GGC
  //            SO  AUG       S  UGG      SE  GGG
  {
    numero: 104,
    titulo: 'Bruxismo',
    palavrasChave: ['Bruxismo', 'Contração muscular', 'Mandíbula presa', 'ATM', 'DTM'],
    indicacao:
      'o bruxismo e a mandíbula presa, e para a contração muscular que vem com a ATM e a DTM',
    categorias: ['neuromuscular', 'dores'],
    composicao: {
      centro: 'AUG',
      anel: ['UGC', 'GGA', 'GGU', 'UGU', 'GGC', 'AUG', 'UGG', 'GGG'],
    },
  },

  // 105 · Hipertensão — metionina no centro; glicina sozinha no anel, dando duas voltas
  // nos seus quatro códons, como a treonina na Arteriosclerose (11) — o desenho fica
  // simétrico a 180°. A arginina, com os seis códons, vai para o complemento.
  //
  //            NO  GGG      N  GGA      NE  GGU
  //             O  GGC       (AUG)       L  GGC
  //            SO  GGU       S  GGA      SE  GGG
  //              complemento: CGU  CGC  CGA  CGG  AGA  AGG
  {
    numero: 105,
    titulo: 'Hipertensão',
    palavrasChave: ['Hipertensão', 'Pressão alta'],
    categorias: ['circulacao'],
    composicao: {
      centro: 'AUG',
      anel: ['GGG', 'GGA', 'GGU', 'GGC', 'GGC', 'GGU', 'GGA', 'GGG'],
      complemento: ['CGU', 'CGC', 'CGA', 'CGG', 'AGA', 'AGG'],
    },
  },

  // 106 · Otite — metionina no centro; horário a partir do norte: glutamina (CAA),
  // arginina (CGG), glicina com os quatro códons e cisteína. Transcrito do desenho
  // enviado, 9 de 9 posições conferidas. A cisteína com a metionina do centro forma
  // a taurina, que a página do protocolo anuncia sozinha (derivados.ts).
  //
  //            NO  UGC      N  CAA      NE  CGG
  //             O  UGU       (AUG)       L  GGU
  //            SO  GGG       S  GGA      SE  GGC
  {
    numero: 106,
    titulo: 'Otite',
    palavrasChave: ['Otite', 'Dor de ouvido', 'Infecção de ouvido'],
    categorias: ['cabeca'],
    composicao: {
      centro: 'AUG',
      anel: ['UGC', 'CAA', 'CGG', 'UGU', 'GGU', 'GGG', 'GGA', 'GGC'],
    },
  },

  // 107 · Desidrose — metionina no centro; horário a partir do norte: glutamina, lisina,
  // cisteína e fenilalanina, quatro aminoácidos de dois códons cada, fechando as oito
  // posições. Transcrito do desenho enviado, 9 de 9 posições conferidas. A cisteína com
  // a metionina do centro forma a taurina, que a página anuncia sozinha (derivados.ts).
  //
  //            NO  UUC      N  CAA      NE  CAG
  //             O  UUU       (AUG)       L  AAA
  //            SO  UGC       S  UGU      SE  AAG
  {
    numero: 107,
    titulo: 'Desidrose',
    palavrasChave: ['Desidrose', 'Bolhas nas mãos', 'Bolhas nos pés', 'Coceira'],
    categorias: ['pele'],
    composicao: {
      centro: 'AUG',
      anel: ['UUC', 'CAA', 'CAG', 'UUU', 'AAA', 'UGC', 'UGU', 'AAG'],
    },
  },

  // 108 · Artrite Reumatoide — dois baguas, ambos com metionina no centro; no desenho
  // enviado ficam lado a lado e aqui o segundo entra embaixo, a ordem padrão do app.
  // Transcrito do desenho, 18 de 18 posições conferidas. Horário a partir do norte:
  //
  //   primeiro   glicina com os quatro códons, glutamina e cisteína
  //              NO  UGC      N  GGU      NE  GGC
  //               O  UGU       (AUG)       L  GGA
  //              SO  CAG       S  CAA      SE  GGG
  //
  //   segundo    arginina com os seis códons e lisina
  //              NO  AAG      N  CGU      NE  CGC
  //               O  AAA       (AUG)       L  CGA
  //              SO  AGG       S  AGA      SE  CGG
  {
    numero: 108,
    titulo: 'Artrite Reumatoide',
    palavrasChave: ['Artrite reumatoide', 'Dor nas articulações', 'Inflamação', 'Rigidez', 'Reumatismo'],
    categorias: ['dores'],
    composicao: {
      centro: 'AUG',
      anel: ['UGC', 'GGU', 'GGC', 'UGU', 'GGA', 'CAG', 'CAA', 'GGG'],
      segundo: {
        centro: 'AUG',
        anel: ['AAG', 'CGU', 'CGC', 'AAA', 'CGA', 'AGG', 'AGA', 'CGG'],
      },
    },
  },

  // 109 · Amenorreia e Endometriose — triptofano no centro; horário a partir do norte:
  // glutamina, tirosina e valina com os quatro códons, na ordem em que o desenho os
  // traz (GUG, GUU, GUC, GUA). Transcrito do desenho enviado, 9 de 9 posições conferidas.
  //
  //            NO  GUA      N  CAA      NE  CAG
  //             O  GUC       (UGG)       L  UAU
  //            SO  GUU       S  GUG      SE  UAC
  {
    numero: 109,
    titulo: 'Amenorreia e Endometriose',
    palavrasChave: ['Amenorreia', 'Endometriose', 'Ausência de menstruação', 'Cólica'],
    categorias: ['mulher'],
    composicao: {
      centro: 'UGG',
      anel: ['GUA', 'CAA', 'CAG', 'GUC', 'UAU', 'GUU', 'GUG', 'UAC'],
    },
  },

  // 110 · Analgésico Energético — código em linha, três fileiras, transcritas do desenho
  // enviado na ordem em que ele as traz (15 de 15 glifos conferidos):
  //
  //     AUG · UUU UUC · UAC UAU          metionina, fenilalanina e tirosina
  //     GGA GGU GGC GGG                  glicina
  //     CUC UUA UUG CUU CUG CUA          leucina
  {
    numero: 110,
    titulo: 'Analgésico Energético',
    complemento: 'Todos os tipos de dores',
    palavrasChave: ['Dor', 'Dores', 'Analgésico', 'Anestésico'],
    indicacao: 'todos os tipos de dores',
    categorias: ['dores'],
    composicao: {
      arranjo: 'linha',
      hexagramas: [
        ['AUG', 'UUU', 'UUC', 'UAC', 'UAU'],
        ['GGA', 'GGU', 'GGC', 'GGG'],
        ['CUC', 'UUA', 'UUG', 'CUU', 'CUG', 'CUA'],
      ],
    },
  },

  // 111 · Choque Emocional — cinco pontos no centro, como na Arritmia (10), e o
  // triptofano nas oito posições do anel, todas voltadas para o centro. Transcrito do
  // desenho enviado, 8 de 8 glifos conferidos.
  {
    numero: 111,
    titulo: 'Choque Emocional',
    descricao: 'Usado para fortalecer o emocional após grande estresse ou trauma.',
    palavrasChave: ['Choque emocional', 'Trauma', 'Estresse'],
    indicacao: 'fortalecer o emocional após grande estresse ou trauma',
    categorias: ['emocional'],
    composicao: {
      centro: { pontos: 5 },
      anel: ['UGG', 'UGG', 'UGG', 'UGG', 'UGG', 'UGG', 'UGG', 'UGG'],
    },
  },

  // 112 · Desparasitação — metionina no centro; horário a partir do norte: lisina, com
  // os seus dois códons repetidos (AAA, AAG, AAA, AAG), e treonina com os quatro, na
  // mesma ordem da Arteriosclerose (11). Transcrito do desenho enviado, 9 de 9 posições
  // conferidas.
  //
  //            NO  ACG      N  AAA      NE  AAG
  //             O  ACU       (AUG)       L  AAA
  //            SO  ACC       S  ACA      SE  AAG
  {
    numero: 112,
    titulo: 'Desparasitação',
    descricao: 'Usado para tratar problemas com parasitas intestinais, como lombrigas e giárdias.',
    palavrasChave: ['Parasitas intestinais', 'Vermes', 'Lombriga', 'Giárdia'],
    indicacao: 'parasitas intestinais, como lombrigas e giárdias',
    categorias: ['digestao'],
    composicao: {
      centro: 'AUG',
      anel: ['ACG', 'AAA', 'AAG', 'ACU', 'AAA', 'ACC', 'ACA', 'AAG'],
    },
  },
]
