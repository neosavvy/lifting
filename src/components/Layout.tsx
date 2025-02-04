import { ReactNode } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <div className="min-h-screen transition-colors duration-200">
      <nav className="bg-gray-100 dark:bg-matrix-light p-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="font-cyber text-xl">Matrix Lifts</span>
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
      </nav>
      <main>{children}</main>
    </div>
  )
} 