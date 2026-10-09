import { Link } from 'react-router-dom'
import { protocoloPorNumero } from '@/dados/protocolos'
import { useFavoritos } from '@/lib/favoritos'
import LinhaProtocolo from '@/components/LinhaProtocolo'
import IconeCoracao from '@/components/IconeCoracao'

export default function Favoritos() {
  // um número que deixou de existir nos dados some da lista sem alarde
  const favoritos = useFavoritos().flatMap((n) => protocoloPorNumero(n) ?? [])

  return (
    <div className="px-5 pt-6 md:px-6 md:pt-10">
      <h1 className="text-2xl font-semibold tracking-tight text-ink md:text-4xl">Favoritos</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Os protocolos que você marcou com <IconeCoracao vazio className="text-chip" />, do mais recente ao mais antigo. Ficam guardados
        neste aparelho.
      </p>

      {favoritos.length > 0 ? (
        <div className="mt-4 border-t border-line">
          {favoritos.map((p) => (
            <LinhaProtocolo key={p.numero} protocolo={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-card border border-dashed border-line bg-surface-muted p-6 text-center text-sm text-ink-muted">
          <p>Nenhum favorito ainda.</p>
          <p className="mt-1">
            Abra um protocolo e toque em <strong className="font-medium text-chip">
              <IconeCoracao vazio /> Favoritar
            </strong>{' '}
            no alto da tela.
          </p>
          <Link
            to="/indice"
            className="mt-4 inline-block rounded-full border border-chip px-4 py-1.5 text-chip hover:bg-chip-suave active:bg-chip-suave"
          >
            Ver o índice
          </Link>
        </div>
      )}
    </div>
  )
}
