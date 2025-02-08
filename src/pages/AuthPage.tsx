import { useEffect } from 'react'
import { Auth } from '../components/Auth'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/workout')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black p-8 rounded-lg border border-matrix-light">
        <h1 className="text-[#00ff00] text-2xl font-cyber mb-8 text-center">Lift! Authentication</h1>
        <Auth />
      </div>
    </div>
  )
} 