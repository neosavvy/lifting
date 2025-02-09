import { useEffect, useState } from 'react'

type ToastProps = {
  message: string
  duration?: number
  onClose: () => void
  type?: 'success' | 'error'
}

export function Toast({ message, duration = 3000, onClose, type = 'success' }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const baseClasses = `fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg 
    transition-all duration-300 font-cyber text-sm z-50`
  
  const typeClasses = type === 'success' 
    ? 'bg-matrix-green text-black' 
    : 'bg-red-600 text-white'
  
  const visibilityClasses = isVisible 
    ? 'opacity-100 translate-y-0' 
    : 'opacity-0 translate-y-2'

  return (
    <div className={`${baseClasses} ${typeClasses} ${visibilityClasses}`}>
      {message}
    </div>
  )
}
