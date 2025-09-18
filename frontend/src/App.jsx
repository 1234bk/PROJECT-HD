import { useState } from 'react'

// import ProtectedRoute from './contexts/ProtectedRoute'
import { BrowserRouter, Routes ,Route, Form } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Signin from './pages/Signin.jsx'
import ProtectedRoute from './contexts/ProtectedRoute'
import Chat from './pages/Chat.jsx'
import Formcom from './components/Formcom.jsx'
import ResultPage from './components/ResultPage.jsx'

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

             

               <Route path="/chat" element={
              <ProtectedRoute>
                < Chat />
            </ProtectedRoute>
              } />

               <Route path="/result" element={
              <ProtectedRoute>
                < ResultPage />
            </ProtectedRoute>
              } />

             <Route path="/form" element={
              <ProtectedRoute>
                < Formcom />
            </ProtectedRoute>
              } />

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
