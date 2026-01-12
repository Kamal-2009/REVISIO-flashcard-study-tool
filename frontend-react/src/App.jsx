import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Auth from './Auth'
import Home from './Home'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  async function me() {
    const response = await fetch("http://localhost:5000/me", {
      credentials: "include"
    })
    const data = await response.json()
    if (data.logged_in) {
      setLoggedIn(true)
    }
    return
  }
  
  useEffect(() => {
    me()
  }, [])

  return (
    <BrowserRouter>
      {loggedIn ? (<Home onLogout={() => setLoggedIn(false)}/>) : (<Auth onAuth={() => setLoggedIn(true)}/>)}
    </BrowserRouter>
  )
}

export default App
