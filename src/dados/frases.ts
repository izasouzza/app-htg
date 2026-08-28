/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  FRASES DE ABERTURA — COLETÂNEA DO I CHING
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Cada frase nasce da imagem clássica de um hexagrama do I Ching — o Livro das
 * Mutações —, o mesmo alfabeto de linhas que desenha os protocolos. Não são
 * traduções literais do texto chinês: são releituras curtas da imagem de cada
 * hexagrama, escritas para caberem numa tela e conversarem com o uso do app.
 * Por isso o crédito na tela diz de que hexagrama a frase veio, e não a
 * apresenta como citação.
 *
 * O campo `hexagrama` é o número no arranjo do Rei Wen. Ele não é decoração: a
 * tela desenha esse hexagrama como marca-d'água atrás da frase, então a pessoa
 * vê o glifo de onde a frase veio.
 *
 * ── Para mexer na coletânea ───────────────────────────────────────────────
 *
 * São oito, uma por tela do carrossel. Trocar uma é trocar a linha inteira;
 * acrescentar ou tirar funciona também — o carrossel gira quantas houver e os
 * indicadores se ajustam sozinhos —, mas oito é o tamanho escolhido: dá volta
 * completa sem cansar e mantém as barrinhas de baixo largas o bastante.
 *
 * O texto cabe até umas 90 letras sem quebrar o cartão. Os gradientes estão
 * alternados de propósito, para que duas telas seguidas não se pareçam.
 */
export const FRASES = [
  {
    texto: 'Repare no que te alimenta — e também no que sai da sua boca.',
    hexagrama: 27,
    nome: 'A Nutrição',
    gradiente: 'linear-gradient(160deg, #14342b 0%, #2f6b4f 55%, #6aa77f 100%)',
  },
  {
    texto: 'A água não força a pedra: contorna. E chega.',
    hexagrama: 29,
    nome: 'O Abismal',
    gradiente: 'linear-gradient(160deg, #0f2f4c 0%, #1b5f8f 55%, #4a9fd0 100%)',
  },
  {
    texto: 'No fundo do inverno a luz já virou. Todo retorno começa invisível.',
    hexagrama: 24,
    nome: 'O Retorno',
    gradiente: 'linear-gradient(160deg, #3d2b56 0%, #6b4a8f 55%, #a887c9 100%)',
  },
  {
    texto: 'As nuvens já estão no céu. Esperar com confiança também é agir.',
    hexagrama: 5,
    nome: 'A Espera',
    gradiente: 'linear-gradient(160deg, #7a3b1f 0%, #b8663a 55%, #e0a06a 100%)',
  },
  {
    texto: 'Quando o alto e o baixo se encontram, o corpo acha o seu prumo.',
    hexagrama: 11,
    nome: 'A Paz',
    gradiente: 'linear-gradient(160deg, #0f4c5c 0%, #1b7f8f 55%, #3fb0ab 100%)',
  },
  {
    texto: 'A cidade muda, o poço fica. Volte sempre à sua fonte.',
    hexagrama: 48,
    nome: 'O Poço',
    gradiente: 'linear-gradient(160deg, #3b3524 0%, #6e6440 55%, #a89a66 100%)',
  },
  {
    texto: 'Duas montanhas, uma só quietude. Parar na hora certa também é cuidado.',
    hexagrama: 52,
    nome: 'A Quietude',
    gradiente: 'linear-gradient(160deg, #33333d 0%, #5c5c6b 55%, #92929f 100%)',
  },
  {
    texto: 'Lagos que se tocam não secam. A alegria repartida se renova.',
    hexagrama: 58,
    nome: 'A Alegria',
    gradiente: 'linear-gradient(160deg, #2c3fae 0%, #4f6df5 55%, #7c9bff 100%)',
  },
] as const
