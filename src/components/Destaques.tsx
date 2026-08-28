import { useEffect, useRef, useState } from 'react'
import { FRASES } from '@/dados/frases'
import { linhasDoHexagrama } from '@/lib/genetica'
import Hexagrama from './Hexagrama'

const TROCA_AUTOMATICA = 8000

/**
 * Abertura da home: coletânea do I Ching em carrossel, com gradiente de fundo e o
 * hexagrama que inspirou cada frase como marca-d'água. Desliza com o dedo
 * (scroll-snap) e troca sozinha a cada 8 s — a não ser que a pessoa peça menos
 * movimento.
 */
export default function Destaques() {
  const trilho = useRef<HTMLDivElement>(null)
  const [atual, setAtual] = useState(0)
  const [tocado, setTocado] = useState(false)

  function irPara(indice: number) {
    const alvo = trilho.current
    if (!alvo) return
    alvo.scrollTo({ left: alvo.clientWidth * indice, behavior: 'smooth' })
  }

  // troca sozinha até a pessoa deslizar; depois disso o controle é dela
  useEffect(() => {
    if (tocado) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const relogio = setInterval(() => {
      const alvo = trilho.current
      if (!alvo) return
      const proximo = (Math.round(alvo.scrollLeft / alvo.clientWidth) + 1) % FRASES.length
      alvo.scrollTo({ left: alvo.clientWidth * proximo, behavior: 'smooth' })
    }, TROCA_AUTOMATICA)
    return () => clearInterval(relogio)
  }, [tocado])

  return (
    <section
      aria-label="Frases inspiradas no I Ching"
      className="relative md:mx-auto md:max-w-3xl md:px-6 md:pt-6"
    >
      <div
        ref={trilho}
        onScroll={(e) => {
          const alvo = e.currentTarget
          setAtual(Math.round(alvo.scrollLeft / alvo.clientWidth))
        }}
        onPointerDown={() => setTocado(true)}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:rounded-3xl"
      >
        {FRASES.map((frase) => (
          <article
            key={frase.texto}
            className="relative flex min-h-[62vh] w-full shrink-0 snap-center flex-col items-center justify-center overflow-hidden px-8 py-16 text-center md:min-h-[340px]"
            style={{ background: frase.gradiente }}
          >
            {/* marca-d'água: o próprio hexagrama de onde a frase veio */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-5 top-7 opacity-[0.13]"
            >
              <Hexagrama linhas={linhasDoHexagrama(frase.hexagrama)} tamanho={110} cor="#ffffff" />
            </div>

            <p className="relative text-pretty text-[26px] font-semibold leading-snug tracking-tight text-white drop-shadow-sm md:text-3xl">
              {frase.texto}
            </p>

            <span className="relative mt-6 text-xs text-white/70">
              I Ching · hexagrama {frase.hexagrama}, {frase.nome}
            </span>
          </article>
        ))}
      </div>

      {/* indicadores em barrinha; acima dos 28px que a folha branca cobre */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-14 flex justify-center gap-1.5 px-8 md:bottom-10">
        {FRASES.map((frase, i) => (
          <button
            key={frase.texto}
            type="button"
            aria-label={`Ir para a frase ${i + 1}`}
            aria-current={i === atual}
            onClick={() => {
              setTocado(true)
              irPara(i)
            }}
            className={`h-1 flex-1 max-w-16 rounded-full transition-colors ${
              i === atual ? 'bg-white' : 'bg-white/35'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
