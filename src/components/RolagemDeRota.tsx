import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/*
 * Rolagem entre telas.
 *
 * O app é uma página só: quando a rota muda, o navegador troca o conteúdo mas
 * mantém a rolagem onde estava. Era isso que deixava a pessoa no rodapé ao
 * abrir um protocolo a partir do fim da lista — ou ao ir para o próximo
 * protocolo pelo botão do rodapé.
 *
 * A regra aqui é a de app nativo:
 *
 *     ida (PUSH/REPLACE) ... a tela nova começa no alto
 *     volta (POP) .......... devolve a rolagem que a tela tinha ao ser deixada
 *
 * As posições ficam num Map em memória, com a chave que o React Router dá a
 * cada entrada do histórico. Some ao recarregar a página, e tudo bem: aí a
 * tela começa no alto, que é o certo.
 */

const posicoes = new Map<string, number>()

export default function RolagemDeRota() {
  const { key, pathname } = useLocation()
  const tipo = useNavigationType()
  // a chave da tela que está na frente agora — é dela a rolagem que anotamos
  const chaveAtual = useRef(key)
  // a tela anterior, para distinguir "mudou de tela" de "mudou só o filtro na URL"
  const telaAnterior = useRef(pathname)

  // anota a rolagem enquanto a pessoa rola, para haver o que restaurar na volta
  useEffect(() => {
    chaveAtual.current = key

    // o navegador também tenta restaurar sozinho no voltar, e chega antes do
    // conteúdo existir; quem manda na rolagem aqui é este componente
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    function anotar() {
      posicoes.set(chaveAtual.current, window.scrollY)
    }

    window.addEventListener('scroll', anotar, { passive: true })
    return () => {
      anotar()
      window.removeEventListener('scroll', anotar)
    }
  }, [key])

  // antes da pintura, para não piscar o conteúdo na posição errada
  useLayoutEffect(() => {
    const mudouDeTela = telaAnterior.current !== pathname
    telaAnterior.current = pathname

    if (tipo === 'POP') {
      window.scrollTo({ top: posicoes.get(key) ?? 0, left: 0, behavior: 'instant' as ScrollBehavior })
      return
    }

    // a busca guarda os filtros na URL: marcar um sintoma não é trocar de tela,
    // e jogar a pessoa para o alto ali seria só atrapalhar
    if (mudouDeTela) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [key, pathname, tipo])

  return null
}
