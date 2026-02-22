import React from 'react'
import './Header.css';
const Header = () => {
  return (
    <div className='header'>
        <div className='header-contents'>
            <h2>Order your favourite food here</h2>
            <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingerdients and culinary expertise. Our mission is to satisfy your cravings and elevate your dinning expertise,one delicios meal at a time</p>

            <button onClick={() => window.location.href = '#explore-menu'}>view menu</button>
        </div>
    </div>
  )
}

export default Header