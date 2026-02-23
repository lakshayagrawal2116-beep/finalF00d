import React, { useContext, useState } from 'react'
import './LoginPopUp.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"
import { toast } from 'react-toastify'
import api from '../../api/axios'
import { FaEye, FaEyeSlash } from "react-icons/fa";
const LoginPopUp = ({ SetShowLogin }) => {

  const { SetToken } = useContext(StoreContext)
  const [currState, SetCurrState] = useState("Login")
  const [showPassword, setShowPassword] = useState(false);

  const [data, SetData] = useState({
    name: "",
    email: "",
    password: ""

  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    SetData(data => ({ ...data, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault();

    try {
      const endpoint =
        currState === "Login" ? "/user/login" : "/user/register";

      const response = await api.post(endpoint, data);

      if (response.data.success) {
        SetToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        SetShowLogin(false);
        toast.success("Logged in Successfully");
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };








  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className='login-popup-container'>
        <div className='login-popup-title'>
          <h2>{currState}</h2>
          <img onClick={() => SetShowLogin(false)} src={assets.cross_icon} alt='' />
        </div>
        <div className='login-popup-inputs'>
          {currState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Your name' required />}
          <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Your email' required />
          <div className="password-input-container" style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              name='password'
              onChange={onChangeHandler}
              value={data.password}
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              required
              style={{ width: "100%" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "15px", cursor: "pointer", color: "#6b7280" }}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>


        </div>
        <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
        {currState === "Sign Up" && (
          <div className='login-popup-condition'>
            <input type='checkbox' required />
            <p>By continuing ,I agree to the terms of use &privacy policy</p>
          </div>
        )}
        {currState === "Login" ?
          <p>Create a new account? <span onClick={() => SetCurrState("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => SetCurrState("Login")}>Login Here</span></p>
        }
      </form>

    </div>
  )
}

export default LoginPopUp