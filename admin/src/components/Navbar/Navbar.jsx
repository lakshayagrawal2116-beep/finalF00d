import React from 'react'
import "./Navbar.css"
 import {Link,useNavigate} from "react-router-dom"
import {assets} from "../../assets/assets"
const Navbar = () => {

   const navigate =useNavigate();
   
      const logout=()=>{
          localStorage.removeItem("adminToken");
          
          navigate("/admin/login");
  
      }
  
  return (
    <div className='navbar'>
      <Link to={'/'}>

      <img style={{width:"60px"}} className='logo' src='/Ge_logo.png' alt=''/>
      </Link>
        <div className='right'>
          <img className='profile' src={assets.profile_image} alt=''/>
          <button className='btn' onClick={logout}>Logout</button>

        </div>
        
    </div>
  )
}

export default Navbar