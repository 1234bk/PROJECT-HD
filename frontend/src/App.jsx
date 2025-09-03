import { useState } from 'react'

// import ProtectedRoute from './contexts/ProtectedRoute'
import { BrowserRouter, Routes ,Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

import Home from './pages/home'
import Signup from './pages/signup'
import Signin from './pages/signin'
import ProtectedRoute from './contexts/ProtectedRoute'

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
              {/* <Route path="/home" element={<Home />} />  */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />



                      <Route
            path="*"
            element={
              <div className="flex h-screen items-center justify-center text-2xl font-semibold text-red-600">
                Not a valid page 🚫
              </div>
            }
          />

          </Routes>
    
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
