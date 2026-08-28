import type { Composicao } from '@/lib/composicao'

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  COMPOSIÇÃO DOS PROTOCOLOS DO LIVRO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Quais hexagramas formam o desenho de cada um dos 101 protocolos.
 * Assim que um protocolo aparece aqui, a tela deixa de mostrar o recorte do
 * PDF e passa a desenhar em SVG — nítido em qualquer tamanho e com os
 * aminoácidos identificados.
 *
 * Os que ainda não estão aqui continuam com a imagem do livro, que está certa.
 *
 * ── Como escrever ─────────────────────────────────────────────────────────
 *
 * Cada posição aceita, o que for mais cômodo:
 *
 *     'Metionina'  nome do aminoácido — só quando ele tem um único códon
 *     'AUG'        o códon
 *     41           o número do hexagrama no arranjo do Rei Wen
 *     '110001'     as seis linhas, de baixo para cima
 *
 * Dois arranjos:
 *
 *     bagua   { centro: 'AUG', anel: [ ...8 posições... ] }
 *             ordem do anel: NO, N, NE, O, L, SO, S, SE
 *             quando o livro não desenha hexagrama no centro e sim pontos,
 *             o centro vira { pontos: 5 }
 *
 *     linha   { arranjo: 'linha', hexagramas: [ ...da esquerda p/ a direita... ] }
 */
