/**
 * Liga o jeito como a pessoa fala ao vocabulário do livro.
 * Chave e valores já normalizados (minúsculas, sem acento).
 * Não cria indicações novas: só aponta para termos que já existem nos protocolos.
 */
export const SINONIMOS: Record<string, string[]> = {
  dormir: ['insonia', 'qualidade de sono'],
  sono: ['insonia', 'qualidade de sono'],
  acordando: ['insonia'],
  pesadelo: ['pesadelos'],
  ronca: ['ronco'],
  cabeca: ['cefaleia'],
  enxaqueca: ['cefaleia', 'pressao alta'],
  nervoso: ['ansiedade', 'agitacao'],
  nervosismo: ['ansiedade'],
  agonia: ['ansiedade', 'angustia'],
  panico: ['sindrome do panico'],
  triste: ['depressao', 'melancolia'],
  tristeza: ['depressao', 'melancolia'],
  desanimo: ['depressao', 'apatia'],
  cansado: ['cansaco', 'fraqueza', 'apatia'],
  cansada: ['cansaco', 'fraqueza', 'apatia'],
  esgotado: ['cansaco', 'fraqueza'],
  barriga: ['gastrointestinal', 'desconforto abdominal', 'colica intestinal'],
  intestino: ['constipacao', 'flora intestinal'],
  preso: ['constipacao'],
  prisao: ['constipacao'],
  ventre: ['constipacao'],
  queimacao: ['azia', 'acidez estomacal'],
  estomago: ['gastrite', 'azia'],
  emagrecer: ['obesidade', 'perda de peso'],
  engordar: ['obesidade', 'apetite'],
  cigarro: ['tabagismo', 'vicios'],
  fumar: ['tabagismo', 'vicios'],
  bebida: ['alcoolismo', 'vicios'],
  beber: ['alcoolismo'],
  gripado: ['gripe', 'coriza', 'resfriado'],
  gripada: ['gripe', 'coriza', 'resfriado'],
  nariz: ['coriza', 'congestao nasal', 'rinite'],
  entupido: ['congestao nasal'],
  garganta: ['inflamacao', 'amigdalite', 'faringite'],
  dente: ['dentes', 'caries', 'sensibilidade dentaria'],
  vista: ['olhos', 'visao'],
  enxergar: ['olhos', 'visao'],
  olho: ['olhos'],
  ouvido: ['zumbido', 'labirintose'],
  tonto: ['tontura'],
  tontura: ['tontura', 'labirintose'],
  coceira: ['coceira', 'alergias'],
  espinha: ['pele'],
  menstruacao: ['tpm', 'colica', 'amenorreia'],
  colica: ['colica', 'tpm'],
  engravidar: ['gravidez', 'fertilidade'],
  gravida: ['gravidez'],
  memoria: ['amnesia', 'concentracao'],
  esquecimento: ['amnesia', 'memoria'],
  esquecendo: ['amnesia', 'memoria'],
  concentrar: ['concentracao', 'foco'],
  xixi: ['incontinencia urinaria', 'infeccao urinaria', 'cistite'],
  urina: ['incontinencia urinaria', 'infeccao urinaria', 'cistite'],
  bexiga: ['infeccao urinaria', 'cistite'],
  caimbra: ['caibras'],
  inchado: ['inchaco', 'edemas'],
  inchada: ['inchaco', 'edemas'],
  roxo: ['hematomas'],
  machucado: ['lesoes', 'contusao'],
  torci: ['torcao', 'estiramento'],
  queimei: ['queimadura'],
  picada: ['picada de inseto'],
  suor: ['suor', 'transpiracao'],
  suando: ['suor'],
  calor: ['caloroes'],
  imunidade: ['imunidade', 'anticorpos', 'resistencia'],
  defesa: ['imunidade', 'anticorpos'],
  acucar: ['glicemia', 'insulina', 'diabetes'],
  glicose: ['glicemia', 'insulina'],
  coluna: ['coluna', 'lombar'],
  lombar: ['lombar', 'coluna'],
  joelho: ['joelhos'],
  ombro: ['ombros'],
  pe: ['pes'],
  mao: ['maos'],
  dedo: ['dedos'],
  formigando: ['formigamento', 'dormencias'],
  cabelo: ['queda de cabelo', 'calvicie'],
  unha: ['pele'],
  agitado: ['agitacao', 'hiperatividade'],
  eletrico: ['agitacao', 'hiperatividade'],
  crianca: ['infantil', 'crescimento infantil', 'timidez'],
  filho: ['infantil', 'crescimento infantil'],
  bebe: ['infantil', 'crescimento infantil'],
  timido: ['timidez'],
  vergonha: ['timidez', 'inseguranca'],
  gagueira: ['gagueira', 'disfasia'],
  bravo: ['agressividade'],
  raiva: ['agressividade', 'alteracao de humor'],
  estressado: ['estresse'],
  febre: ['febre', 'mal estar'],
  vomito: ['vomito', 'enjoo', 'nausea'],
  enjoo: ['enjoo', 'nausea'],
  diarreia: ['diarreia'],
  alergia: ['alergias'],
}

/**
 * Busca no mapa tolerando gênero e plural: "nervosa" encontra "nervoso",
 * "joelhos" encontra "joelho".
 */
export function sinonimosDe(termo: string): string[] {
  const variantes = [termo]
  if (termo.endsWith('a')) variantes.push(`${termo.slice(0, -1)}o`)
  if (termo.endsWith('o')) variantes.push(`${termo.slice(0, -1)}a`)
  if (termo.endsWith('s')) {
    const singular = termo.slice(0, -1)
    variantes.push(singular)
    if (singular.endsWith('a')) variantes.push(`${singular.slice(0, -1)}o`)
    if (singular.endsWith('o')) variantes.push(`${singular.slice(0, -1)}a`)
  }
  for (const v of variantes) {
    if (SINONIMOS[v]) return SINONIMOS[v]
  }
  return []
}
