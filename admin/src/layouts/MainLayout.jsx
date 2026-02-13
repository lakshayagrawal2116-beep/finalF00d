import Navbar from '../components/Navbar/Navbar'
import Sidebar from '../components/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
