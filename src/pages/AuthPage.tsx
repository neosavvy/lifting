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
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-[90vw] sm:max-w-md bg-black p-4 sm:p-8 rounded-lg border border-matrix-light overflow-hidden">
        <h1 className="text-[#00ff00] text-xl sm:text-2xl font-cyber mb-6 sm:mb-8 text-center break-words">Lift! Authentication</h1>
        <Auth />
      </div>
    </div>
  )
} 