import { Outlet } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import NavBar from './NavBar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="site-bg flex min-h-full flex-col">
      <ScrollToTop />
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}