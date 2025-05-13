"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Datos de ejemplo para los selects
const clientes = [
  { id: "1", nombre: "Juan Pérez" },
  { id: "2", nombre: "María López" },
  { id: "3", nombre: "Carlos Rodríguez" },
  { id: "4", nombre: "Ana Martínez" },
  { id: "5", nombre: "Roberto Sánchez" },
]

const casos = [
  { id: "1", titulo: "Reclamación laboral" },
  { id: "2", titulo: "Divorcio" },
  { id: "3", titulo: "Herencia" },
  { id: "4", titulo: "Reclamación de seguro" },
  { id: "5", titulo: "Disputa contractual" },
]

const metodosPago = [
  "Efectivo",
  "Transferencia bancaria",
  "Tarjeta de crédito",
  "Tarjeta de débito",
  "Cheque",
  "Depósito bancario",
  "Otro",
]

// Esquema de validación para el formulario de pago
const pagoSchema = z.object({
  clienteId: z.string({ required_error: "Seleccione un cliente" }),
  casoId: z.string({ required_error: "Seleccione un caso" }),
  monto: z.string().min(1, { message: "Ingrese un monto válido" }),
  fecha: z.date({ required_error: "Seleccione una fecha" }),
  metodo: z.string({ required_error: "Seleccione un método de pago" }),
  estado: z.enum(["Pendiente", "Completado", "Cancelado"]),
  comprobante: z.string().optional(),
  notas: z.string().optional(),
})

type PagoFormValues = z.infer<typeof pagoSchema>

interface PagoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pago?: {
    id?: number
    clienteId?: string
    casoId?: string
    monto?: string
    fecha?: Date
    metodo?: string
    estado?: string
    comprobante?: string
    notas?: string
  }
  onSubmit: (values: PagoFormValues) => void
  title: string
  description: string
  buttonText: string
}

export function PagoDialog({ open, onOpenChange, pago, onSubmit, title, description, buttonText }: PagoDialogProps) {
  const form = useForm<PagoFormValues>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      clienteId: pago?.clienteId || "",
      casoId: pago?.casoId || "",
      monto: pago?.monto || "",
      fecha: pago?.fecha || new Date(),
      metodo: pago?.metodo || "",
      estado: (pago?.estado as "Pendiente" | "Completado" | "Cancelado") || "Pendiente",
      comprobante: pago?.comprobante || "",
      notas: pago?.notas || "",
    },
  })

  function handleSubmit(values: PagoFormValues) {
    onSubmit(values)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="casoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un caso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {casos.map((caso) => (
                          <SelectItem key={caso.id} value={caso.id}>
                            {caso.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input type="number" step="0.01" min="0" className="pl-6" placeholder="0.00" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="metodo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pago</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {metodosPago.map((metodo) => (
                          <SelectItem key={metodo} value={metodo}>
                            {metodo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="Completado">Completado</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="comprobante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Comprobante (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Número de comprobante o referencia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas adicionales</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notas adicionales sobre el pago" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#001F3F] hover:bg-[#003366]">
                {buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
