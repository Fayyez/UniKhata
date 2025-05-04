import './App.css'
import LoginPage from './pages/BackendLoginPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BackendLoginPage from './pages/BackendLoginPage'

function App() {

  return (
    <BrowserRouter>
    <h3>Hello and welcome nav bar</h3>
    <Routes>
      <Route path="/" element={<BackendLoginPage/>}/>
      <Route path="/login" element={<BackendLoginPage/>}/>
      <Route path="/landing" element={<LandingPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
