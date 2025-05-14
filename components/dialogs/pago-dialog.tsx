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
import { useEffect } from "react"
import type { Pago } from "@/interfaces/Ipago"
import { Cliente } from "@/interfaces/Icliente"
import { Casos } from "@/interfaces/ICasos"

// Datos de ejemplo para los selects


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
  cliente: z.string({ required_error: "El cliente es requerido" }),
  caso: z.string({ required_error: "El caso es requerido" }),
  monto: z.coerce.number().min(0.01, { message: "Ingrese un monto válido mayor a 0" }),
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
  pago?: Pago | null
  onSubmit: (values: Omit<Pago, "_id">) => void
  title: string
  description: string
  buttonText: string
  clientes: Cliente[]
  casos: Casos[]
}

export function PagoDialog({ open, onOpenChange, pago, onSubmit, title, description, buttonText, clientes, casos }: PagoDialogProps) {
  const form = useForm<PagoFormValues>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      cliente: "",
      caso: "",
      monto: 0,
      fecha: new Date(),
      metodo: "",
      estado: "Pendiente",
      comprobante: "",
      notas: "",
    },
  })

  // Actualizar el formulario cuando cambia el pago seleccionado
  useEffect(() => {
    if (pago) {
      form.reset({
        cliente: pago.cliente || "",
        caso: pago.caso || "",
        monto: pago.monto || 0,
        fecha: pago.fecha ? new Date(pago.fecha) : new Date(),
        metodo: pago.metodo || "",
        estado: (pago.estado as "Pendiente" | "Completado" | "Cancelado") || "Pendiente",
        comprobante: pago.comprobante || "",
        notas: pago.notas || "",
      })
    } else {
      form.reset({
        cliente: "",
        caso: "",
        monto: 0,
        fecha: new Date(),
        metodo: "",
        estado: "Pendiente",
        comprobante: "",
        notas: "",
      })
    }
  }, [pago, form])

  function handleSubmit(values: PagoFormValues) {
    // Convertir la fecha a string en formato ISO
    const formattedValues = {
      ...values,
      fecha: values.fecha.toISOString().split("T")[0], // Formato YYYY-MM-DD
    }
    onSubmit(formattedValues)
    onOpenChange(false)
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
            <div className="grid grid-cols-1 md:grid-cols gap-8">
              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un Cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map((c) => (
                          <SelectItem key={c._id} value={c.nombre}>
                            {c.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="caso"
              render={({ field }) =>{
                return(
                <FormItem>
                  <FormLabel>Caso</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un Caso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {casos.map((c) => (
                        <SelectItem key={c._id} value={c.titulo}>
                          {c.titulo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monto"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          className="pl-6 "
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : e.target.value
                            field.onChange(value)
                          }}
                        />
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
