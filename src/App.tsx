import { ThemeProvider } from './contexts/ThemeContext'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import WorkoutForm from './components/WorkoutForm'
import AuthPage from './pages/AuthPage'
import EquipmentSettings from './pages/EquipmentSettings'
import EnterStatsPage from './pages/EnterStatsPage'
import EliteTimelinePage from './pages/EliteTimelinePage'
import LandingPage from './pages/LandingPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
            <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
            <Route path="/auth" element={<Navigate to="/sign-in" replace />} />
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
            <Route
              path="/enter-your-stats"
              element={
                <PrivateRoute>
                  <Layout>
                    <EnterStatsPage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/elite-timeline"
              element={
                <PrivateRoute>
                  <Layout>
                    <EliteTimelinePage />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/equipment"
              element={
                <PrivateRoute>
                  <Layout>
                    <div className="container mx-auto px-4 py-8">
                      <h1 className="text-4xl font-retro text-center mb-8">
                        Equipment Settings
                      </h1>
                      <EquipmentSettings />
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