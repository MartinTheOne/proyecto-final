import type { Metadata } from "next"
import Image from "next/image"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login - LegalManager",
  description: "Acceda a su cuenta de LegalManager",
}

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto grid w-full max-w-[1000px] grid-cols-1 md:grid-cols-2 lg:grid-cols-2 overflow-hidden rounded-2xl border border-border shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-4 bg-[#001F3F] px-8 py-12 text-white">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="relative h-[100px] w-[100px] ">
              <Image
                src="/abogado.jpg"
                alt="Logo"
                width={100}
                height={180}
                className="rounded-full bg-gray-200 p-2"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter">Legal Manager</h1>
              <p className="text-muted-foreground text-gray-300">
                Sistema de gestión integral para profesionales del derecho
              </p>
            </div>
            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <p className="text-sm">Gestión de clientes</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <p className="text-sm">Seguimiento de casos</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <p className="text-sm">Control de pagos</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <p className="text-sm">Administración de tareas</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h2>
              <p className="text-sm text-muted-foreground">Ingrese sus credenciales para acceder a su cuenta</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
