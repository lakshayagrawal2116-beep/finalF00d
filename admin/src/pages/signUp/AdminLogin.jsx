import { useState } from "react"
import axios from "axios"
import "./SignUp.css"

const AdminLogin = ({url}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(`${url}/api/admin/login`, {
        email,
        password,
      })

      localStorage.setItem("adminToken", res.data.token)
      window.location.href = "/"
    } catch (err) {
      alert("Invalid admin credentials")
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Admin Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default AdminLogin