export const COMPOSICOES: Record<number, Composicao> = {
  // 01 · Aftas — código em linha: lisina e glutamina, cada uma com seus dois
  // hexagramas, agrupados. Da esquerda para a direita na imagem do livro:
  // hexagramas 1, 14, 13 e 30.
  1: {
    arranjo: 'linha',
    hexagramas: ['AAA', 'AAG', 'CAA', 'CAG'],
  },

  // 02 · Alcoolismo — metionina no centro; a partir do norte, no sentido horário:
  // triptofano, cisteína, ácido glutâmico, metionina e glutamina. Cada aminoácido
  // entra com todos os seus códons, na ordem canônica da terceira base (U, C, A, G),
  // o que fecha as oito posições. A leitura da imagem do livro confirmou N, L, S, O
  // e o centro; os quatro cantos a 45° a regra completa.
  //
  //            NO  CAG      N  UGG      NE  UGU
  //             O  CAA       (AUG)       L  UGC
  //            SO  AUG       S  GAG      SE  GAA
  2: {
    centro: 'AUG',
    anel: ['CAG', 'UGG', 'UGU', 'CAA', 'UGC', 'AUG', 'GAG', 'GAA'],
  },

  // 03 · Alergias de Pele — metionina no centro; a partir do norte, no sentido horário:
  // cisteína, tirosina, histidina e lisina. Quatro aminoácidos de dois códons cada,
  // fechando as oito posições. Transcrito da leitura da imagem do livro, com as nove
  // posições lidas e as famílias de aminoácidos completas.
  //
  //            NO  AAG      N  UGC      NE  UGU
  //             O  AAA       (AUG)       L  UAC
  //            SO  CAU       S  CAC      SE  UAU
  3: {
    centro: 'AUG',
    anel: ['AAG', 'UGC', 'UGU', 'AAA', 'UAC', 'CAU', 'CAC', 'UAU'],
  },

  // 04 · Alergias Respiratórias — metionina no centro; horário a partir do norte:
  // cisteína, tirosina, cisteína, tirosina — os dois aminoácidos repetem, reforçando.
  // Seis das oito posições foram lidas da imagem e batem com esse padrão; SO e NO
  // estavam ilegíveis e foram completadas por ele.
  //            NO  UAU      N  UGC      NE  UGU
  //             O  UAC       (AUG)       L  UAC
  //            SO  UGU       S  UGC      SE  UAU
  4: {
    centro: 'AUG',
    anel: ['UAU', 'UGC', 'UGU', 'UAC', 'UAC', 'UGU', 'UGC', 'UAU'],
  },

  // 05 · Alopecia — metionina no centro; horário a partir do norte:
  // cisteína, lisina, cisteína, lisina — os dois aminoácidos voltam, reforçando.
  // Sete posições lidas da imagem; SO estava ilegível e foi completada pelo bloco
  // da cisteína, que exige os dois códons juntos.
  //            NO  AAG      N  UGC      NE  UGU
  //             O  AAA       (AUG)       L  AAA
  //            SO  UGC       S  UGU      SE  AAG
  5: {
    centro: 'AUG',
    anel: ['AAG', 'UGC', 'UGU', 'AAA', 'AAA', 'UGC', 'UGU', 'AAG'],
  },

  // 06 · Amigdalite — código em linha: cisteína e glutamina, cada uma com seus
  // dois hexagramas, agrupados. Da esquerda para a direita na imagem do livro:
  // hexagramas 16, 45, 13 e 30. Os quatro glifos foram lidos e conferidos.
  6: {
    arranjo: 'linha',
    hexagramas: ['UGU', 'UGC', 'CAA', 'CAG'],
  },

  // 07 · Anemia — metionina no centro; horário a partir do norte:
  // arginina, glutamina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAG      N  AGA      NE  CGC
  //             O  CAA       (AUG)       L  CGG
  //            SO  CGU       S  AGG      SE  CGA
  7: {
    centro: 'AUG',
    anel: ['CAG', 'AGA', 'CGC', 'CAA', 'CGG', 'CGU', 'AGG', 'CGA'],
  },

  // 08 · Ansiedade — código em linha, cinco hexagramas: fenilalanina (UUU, UUC),
  // tirosina (UAC, UAU) e triptofano (UGG). No livro estão em duas fileiras, mas
  // formam uma sequência só. Os cinco glifos foram lidos e conferidos.
  8: {
    arranjo: 'linha',
    hexagramas: [
      ['UUU', 'UUC'],
      ['UAC', 'UAU', 'UGG'],
    ],
  },

  // 09 · Apneia do Sono — triptofano no centro; horário a partir do norte:
  // fenilalanina, cisteína, cisteína, cisteína — a cisteína entra três vezes,
  // reforçando. Sequência ditada; 7 das 9 posições conferidas contra a imagem,
  // e o norte conferido a olho (as seis barras partidas = UUU).
  //            NO  UGC      N  UUU      NE  UUC
  //             O  UGU       (UGG)       L  UGU
  //            SO  UGC       S  UGU      SE  UGC
  9: {
    centro: 'UGG',
    anel: ['UGC', 'UUU', 'UUC', 'UGU', 'UGU', 'UGC', 'UGU', 'UGC'],
  },

  // 10 · Arritmia — no lugar do hexagrama do centro, cinco pontos: um no meio e
  // quatro em cruz. Não se sabe ainda o que dizem; entram como estão no livro e a
  // assinatura os chama de "Centro". Horário a partir do norte: ácido glutâmico,
  // histidina, lisina, triptofano, metionina. Transcrito da imagem do livro, as
  // 8 posições do anel conferidas.
  //
  //            NO  AUG       N  GAA      NE  GAG
  //             O  UGG    (5 pontos)      L  CAC
  //            SO  AAG       S  AAA      SE  CAU
  10: {
    centro: { pontos: 5 },
    anel: ['AUG', 'GAA', 'GAG', 'UGG', 'CAC', 'AAG', 'AAA', 'CAU'],
  },

  // 11 · Arteriosclerose — metionina no centro; treonina sozinha no anel, dando duas
  // voltas. Os quatro códons no horário a partir do norte — ACA, ACC, ACU, ACG — e o
  // mesmo giro de novo, o que deixa o desenho simétrico a 180°. É a mesma ordem em que
  // a treonina aparece nos protocolos 25 e 68. Transcrito da imagem do livro,
  // 9 de 9 posições conferidas.
  //            NO  ACG      N  ACA      NE  ACC
  //             O  ACU       (AUG)       L  ACU
  //            SO  ACC       S  ACA      SE  ACG
  11: {
    centro: 'AUG',
    anel: ['ACG', 'ACA', 'ACC', 'ACU', 'ACU', 'ACC', 'ACA', 'ACG'],
  },

  // 12 · Artrite — cinco pontos no centro, como na Arritmia. Horário a partir do norte:
  // prolina com os quatro códons (CCG, CCU, CCA, CCC — a mesma ordem do protocolo 39) e
  // lisina, que fecha as outras quatro posições dando duas voltas nos seus dois códons.
  // Transcrito da imagem do livro, as 8 posições do anel conferidas.
  //
  //            NO  AAG       N  CCG      NE  CCU
  //             O  AAA    (5 pontos)      L  CCA
  //            SO  AAG       S  AAA      SE  CCC
  12: {
    centro: { pontos: 5 },
    anel: ['AAG', 'CCG', 'CCU', 'AAA', 'CCA', 'AAG', 'AAA', 'CCC'],
  },

  // 13 · Asma — metionina no centro; horário a partir do norte:
  // cisteína, arginina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CGU      N  UGU      NE  UGC
  //             O  AGG       (AUG)       L  AGA
  //            SO  CGA       S  CGG      SE  CGC
  13: {
    centro: 'AUG',
    anel: ['CGU', 'UGU', 'UGC', 'AGG', 'AGA', 'CGA', 'CGG', 'CGC'],
  },

  // 14 · Aumento da Função Pulmonar — metionina no centro; horário a partir do norte:
  // cisteína, leucina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CUA      N  UGU      NE  UGC
  //             O  CUG       (AUG)       L  CUC
  //            SO  CUU       S  UUG      SE  UUA
  14: {
    centro: 'AUG',
    anel: ['CUA', 'UGU', 'UGC', 'CUG', 'CUC', 'CUU', 'UUG', 'UUA'],
  },

  // 15 · Bronquite — metionina no centro; horário a partir do norte: cisteína, lisina,
  // histidina, tirosina. Quatro aminoácidos de dois códons cada, fechando as oito
  // posições. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  UAU      N  UGU      NE  UGC
  //             O  UAC       (AUG)       L  AAA
  //            SO  CAU       S  CAC      SE  AAG
  15: {
    centro: 'AUG',
    anel: ['UAU', 'UGU', 'UGC', 'UAC', 'AAA', 'CAU', 'CAC', 'AAG'],
  },

  // 16 · Cãibras — código em linha, três hexagramas: metionina (AUG) e lisina
  // (AAA, AAG). Da esquerda para a direita na imagem do livro; os três glifos
  // foram lidos e conferidos.
  16: {
    arranjo: 'linha',
    hexagramas: ['AUG', 'AAA', 'AAG'],
  },

  // 17 · Cálculos Renais — triptofano no centro; horário a partir do norte: cisteína e
  // leucina, esta com os seis códons. É o mesmo anel do protocolo 14, que troca só o
  // centro (lá, metionina) — foi o que confirmou o sul, o único glifo que a imagem não
  // entregou limpo. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CUA      N  UGU      NE  UGC
  //             O  CUG       (UGG)       L  CUC
  //            SO  CUU       S  UUG      SE  UUA
  17: {
    centro: 'UGG',
    anel: ['CUA', 'UGU', 'UGC', 'CUG', 'CUC', 'CUU', 'UUG', 'UUA'],
  },

  // 18 · Câncer — metionina no centro; horário a partir do norte: arginina, com os seis
  // códons, e ácido glutâmico. Mesmo anel de arginina dos protocolos 7 e 41, que no
  // lugar do ácido glutâmico trazem glutamina. Transcrito da imagem do livro,
  // 9 de 9 posições conferidas.
  //            NO  GAG      N  AGA      NE  CGC
  //             O  GAA       (AUG)       L  CGG
  //            SO  CGU       S  AGG      SE  CGA
  18: {
    centro: 'AUG',
    anel: ['GAG', 'AGA', 'CGC', 'GAA', 'CGG', 'CGU', 'AGG', 'CGA'],
  },

  // 19 · Cáries — o anel é o mesmo da Arteriosclerose: treonina sozinha, dando duas
  // voltas nos seus quatro códons. O que muda é o centro — isoleucina (AUC), e não a
  // metionina de sempre. Conferi o glifo do centro ampliado: AUC e AUG diferem só nas
  // duas linhas de cima. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  ACG      N  ACA      NE  ACC
  //             O  ACU       (AUC)       L  ACU
  //            SO  ACC       S  ACA      SE  ACG
  19: {
    centro: 'AUC',
    anel: ['ACG', 'ACA', 'ACC', 'ACU', 'ACU', 'ACC', 'ACA', 'ACG'],
  },

  // 20 · Ciatalgia — o único até aqui com duas partes: o bagua e, embaixo à direita,
  // uma dupla de hexagramas solta. No bagua, triptofano no centro e, no horário a partir
  // do norte, glutamina e lisina dando duas voltas — CAA, CAG, AAG, AAA e de novo. O
  // complemento traz isoleucina (AUC) e leucina (CUA). Transcrito da imagem do livro,
  // 11 de 11 glifos conferidos; o norte e as duas laterais foram lidos ampliados, porque
  // os respingos dos vizinhos atrapalhavam a leitura automática.
  //
  //            NO  AAA       N  CAA      NE  CAG
  //             O  AAG       (UGG)        L  AAG
  //            SO  CAG       S  CAA      SE  AAA
  //                      complemento: AUC  CUA
  20: {
    centro: 'UGG',
    anel: ['AAA', 'CAA', 'CAG', 'AAG', 'AAG', 'CAG', 'CAA', 'AAA'],
    complemento: ['AUC', 'CUA'],
  },

  // 21 · Cicatrização — metionina no centro; horário a partir do norte: valina e prolina,
  // cada uma com os seus quatro códons. A valina entra na mesma ordem dos protocolos 24 e
  // 58, e a prolina na dos protocolos 12 e 39. Transcrito da imagem do livro, 9 de 9
  // posições conferidas — o sul foi lido ampliado.
  //            NO  CCC      N  GUG      NE  GUU
  //             O  CCA       (AUG)       L  GUC
  //            SO  CCU       S  CCG      SE  GUA
  21: {
    centro: 'AUG',
    anel: ['CCC', 'GUG', 'GUU', 'CCA', 'GUC', 'CCU', 'CCG', 'GUA'],
  },

  // 22 · Cicatrização Óssea — metionina no centro; horário a partir do norte:
  // leucina, lisina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  AAG      N  CUC      NE  UUA
  //             O  AAA       (AUG)       L  UUG
  //            SO  CUA       S  CUG      SE  CUU
  22: {
    centro: 'AUG',
    anel: ['AAG', 'CUC', 'UUA', 'AAA', 'UUG', 'CUA', 'CUG', 'CUU'],
  },

  // 23 · Cirrose Hepática — metionina no centro; horário a partir do norte: fenilalanina,
  // ácido glutâmico, isoleucina (com os três códons) e triptofano. Quatro famílias
  // completas fechando as oito posições. Transcrito da imagem do livro, 9 de 9 posições
  // conferidas.
  //            NO  UGG      N  UUU      NE  UUC
  //             O  AUA       (AUG)       L  GAA
  //            SO  AUC       S  AUU      SE  GAG
  23: {
    centro: 'AUG',
    anel: ['UGG', 'UUU', 'UUC', 'AUA', 'GAA', 'AUC', 'AUU', 'GAG'],
  },

  // 24 · Cirurgias Dentárias — triptofano no centro; horário a partir do norte:
  // valina, histidina, tirosina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  UAU      N  GUG      NE  GUU
  //             O  UAC       (UGG)       L  GUC
  //            SO  CAU       S  CAC      SE  GUA
  24: {
    centro: 'UGG',
    anel: ['UAU', 'GUG', 'GUU', 'UAC', 'GUC', 'CAU', 'CAC', 'GUA'],
  },

  // 25 · Colesterol — metionina no centro; horário a partir do norte:
  // glicina, treonina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  ACG      N  GGA      NE  GGU
  //             O  ACU       (AUG)       L  GGC
  //            SO  ACC       S  ACA      SE  GGG
  25: {
    centro: 'AUG',
    anel: ['ACG', 'GGA', 'GGU', 'ACU', 'GGC', 'ACC', 'ACA', 'GGG'],
  },

  // 26 · Compulsões Alimentares — triptofano no centro; horário a partir do norte:
  // fenilalanina, alanina (com os quatro códons) e glutamina. Transcrito da imagem do
  // livro, 9 de 9 posições conferidas.
  //            NO  CAG      N  UUU      NE  UUC
  //             O  CAA       (UGG)       L  GCG
  //            SO  GCA       S  GCC      SE  GCU
  26: {
    centro: 'UGG',
    anel: ['CAG', 'UUU', 'UUC', 'CAA', 'GCG', 'GCA', 'GCC', 'GCU'],
  },

  // 27 · Concentração — triptofano no centro; horário a partir do norte:
  // alanina, glutamina, tirosina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  UAU      N  GCG      NE  GCU
  //             O  UAC       (UGG)       L  GCC
  //            SO  CAG       S  CAA      SE  GCA
  27: {
    centro: 'UGG',
    anel: ['UAU', 'GCG', 'GCU', 'UAC', 'GCC', 'CAG', 'CAA', 'GCA'],
  },

  // 28 · Contusão — o anel não é de hexagramas, e sim dos oito trigramas do bagua:
  // Montanha nos quatro pontos cardeais e Fogo nos quatro cantos. Trigrama tem três
  // linhas e não fecha um códon, então não tem aminoácido — o único do desenho é a
  // leucina do centro. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  ☲ Fogo         N  ☶ Montanha    NE  ☲ Fogo
  //             O  ☶ Montanha       (CUA)           L  ☶ Montanha
  //            SO  ☲ Fogo         S  ☶ Montanha    SE  ☲ Fogo
  28: {
    centro: 'CUA',
    anel: ['Fogo', 'Montanha', 'Fogo', 'Montanha', 'Montanha', 'Fogo', 'Montanha', 'Fogo'],
  },

  // 29 · Covid-19 (nutrição do paciente) — metionina no centro; horário a partir do norte:
  // cisteína, glicina com os quatro códons e glutamina. A glicina entra na mesma ordem do
  // protocolo 25. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAG      N  UGU      NE  UGC
  //             O  CAA       (AUG)       L  GGA
  //            SO  GGG       S  GGC      SE  GGU
  29: {
    centro: 'AUG',
    anel: ['CAG', 'UGU', 'UGC', 'CAA', 'GGA', 'GGG', 'GGC', 'GGU'],
  },

  // 30 · Covid-19 (proteção contra danos) — desenho igual ao do protocolo 18: metionina no
  // centro, arginina com os seis códons e ácido glutâmico. Transcrito da imagem do livro,
  // 9 de 9 posições conferidas.
  //            NO  GAG      N  AGA      NE  CGC
  //             O  GAA       (AUG)       L  CGG
  //            SO  CGU       S  AGG      SE  CGA
  30: {
    centro: 'AUG',
    anel: ['GAG', 'AGA', 'CGC', 'GAA', 'CGG', 'CGU', 'AGG', 'CGA'],
  },

  // 31 · Crescimento Infantil — triptofano no centro; glutamina e lisina dando duas voltas,
  // no horário a partir do norte: CAA, CAG, AAA, AAG e de novo. É o anel da Ciatalgia com
  // a lisina espelhada, e sem o complemento em linha. Transcrito da imagem do livro,
  // 9 de 9 posições conferidas.
  //            NO  AAG      N  CAA      NE  CAG
  //             O  AAA       (UGG)       L  AAA
  //            SO  CAG       S  CAA      SE  AAG
  31: {
    centro: 'UGG',
    anel: ['AAG', 'CAA', 'CAG', 'AAA', 'AAA', 'CAG', 'CAA', 'AAG'],
  },

  // 32 · Dedo em Gatilho — não é bagua nem fileira de hexagramas: são dois trigramas,
  // Fogo e Trovão, que no livro aparecem apontados para os lados dos dedos. Onde desenhar
  // está na nota de aplicação do protocolo. Os dois glifos foram lidos e conferidos.
  32: {
    arranjo: 'linha',
    hexagramas: ['Fogo', 'Trovão'],
  },

  // 33 · Dengue — metionina no centro; horário a partir do norte: fenilalanina e arginina,
  // esta com os seis códons. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CGU      N  UUU      NE  UUC
  //             O  AGG       (AUG)       L  AGA
  //            SO  CGA       S  CGG      SE  CGC
  33: {
    centro: 'AUG',
    anel: ['CGU', 'UUU', 'UUC', 'AGG', 'AGA', 'CGA', 'CGG', 'CGC'],
  },

  // 34 · Dependência Química — triptofano no centro; horário a partir do norte: tirosina,
  // fenilalanina, glutamina e histidina. Quatro famílias de dois códons cada, fechando as
  // oito posições. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAU      N  UAC      NE  UAU
  //             O  CAC       (UGG)       L  UUU
  //            SO  CAG       S  CAA      SE  UUC
  34: {
    centro: 'UGG',
    anel: ['CAU', 'UAC', 'UAU', 'CAC', 'UUU', 'CAG', 'CAA', 'UUC'],
  },

  // 35 · Depressão — triptofano no centro; horário a partir do norte: glutamina,
  // fenilalanina, ácido glutâmico e tirosina. Mesma armação da Dependência Química,
  // trocando histidina por ácido glutâmico e a ordem dos pares. Transcrito da imagem do
  // livro, 9 de 9 posições conferidas.
  //            NO  UAU      N  CAA      NE  CAG
  //             O  UAC       (UGG)       L  UUU
  //            SO  GAG       S  GAA      SE  UUC
  35: {
    centro: 'UGG',
    anel: ['UAU', 'CAA', 'CAG', 'UAC', 'UUU', 'GAG', 'GAA', 'UUC'],
  },

  // 36 · Depressão Pós-parto — triptofano no centro; horário a partir do norte:
  // glutamina, arginina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CGU      N  CAA      NE  CAG
  //             O  AGG       (UGG)       L  AGA
  //            SO  CGA       S  CGG      SE  CGC
  36: {
    centro: 'UGG',
    anel: ['CGU', 'CAA', 'CAG', 'AGG', 'AGA', 'CGA', 'CGG', 'CGC'],
  },

  // 37 · Desnutrição — o centro não é metionina nem triptofano: é prolina (CCU), o terceiro
  // centro diferente que aparece, depois da isoleucina das Cáries. Conferi o glifo ampliado.
  // Horário a partir do norte: valina com os quatro códons, ácido glutâmico e glutamina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAG      N  GUG      NE  GUU
  //             O  CAA       (CCU)       L  GUC
  //            SO  GAG       S  GAA      SE  GUA
  37: {
    centro: 'CCU',
    anel: ['CAG', 'GUG', 'GUU', 'CAA', 'GUC', 'GAG', 'GAA', 'GUA'],
  },

  // 38 · Diabetes — metionina no centro; horário a partir do norte: glutamina, alanina
  // com os quatro códons e lisina. Transcrito da imagem do livro, 9 de 9 posições
  // conferidas.
  //            NO  AAG      N  CAA      NE  CAG
  //             O  AAA       (AUG)       L  GCG
  //            SO  GCA       S  GCC      SE  GCU
  38: {
    centro: 'AUG',
    anel: ['AAG', 'CAA', 'CAG', 'AAA', 'GCG', 'GCA', 'GCC', 'GCU'],
  },

  // 39 · Dores Articulares — metionina no centro; horário a partir do norte:
  // prolina, lisina, histidina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAU      N  CCG      NE  CCU
  //             O  CAC       (AUG)       L  CCA
  //            SO  AAG       S  AAA      SE  CCC
  39: {
    centro: 'AUG',
    anel: ['CAU', 'CCG', 'CCU', 'CAC', 'CCA', 'AAG', 'AAA', 'CCC'],
  },

  // 40 · Dores Musculares — metionina no centro; horário a partir do norte: glutamina,
  // lisina e glicina com os quatro códons. Transcrito da imagem do livro, 9 de 9
  // posições conferidas.
  //            NO  GGG      N  CAA      NE  CAG
  //             O  GGC       (AUG)       L  AAA
  //            SO  GGU       S  GGA      SE  AAG
  40: {
    centro: 'AUG',
    anel: ['GGG', 'CAA', 'CAG', 'GGC', 'AAA', 'GGU', 'GGA', 'AAG'],
  },

  // 41 · Dormências — metionina no centro; horário a partir do norte:
  // arginina, glutamina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAG      N  AGA      NE  CGC
  //             O  CAA       (AUG)       L  CGG
  //            SO  CGU       S  AGG      SE  CGA
  41: {
    centro: 'AUG',
    anel: ['CAG', 'AGA', 'CGC', 'CAA', 'CGG', 'CGU', 'AGG', 'CGA'],
  },

  // 42 · Eliminação de Toxinas — metionina no centro; horário a partir do norte: cisteína,
  // glicina com os quatro códons e ácido glutâmico. Transcrito da imagem do livro,
  // 9 de 9 posições conferidas.
  //            NO  GAG      N  UGU      NE  UGC
  //             O  GAA       (AUG)       L  GGA
  //            SO  GGG       S  GGC      SE  GGU
  42: {
    centro: 'AUG',
    anel: ['GAG', 'UGU', 'UGC', 'GAA', 'GGA', 'GGG', 'GGC', 'GGU'],
  },

  // 43 · Esporão — duas partes: bagua de trigramas com cinco pontos no centro, Montanha
  // nos quatro pontos cardeais e Trovão nos quatro cantos; e uma fileira de fenilalanina
  // e glutamina. No livro a fileira vem acima do bagua; aqui ela entra como complemento,
  // desenhada embaixo — é a ordem padrão do app para os desenhos de duas partes.
  // Transcrito da imagem do livro, 9 de 9 posições e os 4 glifos da fileira conferidos.
  //            NO  Trovão      N  Montanha   NE  Trovão
  //             O  Montanha  (5 pontos)       L  Montanha
  //            SO  Trovão      S  Montanha   SE  Trovão
  //                    complemento: UUU  UUC  CAA  CAG
  43: {
    centro: { pontos: 5 },
    anel: ['Trovão', 'Montanha', 'Trovão', 'Montanha', 'Montanha', 'Trovão', 'Montanha', 'Trovão'],
    complemento: ['UUU', 'UUC', 'CAA', 'CAG'],
  },

  // 44 · Fala — metionina no centro; horário a partir do norte:
  // triptofano, cisteína, ácido glutâmico, metionina, glutamina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAG      N  UGG      NE  UGU
  //             O  CAA       (AUG)       L  UGC
  //            SO  AUG       S  GAG      SE  GAA
  44: {
    centro: 'AUG',
    anel: ['CAG', 'UGG', 'UGU', 'CAA', 'UGC', 'AUG', 'GAG', 'GAA'],
  },

  // 45 · Felicidade — um hexagrama só, desenhado grande, ocupando o quadro inteiro:
  // UGG, o triptofano. É o aminoácido do eixo da serotonina, o mesmo que ocupa o centro
  // de 24 protocolos do livro. Lido e conferido.
  45: {
    arranjo: 'linha',
    hexagramas: ['UGG'],
  },

  // 51 · Fobias — o centro é UAA, um códon de parada: não codifica aminoácido nenhum, é o
  // sinal de encerrar a síntese. Único centro assim no livro, e conferi o glifo ampliado.
  // Horário a partir do norte: triptofano e fenilalanina, alternando em duas voltas.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  UGG       N  UGG       NE  UUU
  //             O  UUC       (UAA)       L  UUC
  //            SO  UUU       S  UGG       SE  UGG
  51: {
    centro: 'UAA',
    anel: ['UGG', 'UGG', 'UUU', 'UUC', 'UUC', 'UUU', 'UGG', 'UGG'],
  },

  // 49 · Flatulências — um trigrama só, o Trovão, desenhado em volta do ponto que dói,
  // na região abdominal. No livro ele aparece dos dois lados de um mesmo ponto, com setas
  // apontando para o meio; é um glifo só, repetido em volta. Onde desenhar está na nota de
  // aplicação do protocolo.
  49: {
    arranjo: 'linha',
    hexagramas: ['Trovão'],
  },

  // 50 · Flora Intestinal — triptofano no centro; horário a partir do norte: glutamina e treonina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  ACG       N  CAA       NE  CAG
  //             O  ACU       (UGG)       L  CAA
  //            SO  ACC       S  ACA       SE  CAG
  50: {
    centro: 'UGG',
    anel: ['ACG', 'CAA', 'CAG', 'ACU', 'CAA', 'ACC', 'ACA', 'CAG'],
  },

  // 46 · Fertilidade Feminina — mesmo bagua da Fertilidade Masculina: prolina (CCU) no
  // centro, Terra nos quatro pontos cardeais e Montanha nos quatro cantos. Muda só o
  // complemento, que aqui é a lisina com os seus dois códons. No livro a dupla fica no
  // canto de cima; aqui entra embaixo, a ordem padrão do app. Transcrito da imagem do
  // livro, 9 de 9 posições e os 2 glifos da fileira conferidos.
  //            NO  Montanha    N  Terra      NE  Montanha
  //             O  Terra        (CCU)         L  Terra
  //            SO  Montanha    S  Terra      SE  Montanha
  //                      complemento: AAA  AAG
  46: {
    centro: 'CCU',
    anel: ['Montanha', 'Terra', 'Montanha', 'Terra', 'Terra', 'Montanha', 'Terra', 'Montanha'],
    complemento: ['AAA', 'AAG'],
  },

  // 47 · Fertilidade Masculina — duas partes: bagua de trigramas com prolina (CCU) no
  // centro, Terra nos quatro pontos cardeais e Montanha nos quatro cantos; e uma fileira
  // de ácido aspártico, lisina e metionina. No livro a fileira vem acima do bagua; aqui
  // entra como complemento, desenhada embaixo — a ordem padrão do app.
  // Transcrito da imagem do livro, 9 de 9 posições e os 5 glifos da fileira conferidos.
  //            NO  Montanha    N  Terra      NE  Montanha
  //             O  Terra        (CCU)         L  Terra
  //            SO  Montanha    S  Terra      SE  Montanha
  //              complemento: GAC  GAU  AAA  AAG  AUG
  47: {
    centro: 'CCU',
    anel: ['Montanha', 'Terra', 'Montanha', 'Terra', 'Terra', 'Montanha', 'Terra', 'Montanha'],
    complemento: ['GAC', 'GAU', 'AAA', 'AAG', 'AUG'],
  },

  // 48 · Fibromialgia — triptofano no centro; horário a partir do norte: lisina e serina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  AGC       N  AAA       NE  AAG
  //             O  AGU       (UGG)       L  UCU
  //            SO  UCA       S  UCG       SE  UCC
  48: {
    centro: 'UGG',
    anel: ['AGC', 'AAA', 'AAG', 'AGU', 'UCU', 'UCA', 'UCG', 'UCC'],
  },

  // 52 · Garganta — código em linha, três hexagramas: triptofano (UGG) e lisina
  // (AAA, AAG). Da esquerda para a direita na imagem do livro; os três glifos foram
  // lidos e conferidos.
  52: {
    arranjo: 'linha',
    hexagramas: ['UGG', 'AAA', 'AAG'],
  },

  // 56 · Hemorragias — cinco pontos no centro; anel de trigramas, Lago nos quatro pontos
  // cardeais e Montanha nos quatro cantos. O complemento é a lisina com os seus dois
  // códons; no livro ela fica no canto de cima, aqui entra embaixo, a ordem padrão do app.
  // Transcrito da imagem do livro, 9 de 9 posições e os 2 glifos da fileira conferidos.
  //            NO  Montanha    N  Lago     NE  Montanha
  //             O  Lago      (5 pontos)     L  Lago
  //            SO  Montanha    S  Lago     SE  Montanha
  //                     complemento: AAA  AAG
  56: {
    centro: { pontos: 5 },
    anel: ['Montanha', 'Lago', 'Montanha', 'Lago', 'Lago', 'Montanha', 'Lago', 'Montanha'],
    complemento: ['AAA', 'AAG'],
  },

  // 57 · Hemorroidas — triptofano no centro; horário a partir do norte: treonina e lisina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  AAG       N  ACA       NE  ACC
  //             O  AAA       (UGG)       L  ACU
  //            SO  AAG       S  AAA       SE  ACG
  57: {
    centro: 'UGG',
    anel: ['AAG', 'ACA', 'ACC', 'AAA', 'ACU', 'AAG', 'AAA', 'ACG'],
  },

  // 55 · Hematomas — como a Contusão: anel de trigramas em volta de um hexagrama. Leucina
  // no centro, Fogo nos quatro pontos cardeais e Trovão nos quatro cantos. Muda só o par
  // de trigramas — lá é Montanha e Fogo. Transcrito da imagem do livro, 9 de 9 posições
  // conferidas.
  //            NO  Trovão    N  Fogo      NE  Trovão
  //             O  Fogo      (CUA)       L  Fogo
  //            SO  Trovão    S  Fogo      SE  Trovão
  55: {
    centro: 'CUA',
    anel: ['Trovão', 'Fogo', 'Trovão', 'Fogo', 'Fogo', 'Trovão', 'Fogo', 'Trovão'],
  },

  // 54 · Gastrointestinal — metionina no centro; horário a partir do norte: fenilalanina, treonina e histidina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAU       N  UUU       NE  UUC
  //             O  CAC       (AUG)       L  ACA
  //            SO  ACG       S  ACU       SE  ACC
  54: {
    centro: 'AUG',
    anel: ['CAU', 'UUU', 'UUC', 'CAC', 'ACA', 'ACG', 'ACU', 'ACC'],
  },

  // 53 · Gastrite — metionina no centro; horário a partir do norte: fenilalanina, histidina, fenilalanina e histidina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAU       N  UUU       NE  UUC
  //             O  CAC       (AUG)       L  CAC
  //            SO  UUC       S  UUU       SE  CAU
  53: {
    centro: 'AUG',
    anel: ['CAU', 'UUU', 'UUC', 'CAC', 'CAC', 'UUC', 'UUU', 'CAU'],
  },

  // 58 · Hepatite — metionina no centro; horário a partir do norte:
  // valina, lisina, tirosina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  UAU      N  GUG      NE  GUU
  //             O  UAC       (AUG)       L  GUC
  //            SO  AAG       S  AAA      SE  GUA
  58: {
    centro: 'AUG',
    anel: ['UAU', 'GUG', 'GUU', 'UAC', 'GUC', 'AAG', 'AAA', 'GUA'],
  },

  // 59 · Hérnia de Disco — leucina (CUA) no centro; no anel, Fogo e Montanha alternando
  // no horário a partir do norte: Fogo nos quatro pontos cardeais, Montanha nos quatro
  // cantos. É o espelho da Contusão, que tem a mesma leucina no centro mas com os dois
  // trigramas trocados de lugar. No livro o desenho vem sobre a radiografia da coluna,
  // que indica onde aplicar. Ditado e conferido contra a imagem do livro, 9 de 9 posições.
  //            NO  Montanha    N  Fogo      NE  Montanha
  //             O  Fogo         (CUA)        L  Fogo
  //            SO  Montanha    S  Fogo      SE  Montanha
  59: {
    centro: 'CUA',
    anel: ['Montanha', 'Fogo', 'Montanha', 'Fogo', 'Fogo', 'Montanha', 'Fogo', 'Montanha'],
  },

  // 60 · Herpes — código em linha, quatro hexagramas: lisina (AAA, AAG) e glutamina
  // (CAA, CAG). É o mesmo código das Aftas, o protocolo 1. Os quatro glifos foram
  // lidos e conferidos.
  60: {
    arranjo: 'linha',
    hexagramas: ['AAA', 'AAG', 'CAA', 'CAG'],
  },

  // 65 · Insônia — triptofano no centro; horário a partir do norte: fenilalanina, glutamina e prolina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CCC       N  UUU       NE  UUC
  //             O  CCA       (UGG)       L  CAA
  //            SO  CCU       S  CCG       SE  CAG
  65: {
    centro: 'UGG',
    anel: ['CCC', 'UUU', 'UUC', 'CCA', 'CAA', 'CCU', 'CCG', 'CAG'],
  },

  // 64 · Indisposição — triptofano no centro; horário a partir do norte: fenilalanina, ácido glutâmico e treonina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  ACG       N  UUU       NE  UUC
  //             O  ACU       (UGG)       L  GAA
  //            SO  ACC       S  ACA       SE  GAG
  64: {
    centro: 'UGG',
    anel: ['ACG', 'UUU', 'UUC', 'ACU', 'GAA', 'ACC', 'ACA', 'GAG'],
  },

  // 63 · Imunidade — metionina no centro; horário a partir do norte: histidina, glutamina, lisina e ácido glutâmico.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  GAG       N  CAU       NE  CAC
  //             O  GAA       (AUG)       L  CAA
  //            SO  AAG       S  AAA       SE  CAG
  63: {
    centro: 'AUG',
    anel: ['GAG', 'CAU', 'CAC', 'GAA', 'CAA', 'AAG', 'AAA', 'CAG'],
  },

  // 62 · HIV — metionina no centro; horário a partir do norte: glicina, cisteína e histidina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAU       N  GGA       NE  GGU
  //             O  CAC       (AUG)       L  GGC
  //            SO  UGC       S  UGU       SE  GGG
  62: {
    centro: 'AUG',
    anel: ['CAU', 'GGA', 'GGU', 'CAC', 'GGC', 'UGC', 'UGU', 'GGG'],
  },

  // 61 · Hiperatividade — triptofano no centro; horário a partir do norte: fenilalanina e leucina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CUA       N  UUU       NE  UUC
  //             O  CUG       (UGG)       L  CUC
  //            SO  CUU       S  UUG       SE  UUA
  61: {
    centro: 'UGG',
    anel: ['CUA', 'UUU', 'UUC', 'CUG', 'CUC', 'CUU', 'UUG', 'UUA'],
  },

  // 66 · Intolerância à Lactose — triptofano no centro; horário a partir do norte:
  // glutamina, arginina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CGU      N  CAA      NE  CAG
  //             O  AGG       (UGG)       L  AGA
  //            SO  CGA       S  CGG      SE  CGC
  66: {
    centro: 'UGG',
    anel: ['CGU', 'CAA', 'CAG', 'AGG', 'AGA', 'CGA', 'CGG', 'CGC'],
  },

  // 67 · Intolerância ao Glúten — metionina no centro e prolina sozinha no anel, dando duas
  // voltas nos seus quatro códons, como a treonina faz nos protocolos 11 e 19.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CCC       N  CCG       NE  CCU
  //             O  CCA       (AUG)       L  CCA
  //            SO  CCU       S  CCG       SE  CCC
  67: {
    centro: 'AUG',
    anel: ['CCC', 'CCG', 'CCU', 'CCA', 'CCA', 'CCU', 'CCG', 'CCC'],
  },

  // 68 · Labirintite — metionina no centro; horário a partir do norte:
  // ácido aspártico, ácido glutâmico, treonina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  ACG      N  GAC      NE  GAU
  //             O  ACU       (AUG)       L  GAA
  //            SO  ACC       S  ACA      SE  GAG
  68: {
    centro: 'AUG',
    anel: ['ACG', 'GAC', 'GAU', 'ACU', 'GAA', 'ACC', 'ACA', 'GAG'],
  },

  // 69 · Libido — metionina no centro; horário a partir do norte: fenilalanina e arginina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CGU       N  UUU       NE  UUC
  //             O  AGG       (AUG)       L  AGA
  //            SO  CGA       S  CGG       SE  CGC
  69: {
    centro: 'AUG',
    anel: ['CGU', 'UUU', 'UUC', 'AGG', 'AGA', 'CGA', 'CGG', 'CGC'],
  },

  // 70 · Lúpus — metionina no centro e o mesmo anel da Menopausa: arginina com os seis
  // códons e lisina. O complemento traz o ácido glutâmico; no livro ele fica no canto de
  // baixo, à direita, e aqui entra embaixo do bagua, a ordem padrão do app.
  // Transcrito da imagem do livro, 9 de 9 posições e os 2 glifos da fileira conferidos.
  //            NO  AAG      N  AGA      NE  CGC
  //             O  AAA       (AUG)       L  CGG
  //            SO  CGU       S  AGG      SE  CGA
  //                  complemento: GAA  GAG
  70: {
    centro: 'AUG',
    anel: ['AAG', 'AGA', 'CGC', 'AAA', 'CGG', 'CGU', 'AGG', 'CGA'],
    complemento: ['GAA', 'GAG'],
  },

  // 71 · Mal-estar — código em linha de três trigramas, não de hexagramas: Montanha,
  // Vento e Fogo. Sem hexagrama, não há aminoácido neste protocolo. Os três glifos
  // foram lidos e conferidos.
  71: {
    arranjo: 'linha',
    hexagramas: ['Montanha', 'Vento', 'Fogo'],
  },

  // 72 · Memória — triptofano no centro; horário a partir do norte: fenilalanina e serina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  AGC       N  UUU       NE  UUC
  //             O  AGU       (UGG)       L  UCU
  //            SO  UCA       S  UCG       SE  UCC
  72: {
    centro: 'UGG',
    anel: ['AGC', 'UUU', 'UUC', 'AGU', 'UCU', 'UCA', 'UCG', 'UCC'],
  },

  // 73 · Menopausa — metionina no centro; horário a partir do norte:
  // arginina, lisina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  AAG      N  AGA      NE  CGC
  //             O  AAA       (AUG)       L  CGG
  //            SO  CGU       S  AGG      SE  CGA
  73: {
    centro: 'AUG',
    anel: ['AAG', 'AGA', 'CGC', 'AAA', 'CGG', 'CGU', 'AGG', 'CGA'],
  },

  // 74 · Náusea — triptofano no centro; horário a partir do norte:
  // arginina, histidina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAU      N  AGA      NE  CGC
  //             O  CAC       (UGG)       L  CGG
  //            SO  CGU       S  AGG      SE  CGA
  74: {
    centro: 'UGG',
    anel: ['CAU', 'AGA', 'CGC', 'CAC', 'CGG', 'CGU', 'AGG', 'CGA'],
  },

  // 75 · Nodulações — código em linha, quatro hexagramas: triptofano (UGG), lisina
  // (AAA, AAG) e metionina (AUG). Os quatro glifos foram lidos e conferidos.
  75: {
    arranjo: 'linha',
    hexagramas: ['UGG', 'AAA', 'AAG', 'AUG'],
  },

  // 78 · Paralisias Locais — mesmo bagua do Esporão: cinco pontos no centro, Montanha nos
  // quatro pontos cardeais e Trovão nos quatro cantos. Muda o complemento, que aqui é a
  // glutamina. No livro a dupla fica no canto de baixo; aqui entra embaixo do bagua.
  // Transcrito da imagem do livro, 9 de 9 posições e os 2 glifos da fileira conferidos.
  //            NO  Trovão      N  Montanha   NE  Trovão
  //             O  Montanha  (5 pontos)       L  Montanha
  //            SO  Trovão      S  Montanha   SE  Trovão
  //                    complemento: CAA  CAG
  78: {
    centro: { pontos: 5 },
    anel: ['Trovão', 'Montanha', 'Trovão', 'Montanha', 'Montanha', 'Trovão', 'Montanha', 'Trovão'],
    complemento: ['CAA', 'CAG'],
  },

  // 79 · Parkinson — leucina no centro; horário a partir do norte: glicina, triptofano, tirosina e triptofano.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  UGG       N  GGA       NE  GGU
  //             O  UAC       (CUA)       L  GGC
  //            SO  UAU       S  UGG       SE  GGG
  79: {
    centro: 'CUA',
    anel: ['UGG', 'GGA', 'GGU', 'UAC', 'GGC', 'UAU', 'UGG', 'GGG'],
  },

  // 77 · Osteoporose — prolina no centro; horário a partir do norte: fenilalanina e leucina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CUA       N  UUU       NE  UUC
  //             O  CUG       (CCU)       L  CUC
  //            SO  CUU       S  UUG       SE  UUA
  77: {
    centro: 'CCU',
    anel: ['CUA', 'UUU', 'UUC', 'CUG', 'CUC', 'CUU', 'UUG', 'UUA'],
  },

  // 76 · Obesidade — triptofano no centro; horário a partir do norte: ácido glutâmico e serina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  AGC       N  GAA       NE  GAG
  //             O  AGU       (UGG)       L  UCU
  //            SO  UCA       S  UCG       SE  UCC
  76: {
    centro: 'UGG',
    anel: ['AGC', 'GAA', 'GAG', 'AGU', 'UCU', 'UCA', 'UCG', 'UCC'],
  },

  // 80 · Picada de Inseto — um trigrama só, desenhado grande: Fogo. Não tem hexagrama,
  // logo não tem aminoácido. Onde desenhar está na nota de aplicação. Lido e conferido.
  80: {
    arranjo: 'linha',
    hexagramas: ['Fogo'],
  },

  // 86 · Saúde da Próstata — metionina no centro; horário a partir do norte: glicina e alanina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  GCA       N  GGA       NE  GGU
  //             O  GCC       (AUG)       L  GGC
  //            SO  GCU       S  GCG       SE  GGG
  86: {
    centro: 'AUG',
    anel: ['GCA', 'GGA', 'GGU', 'GCC', 'GGC', 'GCU', 'GCG', 'GGG'],
  },

  // 85 · Ressaca — metionina no centro; horário a partir do norte: alanina, cisteína e glutamina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAG       N  GCG       NE  GCU
  //             O  CAA       (AUG)       L  GCC
  //            SO  UGC       S  UGU       SE  GCA
  85: {
    centro: 'AUG',
    anel: ['CAG', 'GCG', 'GCU', 'CAA', 'GCC', 'UGC', 'UGU', 'GCA'],
  },

  // 83 · Queimadura — dois baguas, e não um. No livro eles aparecem na diagonal, um
  // encostado no outro; aqui saem empilhados, o primeiro em cima do segundo, que é a
  // ordem padrão do app. O primeiro repete o desenho da Anemia: metionina no centro,
  // arginina com os seis códons e glutamina. O segundo tem triptofano no centro, com
  // cisteína e lisina dando duas voltas cada. Os dois glifos da diagonal onde as rosetas
  // se encontram — CGA e AAG — foram lidos ampliados, e cada um fecha a família do seu
  // bagua. Transcrito da imagem do livro, 18 de 18 posições conferidas.
  //
  //   primeiro   NO  CAG      N  AGA      NE  CGC
  //               O  CAA       (AUG)       L  CGG
  //              SO  CGU       S  AGG      SE  CGA
  //
  //   segundo    NO  AAG      N  UGU      NE  UGC
  //               O  AAA       (UGG)       L  UGU
  //              SO  AAG       S  AAA      SE  UGC
  83: {
    centro: 'AUG',
    anel: ['CAG', 'AGA', 'CGC', 'CAA', 'CGG', 'CGU', 'AGG', 'CGA'],
    segundo: {
      centro: 'UGG',
      anel: ['AAG', 'UGU', 'UGC', 'AAA', 'UGU', 'AAG', 'AAA', 'UGC'],
    },
  },

  // 84 · Resfriado — metionina no centro; horário a partir do norte: cisteína e histidina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAU       N  UGU       NE  UGC
  //             O  CAC       (AUG)       L  UGU
  //            SO  CAU       S  CAC       SE  UGC
  84: {
    centro: 'AUG',
    anel: ['CAU', 'UGU', 'UGC', 'CAC', 'UGU', 'CAU', 'CAC', 'UGC'],
  },

  // 82 · Proteção Contra Danos do AVC — metionina no centro; horário a partir do norte: arginina e cisteína.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  UGC       N  AGA       NE  CGC
  //             O  UGU       (AUG)       L  CGG
  //            SO  CGU       S  AGG       SE  CGA
  82: {
    centro: 'AUG',
    anel: ['UGC', 'AGA', 'CGC', 'UGU', 'CGG', 'CGU', 'AGG', 'CGA'],
  },

  // 81 · Pressão Alta — triptofano no centro; horário a partir do norte: fenilalanina, alanina e histidina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAU       N  UUU       NE  UUC
  //             O  CAC       (UGG)       L  GCG
  //            SO  GCA       S  GCC       SE  GCU
  81: {
    centro: 'UGG',
    anel: ['CAU', 'UUU', 'UUC', 'CAC', 'GCG', 'GCA', 'GCC', 'GCU'],
  },

  // 87 · Sinusite — código em linha, quatro hexagramas: lisina (AAG), metionina (AUG),
  // triptofano (UGG) e lisina de novo (AAA). A lisina abre e fecha a fileira, em vez de
  // vir com os dois códons juntos — é o que está desenhado, conferido glifo a glifo.
  87: {
    arranjo: 'linha',
    hexagramas: ['AAG', 'AUG', 'UGG', 'AAA'],
  },

  // 90 · Tabagismo — metionina no centro; horário a partir do norte: ácido glutâmico, glutamina, histidina e fenilalanina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  UUC       N  GAA       NE  GAG
  //             O  UUU       (AUG)       L  CAA
  //            SO  CAU       S  CAC       SE  CAG
  90: {
    centro: 'AUG',
    anel: ['UUC', 'GAA', 'GAG', 'UUU', 'CAA', 'CAU', 'CAC', 'CAG'],
  },

  // 88 · Soluço — cinco pontos no centro e os oito trigramas do anel todos iguais:
  // Montanha, no horário a partir do norte até fechar a volta. Nenhum hexagrama, logo
  // nenhum aminoácido. No livro o desenho vem sobre a foto do peito, que indica onde
  // aplicar. Ditado, e conferido contra a imagem do livro.
  //            NO  Montanha    N  Montanha   NE  Montanha
  //             O  Montanha  (5 pontos)       L  Montanha
  //            SO  Montanha    S  Montanha   SE  Montanha
  88: {
    centro: { pontos: 5 },
    anel: [
      'Montanha',
      'Montanha',
      'Montanha',
      'Montanha',
      'Montanha',
      'Montanha',
      'Montanha',
      'Montanha',
    ],
  },

  // 89 · Surto Psicótico — cinco pontos no centro e triptofano nas oito posições do anel:
  // um códon só, repetido a volta inteira. É o desenho mais concentrado do livro.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  UGG       N  UGG       NE  UGG
  //             O  UGG       (5 pontos)  L  UGG
  //            SO  UGG       S  UGG       SE  UGG
  89: {
    centro: { pontos: 5 },
    anel: ['UGG', 'UGG', 'UGG', 'UGG', 'UGG', 'UGG', 'UGG', 'UGG'],
  },

  // 91 · Tendinite — triptofano no centro; horário a partir do norte:
  // lisina, leucina. Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CUA      N  AAA      NE  AAG
  //             O  CUG       (UGG)       L  CUC
  //            SO  CUU       S  UUG      SE  UUA
  91: {
    centro: 'UGG',
    anel: ['CUA', 'AAA', 'AAG', 'CUG', 'CUC', 'CUU', 'UUG', 'UUA'],
  },
  // 101 · Visão — metionina no centro; horário a partir do norte: cisteína, ácido glutâmico e glicina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  GGG       N  UGU       NE  UGC
  //             O  GGC       (AUG)       L  GAA
  //            SO  GGU       S  GGA       SE  GAG
  101: {
    centro: 'AUG',
    anel: ['GGG', 'UGU', 'UGC', 'GGC', 'GAA', 'GGU', 'GGA', 'GAG'],
  },

  // 99 · Túnel do Carpo — código em linha de seis trigramas: Terra, Montanha e Fogo,
  // repetidos na mesma ordem. Não há hexagrama, logo não há aminoácido. No livro os seis
  // vêm empilhados na vertical, ao longo do punho, sobre a foto da mão; aqui saem numa
  // fileira, que é como o app desenha os códigos em linha — a sequência é a mesma.
  // Ditado.
  99: {
    arranjo: 'linha',
    hexagramas: ['Terra', 'Montanha', 'Fogo', 'Terra', 'Montanha', 'Fogo'],
  },

  // 100 · Vias Urinárias — metionina no centro; horário a partir do norte: alanina, triptofano
  // e isoleucina com os três códons. O bloco da alanina atravessa o norte — começa no sudoeste
  // e termina no norte —, por isso a leitura a partir do norte o parte em dois.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  GCA       N  GCU       NE  UGG
  //             O  GCC       (AUG)       L  AUU
  //            SO  GCG       S  AUC       SE  AUA
  100: {
    centro: 'AUG',
    anel: ['GCA', 'GCU', 'UGG', 'GCC', 'AUU', 'GCG', 'AUC', 'AUA'],
  },

  // 98 · Trombose — metionina no centro; horário a partir do norte: prolina, ácido glutâmico e glutamina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  CAG       N  CCG       NE  CCU
  //             O  CAA       (AUG)       L  CCA
  //            SO  GAG       S  GAA       SE  CCC
  98: {
    centro: 'AUG',
    anel: ['CAG', 'CCG', 'CCU', 'CAA', 'CCA', 'GAG', 'GAA', 'CCC'],
  },

  // 97 · Transtornos Alimentares — triptofano no centro; horário a partir do norte: fenilalanina, tirosina e valina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  GUA       N  UUU       NE  UUC
  //             O  GUC       (UGG)       L  UAC
  //            SO  GUU       S  GUG       SE  UAU
  97: {
    centro: 'UGG',
    anel: ['GUA', 'UUU', 'UUC', 'GUC', 'UAC', 'GUU', 'GUG', 'UAU'],
  },

  // 96 · Transpiração Excessiva — metionina no centro; horário a partir do norte: fenilalanina, glicina e tirosina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  UAU       N  UUU       NE  UUC
  //             O  UAC       (AUG)       L  GGA
  //            SO  GGG       S  GGC       SE  GGU
  96: {
    centro: 'AUG',
    anel: ['UAU', 'UUU', 'UUC', 'UAC', 'GGA', 'GGG', 'GGC', 'GGU'],
  },

  // 94 · Tosse — cinco pontos no centro e cisteína sozinha no anel, alternando os dois
  // códons a volta inteira: UGU, UGC, quatro vezes. Transcrito da imagem do livro,
  // 9 de 9 posições conferidas.
  //            NO  UGC       N  UGU      NE  UGC
  //             O  UGU    (5 pontos)      L  UGU
  //            SO  UGC       S  UGU      SE  UGC
  94: {
    centro: { pontos: 5 },
    anel: ['UGC', 'UGU', 'UGC', 'UGU', 'UGU', 'UGC', 'UGU', 'UGC'],
  },

  // 95 · TPM — triptofano no centro; horário a partir do norte: glutamina, tirosina e valina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  GUA       N  CAA       NE  CAG
  //             O  GUC       (UGG)       L  UAU
  //            SO  GUU       S  GUG       SE  UAC
  95: {
    centro: 'UGG',
    anel: ['GUA', 'CAA', 'CAG', 'GUC', 'UAU', 'GUU', 'GUG', 'UAC'],
  },

  // 93 · Tireoide — metionina no centro; horário a partir do norte: cisteína, tirosina, fenilalanina e lisina.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  AAG       N  UGU       NE  UGC
  //             O  AAA       (AUG)       L  UAC
  //            SO  UUC       S  UUU       SE  UAU
  93: {
    centro: 'AUG',
    anel: ['AAG', 'UGU', 'UGC', 'AAA', 'UAC', 'UUC', 'UUU', 'UAU'],
  },

  // 92 · Timidez Infantil — triptofano no centro; horário a partir do norte, o ácido glutâmico
  // dá três voltas nos seus dois códons e a fenilalanina fecha com os dois dela.
  // Transcrito da imagem do livro, 9 de 9 posições conferidas.
  //            NO  UUC       N  GAA       NE  GAG
  //             O  UUU       (UGG)       L  GAA
  //            SO  GAG       S  GAA       SE  GAG
  92: {
    centro: 'UGG',
    anel: ['UUC', 'GAA', 'GAG', 'UUU', 'GAA', 'GAG', 'GAA', 'GAG'],
  },

}
