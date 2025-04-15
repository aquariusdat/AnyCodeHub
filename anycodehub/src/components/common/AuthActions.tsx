"use client"

import { useEffect, useState } from "react"
import { DarkModeToggle } from "@/components/common"
import { LoginButton } from "@/components/common"
import { UserDropdown } from "@/components/common"
import { authStore } from "@/services/auth.store"

const AuthActions = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    // Check authentication status on mount and whenever auth changes
    const checkAuth = () => {
      setIsAuthenticated(authStore.isAuthenticated())
    }
    
    // Initial check
    checkAuth()
    
    // Setup listener for auth changes
    window.addEventListener("storage", checkAuth)
    
    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <DarkModeToggle />
      {isAuthenticated ? <UserDropdown /> : <LoginButton />}
    </div>
  )
}

export default AuthActions 