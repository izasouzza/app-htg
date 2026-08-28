import Hexagrama from './Hexagrama'
import Bagua from './Bagua'
import { BASES, basesDoHexagrama } from '@/lib/genetica'
import { ehTrigrama } from '@/lib/composicao'
import type { ComposicaoResolvida, GlifoCodificado } from '@/lib/composicao'

/** Uma ou mais fileiras de hexagramas lado a lado, cada um com o seu códon embaixo. */
function Fileiras({
  fileiras,
  colorido,
  tamanho = 62,
}: {
  fileiras: GlifoCodificado[][]
  colorido: boolean
  tamanho?: number
}) {
  return (
    <>
      {fileiras.map((fila, f) => (
        <div key={f} className="flex flex-wrap items-start justify-center gap-4">
          {fila.map((glifo, i) => (
            <Hexagrama
              key={`${glifo.linhas}-${i}`}
              linhas={glifo.linhas}
              tamanho={tamanho}
              cor="var(--color-tinta)"
              // trigrama não se divide em digramas: sai em tinta cheia
              cores={
                colorido && !ehTrigrama(glifo)
                  ? basesDoHexagrama(glifo.linhas).map((b) => BASES[b].cor)
                  : undefined
              }
              /*
               * O códon e o nome do trigrama saíram de baixo do glifo: a fileira é para
               * copiar com a caneta, e a legenda técnica só atrapalhava. Quem quiser a
               * leitura tem a assinatura energética logo abaixo — e o nome de cada glifo
               * continua aqui, para leitor de tela e para quem passa o cursor.
               */
              titulo={
                ehTrigrama(glifo)
                  ? `Trigrama ${glifo.unicode} ${glifo.nome}`
                  : `Hexagrama ${glifo.numero}, códon ${glifo.codon}`
              }
            />
          ))}
        </div>
      ))}
    </>
  )
}

/** Desenha o protocolo a partir da composição — bagua ou fileira, tudo em SVG. */
export default function DesenhoProtocolo({
  composicao,
  colorido = true,
}: {
  composicao: ComposicaoResolvida
  /** Pinta cada digrama na cor da sua base, como no material do curso. */
  colorido?: boolean
}) {
  if (composicao.arranjo === 'bagua') {
    return (
      <div className="flex flex-col gap-3">
        {/* dois baguas, quando o desenho tem dois, sempre um embaixo do outro */}
        {composicao.rosetas.map((roseta, i) => (
          <Bagua key={i} hexagramas={roseta.anel} centro={roseta.centro} colorido={colorido} />
        ))}
        {/* e o complemento em linha por último, numa caixa própria */}
        {composicao.complemento && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-white p-4">
            <Fileiras fileiras={composicao.complemento} colorido={colorido} tamanho={54} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-white p-5">
      <Fileiras fileiras={composicao.fileiras} colorido={colorido} />
    </div>
  )
}
