import { Routes, Route, Link} from 'react-router-dom';
import Login from "./Login"
import Register from "./Register"
import logo from "./assets/logo.svg"

function Welcome(){
    return (
        <div className='min-h-dvh text-[#1F2937] text-center'>
            <div className='p-4'>
                <img src={logo} alt='logo' className='h-24 w-auto invert mx-auto rounded-2xl p-2 bg-[#6C7E00]'/>
            </div>

            <h1 className='text-6xl font-bold p-4'>Revisio</h1>
            <p className='text-xl opacity-80 pb-8'>Create decks, practice with flashcards and track your learning progress.</p> 

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