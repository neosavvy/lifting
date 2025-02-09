import { ThemeProvider } from './contexts/ThemeContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import WorkoutForm from './components/WorkoutForm'
import AuthPage from './pages/AuthPage'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/workout" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/workout"
              element={
                <PrivateRoute>
                  <Layout>
                    <div className="container mx-auto px-4 py-8">
                      <h1 className="text-4xl font-retro text-center mb-8">
                        5x3x1 Weightlifting Planner
                      </h1>
                      <WorkoutForm />
                    </div>
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App 