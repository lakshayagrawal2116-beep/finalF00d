import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"
import ProtectedRoute from "./Routes/ProtectedRoute"

import Dashboard from "./pages/Dashboard/Dashboard"
import Add from "./pages/Add/Add"
import List from "./pages/List/List"
import Orders from "./pages/Orders/Orders"
import AddCoupon from "./pages/AddCoupon/AddCoupon"
import AdminLogin from "./pages/signUp/AdminLogin"

const App = () => {
  const url = import.meta.env.VITE_BASE_URL   // ✅ correct for Vite

  return (
    <>
      <ToastContainer />

      <Routes>

        {/* 🔓 AUTH ROUTES (NO NAVBAR / SIDEBAR) */}
        <Route element={<AuthLayout />}>
          <Route path="/admin/login" element={<AdminLogin url={url} />} />
        </Route>

        {/* 🔒 PROTECTED ADMIN PANEL */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/add-coupon" element={<AddCoupon url={url} />} />
        </Route>

      </Routes>
    </>
  )
}

export default App
