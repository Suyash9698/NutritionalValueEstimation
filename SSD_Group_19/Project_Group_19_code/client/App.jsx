import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import SignUp from './signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Protected from './Protected'
import Upload from './upload'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register"element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Protected Component={Upload} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
