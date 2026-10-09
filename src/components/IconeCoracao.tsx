/**
 * O coração dos favoritos, igual em todas as telas. Herda a cor do texto ao
 * redor (todos os lugares onde aparece já são `text-chip`) e o tamanho da
 * fonte, para ficar alinhado com a palavra ao lado.
 *
 * `vazio` é o contorno do "ainda não favoritado"; sem ele, o coração é cheio.
 */
export default function IconeCoracao({
  vazio = false,
  className = '',
}: {
  vazio?: boolean
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`inline-block size-[1.1em] shrink-0 align-[-0.15em] ${className}`}
      fill={vazio ? 'none' : 'currentColor'}
      stroke="currentColor"
      strokeWidth={vazio ? 2 : 0}
      strokeLinejoin="round"
    >
      <path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
    </svg>
  )
}
