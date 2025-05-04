import './App.css'
import LoginPage from './pages/LoginPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

function App() {

  return (
    <BrowserRouter>
    <h3>Hello and welcome nav bar</h3>
    <Routes>
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/landing" element={<LandingPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
