export default function AvisoSaude({ compacto = false }: { compacto?: boolean }) {
  if (compacto) {
    return (
      <p className="text-xs leading-relaxed text-ink-muted">
        O HTG não substitui diagnóstico, medicamento ou tratamento médico. Em caso de sintoma
        persistente ou grave, procure atendimento de saúde.
      </p>
    )
  }

  return (
    <div className="rounded-card border border-brand-100 bg-brand-50 p-4">
      <p className="text-sm font-medium text-brand-700">Antes de usar</p>
      <p className="mt-1 text-sm leading-relaxed text-brand-700/80">
        O HTG é uma terapia integrativa. Ele <strong>não substitui</strong> diagnóstico,
        medicamento ou tratamento médico, e não deve atrasar a procura por atendimento. Em caso de
        sintoma grave, persistente ou de emergência, procure um serviço de saúde.
      </p>
    </div>
  )
}
