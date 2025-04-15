"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure the component is mounted before rendering to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) {
    // Render a placeholder or null during server-side rendering and initial client mount
    return <div className="h-8 w-16 rounded-full bg-gray-200 animate-pulse"></div>
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}
      `}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle between light and dark theme</span>

      {/* Sliding Circle with Icon */}
      <span
        style={{ transform: '.4s ease !important' }}

        className={`absolute left-1 top-1 inline-flex items-center justify-center h-6 w-6 transform rounded-full bg-primary text-white transition-transform duration-300 ${theme === 'light' ? 'translate-x-0' : 'translate-x-8'
          }`
        }
      >
        <div className="transition-opacity duration-1000 ease-in-out">
          {theme === 'light' ? (
            <Sun size={16} />
          ) : (
            <Moon size={16} />
          )}
        </div>
      </span>

      {/* Static Icons inside the track */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 transition-colors duration-500 ease-in-out">
        <Sun size={16} className={`${theme === 'light' ? 'text-transparent' : 'text-gray-400'}`} />
      </div>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors duration-500 ease-in-out">
        <Moon size={16} className={`${theme === 'dark' ? 'text-transparent' : 'text-gray-400'}`} />
      </div>
    </button>
  )
}

export default DarkModeToggle;