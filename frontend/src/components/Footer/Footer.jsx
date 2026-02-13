import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            <div className='footer-content-left'>
                <img  className='footer-logo' src='/Ge_logo.png'alt=''/>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores mollitia fuga nobis omnis ipsum vero explicabo earum ad possimus suscipit!</p>
                <div className='footer-social-icons'>
                    <img src={assets.facebook_icon} alt=''/>
                    <img src={assets.twitter_icon} alt=''/>
                    <img src={assets.linkedin_icon} alt=''/>



                </div>
            </div>
            <div className='footer-content-center'>
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                     <li>About us</li>
                      <li>Delivery</li>
                       <li>Privacy Policy</li>
                </ul>
            </div>
            <div className='footer-content-right'>
                <h2>Get In Touch</h2>
                <ul>
                    <li>+1-212-4456-7890</li>
                     <li>contact@Taste Runners.com</li>
                </ul>
            </div>
        </div>
        <hr/>
        <p className='footer-copyright'>Copyright 2024 &copy; Taste Runners.com-All right reserved</p>
    </div>
  )
}

export default Footer