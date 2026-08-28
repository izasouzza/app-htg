/**
 * Palavras-chave do livro que não são sintomas.
 *
 * Servem para filtrar os chips da tela de busca, onde a pessoa escolhe o que está
 * sentindo. Em toda parte elas continuam valendo:
 *
 *   • a BUSCA indexa o vocabulário inteiro — quem digita "dor no joelho" acha Artrite,
 *     quem digita "sangue" acha Anemia;
 *   • a página do protocolo mostra a lista completa, como está no livro.
 */
export const NAO_SAO_SINTOMAS = new Set([
  // partes do corpo e regiões
  'Artérias', 'Boca', 'Braços', 'Cabelo', 'Canal dentário', 'Ciático', 'Coluna', 'Coração',
  'Costas', 'Cotovelos', 'Dedos', 'Dentes', 'Dentes do siso', 'Estômago', 'Garganta', 'Intestino',
  'Joelhos', 'Ligamentos', 'Lombar', 'Mãos', 'Nariz', 'Olhos', 'Ombros', 'Panturrilhas', 'Pele',
  'Pernas', 'Punho', 'Punhos', 'Pés', 'Quadril', 'Rim', 'Sangue', 'Tornozelos', 'Veias', 'Vesícula',

  // substâncias, medidas e funções do organismo
  'Anticorpos', 'Circulação', 'Concentração', 'Coordenação', 'Foco', 'Glicemia', 'Gordura',
  'Hormônios', 'Imunidade', 'Insulina', 'Mobilidade', 'Muco', 'Nutrição', 'Nutrição celular',
  'Resistência', 'Vírus',

  // procedimentos, tratamentos e contextos
  'Câncer (Prevenção)', 'Cirurgias', 'DETOX', 'Desintoxicação', 'Drogas', 'Estudos',
  'Extração dentária', 'Gravidez', 'Pré-operatório', 'Pós-cirúrgico', 'Quimioterapia',
  'Radioterapia', 'Reabilitação', 'Regeneração de tecidos',

  // mecanismos de lesão, não o sintoma em si
  'Pancada', 'Tombo',
])

export function ehSintoma(palavra: string) {
  return !NAO_SAO_SINTOMAS.has(palavra)
}
