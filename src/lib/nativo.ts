import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { StatusBar, Style } from '@capacitor/status-bar'

/** `true` quando o código está rodando dentro do app empacotado (iOS/Android). */
export const rodandoNoApp = Capacitor.isNativePlatform()

/** Vibração curta de confirmação. No navegador não faz nada. */
export async function vibrar(estilo: ImpactStyle = ImpactStyle.Light) {
  if (!rodandoNoApp) return
  await Haptics.impact({ style: estilo })
}

/** Ajustes que só existem no app nativo. Chamado uma vez na inicialização. */
export async function prepararApp() {
  if (!rodandoNoApp) return
  await StatusBar.setStyle({ style: Style.Light })
}
