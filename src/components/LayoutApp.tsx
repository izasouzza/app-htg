import { NavLink, Outlet } from 'react-router-dom'
import RolagemDeRota from '@/components/RolagemDeRota'
import { vibrar } from '@/lib/nativo'

const abas = [
  { para: '/', rotulo: 'Buscar', icone: '🔍' },
  { para: '/indice', rotulo: 'Índice', icone: '📖' },
  { para: '/aminoacidos', rotulo: 'Aminoácidos', icone: '🧬' },
  { para: '/sobre', rotulo: 'Sobre', icone: 'ℹ️' },
]

export default function LayoutApp() {
  return (
    <div className="min-h-dvh bg-surface">
      <RolagemDeRota />

      {/* no celular a navegação fica embaixo; de tablet para cima, no topo */}
      <header className="sticky top-0 z-20 hidden border-b border-line bg-surface/95 backdrop-blur md:block print:hidden">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
          <NavLink to="/" className="font-semibold tracking-tight">
            HTG <span className="text-ink-muted">· Guia de Protocolos</span>
          </NavLink>

          <nav className="ml-auto">
            <ul className="flex gap-1 rounded-full bg-surface-muted p-1">
              {abas.map((aba) => (
                <li key={aba.para}>
                  <NavLink
                    to={aba.para}
                    end={aba.para === '/'}
                    className={({ isActive }) =>
                      `block rounded-full px-4 py-1.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-surface font-medium text-chip-forte shadow-sm'
                          : 'text-chip hover:text-chip-forte'
                      }`
                    }
                  >
                    {aba.rotulo}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md pb-28 md:max-w-5xl md:pb-12 print:max-w-none print:pb-0">
        <Outlet />
      </main>

      {/* barra flutuante arredondada, no espírito do app de referência */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md px-3 md:hidden print:hidden"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
      >
        <ul className="flex gap-1 rounded-[26px] border border-line bg-surface/95 p-1.5 shadow-[0_6px_24px_rgba(15,23,42,0.12)] backdrop-blur">
          {abas.map((aba) => (
            <li key={aba.para} className="flex-1">
              <NavLink
                to={aba.para}
                end={aba.para === '/'}
                onClick={() => void vibrar()}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 rounded-[20px] py-2 text-[11px] transition-colors ${
                    isActive ? 'bg-chip-suave font-medium text-chip-forte' : 'text-chip'
                  }`
                }
              >
                <span className="text-lg leading-none">{aba.icone}</span>
                {aba.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
