import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import WorkoutForm from './components/WorkoutForm'

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-retro text-center mb-8">
            5x3x1 Weightlifting Planner
          </h1>
          <WorkoutForm />
        </div>
      </Layout>
    </ThemeProvider>
  )
}

export default App 