import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LayoutApp from '@/components/LayoutApp'
import Buscar from '@/paginas/Buscar'
import Indice from '@/paginas/Indice'
import Protocolo from '@/paginas/Protocolo'
import Aminoacidos from '@/paginas/Aminoacidos'
import Aminoacido from '@/paginas/Aminoacido'
import Sobre from '@/paginas/Sobre'

export default function App() {
  return (
    // BASE_URL acompanha o `base` do Vite: '/' no app nativo, '/app-htg/' no Pages
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<LayoutApp />}>
          <Route index element={<Buscar />} />
          <Route path="indice" element={<Indice />} />
          <Route path="protocolo/:numero" element={<Protocolo />} />
          <Route path="aminoacidos" element={<Aminoacidos />} />
          <Route path="aminoacido/:codigo" element={<Aminoacido />} />
          <Route path="sobre" element={<Sobre />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
