import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Auth from './Auth'
import Home from './Home'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <BrowserRouter>
      {loggedIn ? <Home /> : <Auth onAuth={() =>setLoggedIn(true)}/>}
    </BrowserRouter>
  )
}

export default App
