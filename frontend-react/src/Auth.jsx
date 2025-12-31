import { Routes, Route, Link} from 'react-router-dom';
import Login from "./Login"
import Register from "./Register"

function Welcome(){
    return (
        <>
            <h1>Welcome to Revisio!</h1>
            <p>Create decks, practice with flashcards and track your learning progress</p> <br/>
            <Link to='/login'>Log In</Link> <br/> <br />
            <Link to='/register'>Sign Up</Link> 
        </>
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