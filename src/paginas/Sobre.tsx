import AvisoSaude from '@/components/AvisoSaude'

const PASSOS = [
  {
    titulo: 'Encontre o protocolo',
    texto:
      'Busque pela queixa ou pelo nome do tratamento. As palavras-chave do livro também são pesquisáveis.',
  },
  {
    titulo: 'Desenhe com qualquer caneta',
    texto:
      'Direto na pele, em qualquer parte do corpo. Também funciona desenhado em micropore ou bandagem e depois colado.',
  },
  {
    titulo: 'Onde há local indicado, respeite',
    texto:
      'Protocolos como hérnia de disco e esporão têm efeito melhor desenhados sobre o local afetado. O app avisa quando é o caso.',
  },
]

const DUVIDAS = [
  {
    p: 'Posso usar mais de um protocolo ao mesmo tempo?',
    r: 'Sim, mas o livro recomenda usar o mínimo necessário, para não ser excesso de informação para o corpo.',
  },
  {
    p: 'Por quanto tempo devo permanecer com o protocolo?',
    r: 'Depende do caso: permanência mais longa em quadros crônicos e mais curta em casos agudos.',
  },
  {
    p: 'Serve para água, pets e plantas?',
    r: 'Segundo o livro, sim — desenhado em garrafas, filtros, bebedouros e regadores.',
  },
]

export default function Sobre() {
  return (
    <div className="mx-auto px-5 pt-6 md:max-w-2xl md:px-6 md:pt-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">Sobre</h1>
      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        Este app reúne protocolos de HTG — Hexagrama Terapia Genética, de Marisa Silva, com base
        no livro <em>HTG para Todos</em> para consulta rápida no celular.
      </p>

      <div className="mt-5">
        <AvisoSaude />
      </div>

      <section className="mt-6">
        <h2 className="font-medium">Como usar</h2>
        <ol className="mt-2 space-y-3">
          {PASSOS.map((passo, i) => (
            <li key={passo.titulo} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-chip-forte text-xs font-medium text-white">
                {i + 1}
              </span>
              <span>
                <span className="block text-sm font-medium">{passo.titulo}</span>
                <span className="block text-sm leading-relaxed text-ink-muted">{passo.texto}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <h2 className="font-medium">Dúvidas frequentes</h2>
        <dl className="mt-2 space-y-3">
          {DUVIDAS.map((item) => (
            <div key={item.p} className="rounded-card border border-line p-4">
              <dt className="text-sm font-medium">{item.p}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{item.r}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-6 text-xs leading-relaxed text-ink-muted">
        Conteúdo dos protocolos extraído do livro <em>HTG — Hexagrama Terapia Genética: 101
        Tratamentos</em>, de Marisa Ferreira da Silva. As respostas acima resumem o capítulo
        “Dúvidas Frequentes” do livro.
      </p>
    </div>
  )
}
