import { useState } from 'react'

import ProtectedRoute from './contexts/ProtectedRoute'
import { BrowserRouter, Routes ,Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

import Home from './pages/home'
import Signup from './pages/signup'
import Signin from './pages/signin'

function App() {


  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
              } />

            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>
    
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
