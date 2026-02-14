import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import LoginPopUp from './components/LoginPopUp/LoginPopUp'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import FoodRecommender from './components/FoodRecommender/FoodRecommender'
import ScrollToHash from './components/ScrollToHash'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const App = () => {

  const[showLogin,SetShowLogin]=useState(false);

  return (
    <>
    <ScrollToHash />
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{ zIndex: 20000 }}   // 🔥 IMPORTANT
      />
    {showLogin?<LoginPopUp SetShowLogin={SetShowLogin}/>:<></>}
    <div className='app'>
      <Navbar SetShowLogin={SetShowLogin}/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/order' element={<PlaceOrder/>} />
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/myorders" element={<MyOrders/>}/>
        <Route path="/recommend" element={<FoodRecommender SetShowLogin={SetShowLogin}/>}/>



      </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App