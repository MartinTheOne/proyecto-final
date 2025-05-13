"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, CreditCard, CheckSquare, Briefcase, Settings, BarChart3, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut, useSession } from "next-auth/react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: Users,
  },
  {
    title: "Pagos",
    href: "/pagos",
    icon: CreditCard,
  },
  {
    title: "Tareas",
    href: "/tareas",
    icon: CheckSquare,
  },
  {
    title: "Casos",
    href: "/casos",
    icon: Briefcase,
  },
  {
    title: "Configuración",
    href: "/configuracion",
    icon: Settings,
  },
]



export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const route = sidebarItems.some((item) => pathname.startsWith(item.href))
  if (!route) {
    return null
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-[#001F3F] text-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-[#003366]">
            <h1 className="text-xl font-semibold">LegalManager</h1>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-white">
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar menú</span>
            </Button>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-[#003366] text-white"
                      : "text-gray-300 hover:bg-[#002952] hover:text-white",
                  )}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="px-2 py-4 mt-auto border-t border-[#003366]">
              <div className="px-3 py-2 mb-2 text-sm text-gray-300">
                <p className="font-medium">{session?.user?.name}</p>
                <p className="text-xs opacity-70">{session?.user?.email}</p>
              </div>
              <button
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-[#002952] hover:text-white transition-colors"
                onClick={() => signOut({ callbackUrl: "/login" ,redirect:true})}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
