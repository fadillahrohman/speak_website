import {BrowserRouter, Routes, Route} from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VerificationSuccess from "./pages/VerificationSuccess"
import ForgotPassword from "./pages/ForgotPassword"
import ResendEmail from "./pages/ResendEmail"
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated"


function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/login" element={<RedirectIfAuthenticated><Login/></RedirectIfAuthenticated>}></Route>
      <Route path="/register" element={<RedirectIfAuthenticated><Register/></RedirectIfAuthenticated>}></Route>
      <Route path="/verification-success" element={<RedirectIfAuthenticated><VerificationSuccess/></RedirectIfAuthenticated>}></Route>
      <Route path="/forgot-password" element={<RedirectIfAuthenticated><ForgotPassword/></RedirectIfAuthenticated>}></Route>
      <Route path="/resend-verification" element={<RedirectIfAuthenticated><ResendEmail/></RedirectIfAuthenticated>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
