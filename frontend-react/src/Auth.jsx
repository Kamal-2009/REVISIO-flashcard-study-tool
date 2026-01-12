import { Routes, Route, Link} from 'react-router-dom';
import Login from "./Login"
import Register from "./Register"
import logo from "./assets/logo.svg"

function Welcome(){
    return (
        <div className='min-h-dvh text-[#1F2937] text-center'>
        <div className='flex flex-col items-center justify-center min-h-dvh w-lg mx-auto md:w-4xl'>    
            <div className='p-4'>
                <img src={logo} alt='logo' className='h-24 w-auto invert mx-auto rounded-2xl p-2 bg-[#6C7E00]'/>
            </div>

            <h1 className='text-6xl font-bold p-4'>Revisio</h1>
            <p className='text-xl opacity-80 pb-8'>Create flashcards your way - from notes or from scratch.<br/><i>Powered by AI.</i></p> 

            <div className='grid grid-flow-col auto-cols-max gap-4 justify-center'>
                <Link
                    to="/login"
                    className='bg-[#9381FF] text-[#F8F7FF] rounded-lg p-2 w-48 hover:opacity-80 transition duration-300'
                >
                Log In
                </Link>
                <Link
                    to="/register"
                    className='border border-[#9381FF] text-[#9381FF] rounded-lg p-2 w-48 transition duration-300 hover:bg-gray-100'
                >
                Sign Up
                </Link>
            </div>

            <div className='grid md:grid-cols-3 md:w-2xl gap-4 px-6 py-12'>
                <div className='flex flex-col p-4 space-y-2 items-start border rounded-xl bg-[#b8b8ff60] border-[#9381ff]/20'>
                    <h4 className='text-lg font-semibold text-start'>🧠 Active Study Mode</h4>
                    <p className='text-sm text-gray-500 text-justify'>Practice with interactive flashcards that help you recall, review, and retain information.</p>
                </div>
                <div className='flex flex-col p-4 space-y-2 items-start border rounded-xl bg-[#b8b8ff60] border-[#9381ff]/20'>
                    <h4 className='text-lg font-semibold text-start'>📄 Generate from Your Notes</h4>
                    <p className='text-sm text-gray-500 text-justify'>Upload PDFs or study notes and let Revisio create flashcards for you automatically.</p>
                </div>
                <div className='flex flex-col p-4 space-y-2 items-start border rounded-xl bg-[#b8b8ff60] border-[#9381ff]/20'>
                    <h4 className='text-lg font-semibold text-start'>📚 Organize your Learning</h4>
                    <p className='text-sm text-gray-500 text-justify'>Create and manage decks for each subject so all your study material stays in one place.</p>
                </div>
            </div>

        </div>
        </div>
    )
}

function Auth({onAuth}) {
    return (
        <Routes>
            <Route path='/' element= {<Welcome/>} />
            <Route path='/login' element={<Login onSuccess={onAuth}/>} />
            <Route path='/register' element={<Register />} />
        </Routes>
    )
}

export default Auth