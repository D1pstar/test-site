import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ServiceDetailPage from './pages/ServiceDetailPage'
import ContentPage from './pages/ContentPage'
import AdminPage from './pages/AdminPage'
import PreviewPage from './pages/PreviewPage'
import { PublishedSiteProvider } from './hooks/useSite'
import { useSeededOnce } from './hooks/useSeededOnce'

/** Everything visitors see: nav + footer around the page that matches the URL. */
function PublicSite() {
  return (
    <PublishedSiteProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="*" element={<ContentPage />} />
        </Route>
      </Routes>
    </PublishedSiteProvider>
  )
}

export default function App() {
  useSeededOnce()

  return (
    <Routes>
      <Route path="/admin/preview" element={<PreviewPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<PublicSite />} />
    </Routes>
  )
}
