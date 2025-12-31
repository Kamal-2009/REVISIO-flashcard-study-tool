import { useEffect, useState } from "react"

function Home() {
    const [error, setError] = useState("")
    const [decks, setDecks] = useState({})

    async function loadDecks() {
        let response = await fetch("http://127.0.0.1:5000/load_decks", {
            credentials: "include"
        })
        let data = await response.json()
        if (!data.success) {
            setError(data.error)
            alert(data.error)
            return
        } else {
            setDecks(data.decks)
            alert(data.decks)
            return
        }
    }

    useEffect(() => {
        loadDecks();
    }, [])

    return (
        <>
        <h1>Home!</h1>
        <p>Welcome!!</p><br/>
        {error && <p>{error}</p>}
        {decks && <p>{decks}</p>} 
        </>
    )
}

export default Home