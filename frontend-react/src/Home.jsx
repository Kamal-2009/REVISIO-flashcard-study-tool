import { useEffect, useState } from "react"
import Study from "./Study"
import AddDeck from "./AddDeck"
import { Route, Routes, useNavigate } from "react-router-dom"

function Home({onLogout}) {
    const [error, setError] = useState("")
    const [decks, setDecks] = useState([])
    const navigate = useNavigate()

    async function loadDecks() {
        let response = await fetch("http://localhost:5000/load_decks", {
            credentials: "include"
        })
        let data = await response.json()
        if (!data.success) {
            setError(data.error)
            alert(data.error)
            return
        } else {
            setDecks(data.decks)
            return
        }
    }

    async function handleLogout() {
        const response = await fetch("http://localhost:5000/logout", {
            credentials: "include"
        })
        const data = await response.json()
        alert(data.message)
        onLogout()
        return
    }

    useEffect(() => {
        loadDecks();
    }, [])

    return (
        <>
        
        <Routes>
            <Route path='/' element={<>
                                        <h1>Home!</h1>
                                        <p>Welcome!!</p><br/>
                                        {error && <p>{error}</p>}
                                        {decks.map(deck => (
                                            <li key={deck.deck_id}>
                                                name: {deck.name} <br/>
                                                description: {deck.description} <br/>
                                                <button onClick={() => navigate(`/study/deck/${deck.deck_id}`)}>Study</button>
                                            </li>
                                        ))}
                                        <button onClick={() => navigate('/add_deck')}>Add Deck</button>
                                        <button onClick={handleLogout}>Log Out!</button>
                                    </>} 
            />
            <Route path='/study/deck/:deck_id' element={<Study />} />
            <Route path='/add_deck' element={<AddDeck />} />
        </Routes>
        </>
        
    )
}

export default Home