import { ReactNode, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { SunIcon, MoonIcon, Cog6ToothIcon } from '@heroicons/react/24/solid'

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

  const handleCycleSettings = () => {
    setShowDropdown(false)
    navigate('/enter-your-stats')
  }

  const handleEquipmentSettings = () => {
    setShowDropdown(false)
    navigate('/equipment')
  }

  // Prevent zoom on double tap
  const preventZoom = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener('touchstart', preventZoom, { passive: false });
    return () => document.removeEventListener('touchstart', preventZoom);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-200">
      <nav className="bg-gray-100 dark:bg-matrix-light p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <span className="font-cyber text-xl">Lift!</span>
          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleAuthClick}
                className="px-4 py-2 rounded-lg bg-matrix-dark text-white hover:bg-matrix-light flex items-center gap-2"
              >
                <Cog6ToothIcon className="h-5 w-5" />
                {user ? 'Settings' : 'Sign In'}
              </button>
              {showDropdown && user && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-black border border-matrix-light">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-black dark:text-[#00ff00] border-b border-matrix-light font-cyber">
                      {user.email}
                    </div>
                    <button
                      onClick={handleCycleSettings}
                      className="block w-full text-left px-4 py-2 text-sm text-black dark:text-[#00ff00] hover:bg-gray-100 dark:hover:bg-matrix-dark font-cyber"
                    >
                      Cycle Settings
                    </button>
                    <button
                      onClick={handleEquipmentSettings}
                      className="block w-full text-left px-4 py-2 text-sm text-black dark:text-[#00ff00] hover:bg-gray-100 dark:hover:bg-matrix-dark font-cyber"
                    >
                      Equipment Settings
                    </button>
                    <div className="border-t border-matrix-light">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-black dark:text-[#00ff00] hover:bg-gray-100 dark:hover:bg-matrix-dark font-cyber"
                      >
                        Sign Out
                      </button>
                    </div>
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