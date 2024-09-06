import { useState } from 'react'
import LoginForm from './components/LoginForm'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      <h1>Auth App</h1>
      {isLoggedIn ? (
        <p>You are logged in!</p>
      ) : (
        <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </>
  )
}

export default App
