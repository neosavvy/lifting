import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

type AuthPageProps = {
  mode?: 'sign-in' | 'sign-up'
}

export default function AuthPage({ mode = 'sign-in' }: AuthPageProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/workout')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-matrix-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Home Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate('/')}
            className="text-matrix-green font-cyber bg-matrix-dark/40 hover:bg-matrix-green/20 
                     p-3 rounded-lg border border-matrix-green/30 hover:border-matrix-green 
                     transition-all duration-200 transform hover:scale-105 hover:shadow-glow"
            title="Back to Home"
          >
            Home
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-retro text-matrix-green mb-4">
            {mode === 'sign-up' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="font-cyber text-matrix-green/80">
            {mode === 'sign-up' 
              ? 'Join us at the Arnold Classic and start tracking your lifts!'
              : 'Sign in to continue your strength journey'}
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-matrix-green/30">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#00ff00',
                    brandAccent: '#00cc00',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                label: 'auth-label',
                message: 'auth-message',
              },
            }}
            view={mode === 'sign-up' ? 'sign_up' : 'sign_in'}
            theme="dark"
            providers={[]}
          />
        </div>

        <div className="text-center mt-6">
          <p className="font-cyber text-matrix-green/60">
            {mode === 'sign-up' ? (
              <>
                Already have an account?{' '}
                <Link to="/sign-in" className="text-matrix-green hover:text-matrix-green/80">
                  Sign In
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/sign-up" className="text-matrix-green hover:text-matrix-green/80">
                  Sign Up
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
} 