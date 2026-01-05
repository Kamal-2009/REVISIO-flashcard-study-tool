import { useEffect, useState } from "react"

function AddDeck() {
    const [deck, setDeck] = useState({
        name: "",
        description: ""
    })
    const [cards, setCards] = useState([
        {id: crypto.randomUUID(), ques: "", ans: ""},
        {id: crypto.randomUUID(), ques: "", ans: ""},
        {id: crypto.randomUUID(), ques: "", ans: ""}
    ])

    async function submitData() {
        const response = await fetch("http://localhost:5000/add_deck", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                name: deck.name,
                description: deck.description,
                cards: cards
            })
        })

        const data = await response.json()

        if (!data.success) {
            alert(data.error)
            return
        }
        else {
            alert(data.message)
            return
        }
    }

    function handleCardChange(i, name, value) {
        setCards(cards.map((card, index) => 
            index === i ? {...card, [name]: value} : card
        ))
        return
    }
    
    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setDeck(values => ({...values, [name]: value}))
        return
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (Object.values(deck).some(value => !value.trim())) {
            alert("Fill all fields")
            return
        }

        if (deck.description.length > 255) {
            alert("description needs to be less than 255 characters")
            return 
        }

        for (let i = 0; i < cards.length; i++) {
            if (Object.values(cards[i]).some(value => !value.trim())) {
                alert("Fill all fields")
                return
            }
        }
        submitData()
        return
    }

    const addCard = () => {
        setCards(prevCards => [...prevCards, {id: crypto.randomUUID(), ques: "", ans: ""}])
        return
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label>Enter Deck name:
                    <input 
                        type="text" name="name" 
                        value={deck.name} onChange={handleChange}
                    />
                </label> <br/>
                <label>Enter Deck desription
                    <input 
                        type="text" name="description" 
                        value={deck.description} onChange={handleChange} 
                    />
                </label> <br/>
                {cards.map((card, index) => (
                    <label key={card.id}>Card {index + 1}:
                        <input 
                            type="text" name="ques" 
                            value={card.ques} placeholder={`Question ${index + 1}`} 
                            onChange={(e) => handleCardChange(index, e.target.name, e.target.value)} 
                        /> 
                        <br />
                        <input 
                            type="text" name="ans" 
                            value={card.ans} placeholder={`Answer ${index + 1}`} 
                            onChange={(e) => handleCardChange(index, e.target.name, e.target.value)} 
                        /> 
                        <br/>
                    </label> 
                ))}
                <button type="button" onClick={addCard}>Add another Card</button>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default AddDeck