import React, { useContext, useState } from 'react'
import "./Navbar.css";
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
const Navbar = ({SetShowLogin}) => {

    const [menu,setMenu]=useState("home");
    const{getTotalCartAmount,token,SetToken}=useContext(StoreContext);
    const { search, setSearch } = useContext(StoreContext);

    const navigate =useNavigate();
    const logout=()=>{
        localStorage.removeItem("token");
        SetToken("");
        navigate("/");

    }



  return (
    <div className='navbar'>
        <Link to={'/'}>
            <img className='logo' src='/Ge_logo.png'  alt='logo'/>

        </Link>
       
        <ul className='navbar-menu'>
            <Link to={'/'} onClick={()=> setMenu("home")} className={menu==="home" ? "active":""}>home</Link>
            <a href='/#explore-menu' onClick={()=> setMenu("menu")} className={menu==="menu" ? "active":""}>menu</a>
            <a href=' /#app-download'onClick={()=> setMenu("mobile-app")} className={menu==="mobile-app" ? "active":""}>mobile-app</a>
            <a href='#footer' onClick={()=> setMenu("contact-us")} className={menu==="contact-us" ? "active":""}>contact us</a>
            <Link to={'/recommend'} onClick={()=> setMenu("Food")} className={menu==="Food" ? "active":""}>FoodRecommender</Link>
        </ul>
        <div className='navbar-right'>
            {/* <img src={assets.search_icon} alt=""/> */}
            <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input" 
            />
            {search && (
                <i onClick={() => setSearch("")}  className="fa-solid fa-xmark remove-btn"></i>
//   <button onClick={() => setSearch("")}>✖</button>
)}


            <div className='navbar-search-icon'>
                <Link to={'/cart'}>
                    <img src={assets.basket_icon} alt=''/>

                </Link>
                <div className={getTotalCartAmount()===0 ? "":"dot"}></div>

            </div>
            {!token ?<button onClick={()=>SetShowLogin(true)}>sign in</button>:<div className='navbar-profile'>
                <img src={assets.profile_icon} alt=''/>
                <ul className='nav-profile-dropdown'>
                    <li onClick={()=>navigate('/myorders')} ><img src={assets.bag_icon} alt=''/><p>Orders</p></li>
                    <hr/>
                    <li onClick={logout}><img src={assets.bag_icon} alt=''/><p>Logout</p></li>
                </ul>
                </div>}

        </div>
    </div>
  )
}

export default Navbar