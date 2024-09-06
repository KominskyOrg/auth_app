import { useState } from 'react'
import { login } from '../services/api'

interface LoginFormProps {
  onLoginSuccess: () => void
}

function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await login(email, password)
      if (response.status === 200) {
        onLoginSuccess()
      } else {
        setError('Login failed')
      }
    } catch (err) {
      setError('An error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  )
}

export default LoginForm
