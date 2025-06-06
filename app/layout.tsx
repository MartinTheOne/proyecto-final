import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { LoadingProvider } from "@/components/loading-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gestión para Abogados",
  description: "Aplicación de gestión de clientes para abogados",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center h-16 px-4 border-b md:hidden">
                  <MobileSidebar />
                  <h1 className="ml-2 text-xl font-semibold">Gestion para Abogados</h1>
                </header>
                <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950 relative">
                  <LoadingProvider>{children}</LoadingProvider>
                </main>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
