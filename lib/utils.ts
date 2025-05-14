import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Función para formatear fechas que pueden estar en formato ISO o YYYY-MM-DD
export function formatDate(dateString: string): string {
  if (!dateString) return "N/A"

  try {
    // Determinar el formato de la fecha
    let date: Date

    // Si es formato ISO (contiene T)
    if (dateString.includes("T")) {
      date = parseISO(dateString)
    }
    // Si es formato YYYY-MM-DD
    else {
      date = new Date(dateString)
    }

    if (isNaN(date.getTime())) return "Fecha inválida"

    return format(date, "dd/MM/yyyy", { locale: es })
  } catch (error) {
    console.error("Error al formatear fecha:", error)
    return "Fecha inválida"
  }
}

// Función para parsear fechas en cualquier formato a objeto Date
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null

  try {
    // Determinar el formato de la fecha
    if (dateString.includes("T")) {
      return parseISO(dateString)
    } else {
      return new Date(dateString)
    }
  } catch (error) {
    console.error("Error al parsear fecha:", error)
    return null
  }
}
