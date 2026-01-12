import { useEffect, useState } from "react"
import Study from "./Study"
import AddDeck from "./AddDeck"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import logo from "./assets/logo.svg"
import plus from "./assets/plus.svg"
import edit from "./assets/edit.svg"
import play from "./assets/play.svg"
import EditDeck from "./EditDeck"
import close from "./assets/close.svg"
import upload from "./assets/upload.svg"
import fileCheck from "./assets/file.svg"

let cards = null

function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
  );
}

function DeleteModal({ onCancel, onConfirm} ) {
    const [loading, setLoading] = useState(false)

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[#f8f7ff] rounded-lg p-6 flex flex-col space-y-4 md:w-lg w-sm text-[#1f2937]">
                <h1 className="text-lg font-semibold text-[#641f07]">Delete Deck?</h1>
                <p className="text-sm text-gray-600">Are you sure you want to delete this deck? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg border-[#9381ff]/20 hover:bg-gray-300 transition duration-300">
                        Cancel
                    </button>
                    <button type="button" onClick={() => {setLoading(true); onConfirm();}} className="px-4 py-2 rounded-lg bg-[#641f07] text-[#ffeedd] flex items-center justify-center hover:opacity-80 transtion duration-300">
                        {loading ? <Spinner/> : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    )
}

function ChoiceModal({ onClose, onManual, onPDF}) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[#f8f7ff] rounded-lg p-6 flex flex-col space-y-4 md:w-lg w-sm text-[#1f2937]">
                <div  className="flex justify-between">
                    <div className="flex flex-col justify-start">
                        <h1 className="text-xl font-bold">Create New Deck</h1>
                        <p className="font-[350]">Choose how you'd like to create your deck</p>
                    </div>
                    <button type="button" onClick={onClose} className="opacity-70 hover:opacity-100 transition duration-300">
                        <img src={close} alt="close" className="h-4 w-auto"/>
                    </button>
                </div>
                <div 
                    onClick={onManual}
                    className="bg-[#b8b8ff60] border border-[#9381ff]/20 rounded-lg p-4 hover:bg-[#b8b8ff] transition duration-300">
                    <h1 className=" text-lg font-semibold">Create Manually</h1>
                    <p className="font-[350]">Add questions and answers yourself using the editor</p>
                </div>
                <div 
                    onClick={onPDF}
                    className="bg-[#b8b8ff60] border border-[#9381ff]/20 rounded-lg p-4 hover:bg-[#b8b8ff] transition duration-300">
                    <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Generate from PDF</h1>
                    <p className="text-xs"><i>✨ Recommended</i></p>
                    </div>
                    <p className="font-[350]">Upload your notes or slides and we'll create flashcards for you</p>
                </div>
            </div>
        </div>
    )
}

function UploadModal({onClose, onSuccess}) {
    const [error, setError] = useState("")
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    async function submitFile() {
        const form = new FormData()
        form.append("file", file)

        const response = await fetch("http://localhost:5000/ai/generate", {
            method: "POST",
            credentials: "include",
            body: form
        })

        const data = await response.json()
        if(!data.success) {
            setError(data.error)
            setLoading(false)
            return
        }
        else {
            cards = data.cards
            setLoading(false)
            onSuccess()
            return
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        if (file.type !== "application/pdf") {
            setError("Invalid File Type!")
            setLoading(false)
            return
        }

        submitFile()
        return
    }

    return (
        <div className="bg-black/40 fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#f8f7ff] rounded-lg p-6 flex flex-col space-y-4 md:w-xl w-md text-[#1f2937]">
                <div className="flex justify-between">
                    <h1 className="text-xl font-bold">Generate From PDF</h1>
                    <button type="button" onClick={onClose} className="opacity-70 hover:opacity-100 transition duration-300">
                        <img src={close} alt="close" className="h-4 w-auto"/>
                    </button>
                </div>
                <div>
                    <p className="font-[350]">Upload a PDF file and we'll automatically generate flashcards from its content</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex overflow-hidden">
                    <label 
                        htmlFor="pdf-upload" 
                        className="flex flex-col
                            items-center justify-center
                            border-2 border-dashed 
                            w-full aspect-2/1 rounded-lg 
                            border-gray-400
                            hover:border-[#9381ff] 
                            transition duration-300"
                    >
                    {file === null ? (
                        <>
                        <img src={upload} alt="File Upload" className="h-16 w-auto opacity-50"/>
                        <p>Click to upload PDF</p>
                        </>) : (
                        <>
                        <img src={fileCheck} alt="File Uploaded" className="h-16 w-auto"/>
                        <p>{file.name}</p>
                        </>        
                    )}    
                    </label>
                    <input type="file" id="pdf-upload" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])}/>
                </div>

                {error && (<p className="mx-auto text-sm text-center text-[#6f1a07]">{error}</p>)}

                <div className="grid grid-cols-2 gap-4">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="border rounded-md 
                            py-2 text-[#9381ff] 
                            border-[#9381ff] 
                            hover:bg-gray-200 
                            transition duration-300">
                        Cancel
                    </button>
                {file === null ? (
                    <button 
                        type="submit" 
                        disabled
                        className="bg-[#9381ff] py-2
                            text-[#f8f7ff] rounded-md 
                            opacity-50">
                        Generate Flashcards
                    </button>
                ) : (
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex items-center justify-center
                            bg-[#9381ff] py-2
                            text-[#f8f7ff] rounded-md 
                            hover:opacity-80 
                            transition duration-300">
                        {loading ? <Spinner /> : "Generate Flashcards"}
                    </button>
                )}
                    
                </div>
                </form>
            </div>
        </div>
    )
}

function Home({onLogout}) {
    const [error, setError] = useState("")
    const [decks, setDecks] = useState([])
    const [choice, setChoice] = useState(false)
    const [upload, setUpload] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    
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

    async function handleDelete(did) {

        const response = await fetch("http://localhost:5000/delete_deck", {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "deck_id": did
            })
        })
        const data = await response.json()
        if (!data.success) {
            setError(data.error)
            setDeleteTarget(null)
            return
        }
        loadDecks()
        setDeleteTarget(null)
        return
    }

    useEffect(() => {
        loadDecks();
    }, [location.key])

    return (
        <>
        
        <Routes>
            <Route path='/' element={
                <div className="min-h-dvh">
                    {choice && (
                        <ChoiceModal
                            onClose={() => setChoice(false)}
                            onManual={() => {
                                setChoice(false)
                                navigate('/add_deck')
                            }}
                            onPDF={() => {
                                setUpload(true)
                                setChoice(false)
                            }}
                        />
                    )}
                    {upload && (
                        <UploadModal
                            onClose={() => setUpload(false)}
                            onSuccess={() => {
                                setUpload(false)
                                navigate('/add_deck')
                            }}
                        />
                    )}
                    {deleteTarget && (
                        <DeleteModal
                            onCancel={() => setDeleteTarget(null)}
                            onConfirm={() => handleDelete(deleteTarget)}
                        />
                    )}
                    <div className="bg-[#B8B8FF] text-[#F8F7FF] border-b border-[#9381FF]">
                    <div className="max-w-7xl mx-auto px-6 py-5">    
                        <div className="flex items-center justify-between md:px-16">
                        <div className="flex items-center">
                            <div className="bg-[#9381FF] w-10 h-10 rounded-[10px] flex items-center justify-center">
                                <img src={logo} alt="Logo" className="h-8 w-auto invert"/>
                            </div>
                            <h1 className="ml-4 font-semibold text-4xl relative -top-px">Revisio</h1>
                        </div>
                        <div className="flex text-lg">
                            <button onClick={handleLogout} className="text-[#9381ff] transition duration-300 hover:underline hover:text-inherit mx-4">Logout</button>
                            <button onClick={() => setChoice(true)} className="bg-[#9381FF] rounded-[10px] p-2 flex hover:opacity-80 transition duration-300">
                                <img src={plus} alt="add" className="h-7 w-auto invert mr-2"/> 
                                <span className="relative -top-[0.75px]">Create Deck</span>
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="text-[#1F2937] max-w-7xl mx-auto px-6 py-5 md:px-22">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl font-[550]">My Decks</h2>
                            <p className="opacity-85">{ decks.length } decks available</p>
                        </div>
                        {error && <p>{error}</p>}

                        {decks.length === 0 ? (
                            <div className="text-center opacity-80 py-16">
                                <p className="mb-4">You don't have any decks yet.</p>
                                <button className="bg-[#9381FF] text-[#F8F7FF] px-4 py-2 rounded-lg">
                                Create your first deck
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {decks.map(deck => (
                                <div key={deck.deck_id} className="rounded-[10px] border border-gray-300 p-4 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                        <img src={logo} alt="Logo" className="h-8 w-auto pr-2"/>
                                        <h4 className="text-2xl line-clamp-1">{deck.name}</h4>
                                        </div>
                                        <p className="opacity-70 text-sm font-[350]">{deck.num} cards</p>
                                    </div>
                                    <p className="opacity-80 py-2 line-clamp-3">{deck.description} </p>
                                    <div className="flex gap-2 pt-4">
                                    <button 
                                        onClick={() => navigate(`/study/deck/${deck.deck_id}`)}
                                        className="flex grow justify-center items-center bg-[#9381FF] text-[#F8F7FF] rounded-lg px-2 py-1 hover:opacity-80 transition duration-300">
                                        <img src={play} alt="play" className="h-7 w-auto invert py-1 pr-1"/>
                                        <span className="relative -top-[0.85px]">Study</span>
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/edit/deck/${deck.deck_id}`)}
                                        className="rounded-lg px-2.5 py-1.5 border border-gray-300 transition duration-300 hover:bg-gray-200">
                                        <img src={edit} alt="Edit" className="h-5 w-auto"/>
                                    </button>
                                    <button 
                                        onClick={() => setDeleteTarget(deck.deck_id)}
                                        className="rounded-lg px-2.5 py-1.5 border border-gray-300 bg-[#ffeedd] hover:bg-[#ffd8be] transition duration-300">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-[#6f1a07]"
                                            >
                                            <path
                                                d="M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            </svg>
                                    </button>
                                    </div>
                                </div>
                            ))}
                            </div>
                        )}

                        
                    </div>
                </div>} 
            />
            <Route path='/study/deck/:deck_id' element={<Study />} />
            <Route path='/edit/deck/:deck_id' element={<EditDeck />} />
            <Route path='/add_deck' element={<AddDeck initialCards={cards}/>} />
        </Routes>
        </>
        
    )
}

export default Home