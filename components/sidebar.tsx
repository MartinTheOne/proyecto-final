"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, CreditCard, CheckSquare, Briefcase, Settings, BarChart3, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"


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

export function Sidebar() {
  const pathname = usePathname()

  const route = sidebarItems.find((item) => item.href === pathname)
  // Si no hay ruta, no se muestra la barra lateral
  // console.log("pathname", pathname)

  if (!route) {
    return null
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col h-screen">
      <div className="flex flex-col flex-grow bg-[#001F3F] text-white">
        <div className="flex items-center h-16 px-4 border-b border-[#003366]">
          <h1 className="text-xl font-semibold">LegalManager</h1>
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
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.title}
              </Link>
            ))}
          </nav>
          <div className="px-2 py-4 mt-auto border-t border-[#003366]">
            <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-[#002952] hover:text-white transition-colors"
              onClick={() => signOut({ callbackUrl: "/login", redirect: true })}>
              <LogOut className="w-5 h-5 mr-3"/>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
