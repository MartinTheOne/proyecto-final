"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="text-sm text-muted-foreground">Cargando...</div>
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:block">
        <p className="text-sm font-medium">{session?.user?.name}</p>
        <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-gray-300 hover:bg-[#002952] hover:text-white"
      >
        <LogOut className="h-5 w-5" />
        <span className="sr-only">Cerrar sesión</span>
      </Button>
    </div>
  )
}
