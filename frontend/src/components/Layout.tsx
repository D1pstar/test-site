import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <ScrollToTop />
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}