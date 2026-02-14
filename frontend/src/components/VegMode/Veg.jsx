import React from 'react'
import './Veg.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const Veg = ({ mode, SetMode }) => {

  const handleToggle = () => {
    if (mode) {
      toast.warn("Veg Mode OFF 🥩", {
        autoClose: 2000,
      })
    } else {
      toast.success("Veg Mode ON 🌱", {
        autoClose: 2000,
      })
    }

    SetMode(prev => !prev)
  }

  return (
    <div className="veg-toggle">
      <button
        onClick={handleToggle}
        className={mode ? "veg-on" : "veg-off"}
      >
        VEG MODE {mode ? "ON 🌱" : "OFF"}
      </button>

      {/* <ToastContainer
          // 🔥 IMPORTANT
      /> */}
    </div>
  )
}

export default Veg
