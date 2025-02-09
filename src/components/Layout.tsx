import { ReactNode, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { darkMode, toggleDarkMode } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAuthClick = () => {
    if (user) {
      setShowDropdown(!showDropdown)
    } else {
      navigate('/auth')
    }
  }

  const handleLogout = async () => {
    await signOut()
    setShowDropdown(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen transition-colors duration-200 overflow-x-hidden">
      <nav className="bg-gray-100 dark:bg-matrix-light p-4 max-w-full">
        <div className="container mx-auto flex justify-between items-center">
          <span className="font-cyber text-xl">Lift!</span>
          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleAuthClick}
                className="px-4 py-2 rounded-lg bg-matrix-dark text-white hover:bg-matrix-light"
              >
                {user ? 'Profile' : 'Sign In'}
              </button>
              {showDropdown && user && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-black border border-matrix-light">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-black dark:text-[#00ff00] border-b border-matrix-light">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-black dark:text-[#00ff00] hover:bg-gray-100 dark:hover:bg-matrix-dark"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-matrix-dark"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>
      <main className="h-[calc(100vh-4rem)] overflow-y-auto scroll-smooth">{children}</main>
    </div>
  )
} 