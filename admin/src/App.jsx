import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"

import Dashboard from "./pages/Dashboard/Dashboard"
import Add from "./pages/Add/Add"
import List from "./pages/List/List"
import Orders from "./pages/Orders/Orders"
import AddCoupon from "./pages/AddCoupon/AddCoupon"
import AdminLogin from "./pages/signUp/AdminLogin"
import ProtectedRoute from "./Routes/ProtectedRoute"



const App = () => {
  const url = "http://localhost:4000"

  return (
    <>
      <ToastContainer />

      <Routes>

        {/* AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/admin/login" element={<AdminLogin url={url} />} />

          {/* ADMIN PANEL */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
          
          
        </Route>

        {/* MAIN APP ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/add-coupon" element={<AddCoupon />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
