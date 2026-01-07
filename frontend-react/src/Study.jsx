import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function Study() {
    const [error, setError] =useState("")
    const { deck_id } = useParams()
    const [deck, setDeck] = useState({})
    const [cards, setCards] = useState([])

    async function load_cards() {
        const response = await fetch(`http://localhost:5000/load_cards/${deck_id}`, {
            credentials: "include"
        })
        const data = await response.json()
        if (!data.success) {
            setError(data.error)
            alert(error)
            return
        }
        else {
            setCards(data.cards)
            setDeck(data.deck)
            return
        }
    }

    useEffect(() => {
        load_cards(); 
    }, [])

    return (
        <>
            <p>Name: {deck.name}</p>
            <p>Description: {deck.description}</p>
            <p>Deck Id: {deck_id}</p>
            <p>Cards: </p>
            {cards.map(card => (
                <li key={card.card_id}>
                    Question: {card.ques} <br/>
                    Answer: {card.ans}
                </li>
            ))}
        </>
    )
}

export default Study