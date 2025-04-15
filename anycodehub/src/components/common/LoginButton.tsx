"use client"

import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

const LoginButton = () => {
  const router = useRouter()
  
  const handleLogin = () => {
    router.push("/auth")
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogin}
      className="flex items-center gap-1 text-primary hover:text-primary/80"
    >
      <LogIn className="h-4 w-4" />
      <span>Login</span>
    </Button>
  )
}

export default LoginButton 