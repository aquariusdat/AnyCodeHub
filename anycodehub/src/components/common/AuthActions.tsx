"use client"

import { DarkModeToggle } from "@/components/common"
import { LoginButton } from "@/components/common"
import { UserDropdown } from "@/components/common"
import { useAuthStore } from "@/stores/auth.store"

const AuthActions = () => {
  // Sử dụng Zustand store trực tiếp
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  
  // Subscribe để đảm bảo component được render lại khi auth state thay đổi
  useAuthStore((state) => state.user)

  return (
    <div className="flex items-center gap-2">
      <DarkModeToggle />
      {isAuthenticated ? <UserDropdown /> : <LoginButton />}
    </div>
  )
}

export default AuthActions 