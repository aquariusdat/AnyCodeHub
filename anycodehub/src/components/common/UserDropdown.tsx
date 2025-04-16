"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"
import { useMemo } from "react"

const UserDropdown = () => {
  const router = useRouter()
  const getUser = useAuthStore((state) => state.getUser);
  const user = useMemo(() => getUser(), [getUser]);
  
  // Get initials from user's first and last name
  const getInitials = () => {
    debugger;
    if (!user) return "?"
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
  }
  
  const handleLogout = async () => {
    // Thực hiện logout nhưng không tự chuyển trang
    await useAuthStore.getState().clearAuth()
  }
  
  const handleProfile = () => {
    router.push("/profile")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20"
        >
          {getInitials()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm font-medium">
          {user ? `${user.firstName} ${user.lastName}` : "User"}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown 