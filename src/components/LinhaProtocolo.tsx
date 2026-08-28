import { Link } from 'react-router-dom'
import type { Protocolo } from '@/dados/protocolos'
import { nomeDaCategoria } from '@/dados/categorias'

/**
 * Protocolo em linha, separado por fio de cabelo — sem caixa e sem miniatura.
 * Título e categoria dividem a mesma linha; as palavras-chave vêm abaixo.
 */
export default function LinhaProtocolo({
  protocolo,
  combinacao,
}: {
  protocolo: Protocolo
  /** Quanto o protocolo combina com o que foi buscado. Ausente quando não há busca. */
  combinacao?: { atendidos: number; total: number }
}) {
  const percentual = combinacao ? Math.round((combinacao.atendidos / combinacao.total) * 100) : 0

  return (
    <Link
      to={`/protocolo/${protocolo.numero}`}
      className="block border-b border-line py-4 transition-colors hover:bg-surface-muted"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-lg font-bold leading-tight">
          {protocolo.titulo}
          {protocolo.complemento && (
            <span className="font-normal text-ink-muted"> ({protocolo.complemento})</span>
          )}
        </h3>

        {protocolo.categorias.length > 0 && (
          <span className="text-[11px] uppercase tracking-[0.08em] text-chip">
            {nomeDaCategoria(protocolo.categorias[0])}
          </span>
        )}

        {combinacao && (
          <span
            className="ml-auto shrink-0 text-sm font-semibold tabular-nums text-chip"
            title={`Atende ${combinacao.atendidos} de ${combinacao.total} ${
              combinacao.total === 1 ? 'sintoma buscado' : 'sintomas buscados'
            }`}
          >
            {percentual}% compatível
          </span>
        )}
      </div>

      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
        {protocolo.palavrasChave.length > 0
          ? protocolo.palavrasChave.join(', ')
          : `Indicado para ${protocolo.indicacao}.`}
      </p>
    </Link>
  )
}
