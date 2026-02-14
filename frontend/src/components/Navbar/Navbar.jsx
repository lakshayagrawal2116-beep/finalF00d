import React, { useContext, useState } from 'react'
import "./Navbar.css"
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Navbar = ({ SetShowLogin }) => {

  const [menu, setMenu] = useState("home")
  const [mobileOpen, setMobileOpen] = useState(false)

  const { getTotalCartAmount, token, SetToken, search, setSearch } = useContext(StoreContext)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    SetToken("")
    navigate("/")
    setMobileOpen(false)
  }

  return (
    <>
      <header className='navbar'>

        {/* Logo */}
        <Link to='/' onClick={() => setMobileOpen(false)}>
          <img className='logo' src='/Ge_logo.png' alt='logo' />
        </Link>

        {/* Desktop Menu */}
        <ul className='navbar-menu'>
          <Link to='/' className={menu==="home" ? "active":""} onClick={()=>setMenu("home")}>home</Link>
          <a href='/#explore-menu' className={menu==="menu" ? "active":""}>menu</a>
          <a href='/#app-download' className={menu==="mobile-app" ? "active":""}>mobile-app</a>
          <a href='#footer' className={menu==="contact-us" ? "active":""}>contact us</a>
          <Link to='/recommend' className={menu==="Food" ? "active":""}>FoodRecommender</Link>
        </ul>

        {/* Right Side */}
        <div className='navbar-right'>

          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <div className='navbar-search-icon'>
            <Link to='/cart'>
              <img src={assets.basket_icon} alt="cart" />
            </Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>

          {!token ? (
            <button onClick={() => SetShowLogin(true)}>sign in</button>
          ) : (
            <div className='navbar-profile'>
              <img src={assets.profile_icon} alt="profile" />
              <ul className='nav-profile-dropdown'>
                <li onClick={() => navigate('/myorders')}>Orders</li>
                <hr />
                <li onClick={logout}>Logout</li>
              </ul>
            </div>
          )}

          {/* Hamburger */}
          <div className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            ☰
          </div>

        </div>
      </header>

      {/* Mobile Menu */}
      <nav className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <Link to='/' onClick={() => setMobileOpen(false)}>home</Link>
        <a href='/#explore-menu' onClick={() => setMobileOpen(false)}>menu</a>
        <a href='/#app-download' onClick={() => setMobileOpen(false)}>mobile-app</a>
        <a href='#footer' onClick={() => setMobileOpen(false)}>contact us</a>
        <Link to='/recommend' onClick={() => setMobileOpen(false)}>FoodRecommender</Link>
      </nav>
    </>
  )
}

export default Navbar
