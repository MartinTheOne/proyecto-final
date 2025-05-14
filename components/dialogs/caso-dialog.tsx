"use client"
import { useEffect, useState } from 'react'
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
import { da, es } from "date-fns/locale"
import { Cliente } from '@/interfaces/Icliente'
import type { Casos } from '@/interfaces/ICasos'



const tiposCaso = [
  "Civil",
  "Penal",
  "Laboral",
  "Familiar",
  "Mercantil",
  "Administrativo",
  "Fiscal",
  "Constitucional",
  "Otro",
]

// Esquema de validación para el formulario de caso
const casoSchema = z.object({
  titulo: z.string().min(2, { message: "El título debe tener al menos 2 caracteres" }),
  descripcion: z.string().optional(),
  cliente: z.string({ required_error: "Seleccione un cliente" }),
  tipo: z.string({ required_error: "Seleccione un tipo de caso" }),
  fechaInicio: z.date({ required_error: "Seleccione una fecha de inicio" }),
  fechaFin: z.date().optional().nullable(),
  estado: z.enum(["En proceso", "En espera", "Cerrado"]),
  notas: z.string().optional(),
})

type CasoFormValues = z.infer<typeof casoSchema>

interface CasoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  caso?: Casos | null
  onSubmit: (values: CasoFormValues) => void
  title: string
  description: string
  buttonText: string
}

export function CasoDialog({ open, onOpenChange, caso, onSubmit, title, description, buttonText }: CasoDialogProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const form = useForm<CasoFormValues>({
    resolver: zodResolver(casoSchema),
    defaultValues: {
      titulo: caso?.titulo || "",
      descripcion: caso?.descripcion || "",
      cliente: caso?.cliente || "",
      tipo: caso?.tipo || "",
      fechaInicio: caso?.fechaInicio || new Date(),
      fechaFin: caso?.fechaFin || null,
      estado: (caso?.estado as "En proceso" | "En espera" | "Cerrado") || "En proceso",
      notas: caso?.notas || "",
    },
  })

  useEffect(() => {
    if (caso) {
      form.reset({
        titulo: caso.titulo || "",
        descripcion: caso.descripcion || "",
        cliente: caso.cliente || "",
        tipo: caso.tipo || "",
        fechaInicio: caso.fechaInicio ? new Date(caso.fechaInicio) : new Date(),
        fechaFin: caso.fechaFin ? new Date(caso.fechaFin) : null,
        estado: (caso.estado as "En proceso" | "En espera" | "Cerrado") || "En proceso",
        notas: caso.notas || "",
      })
    }
  }, [caso, form])

  function handleSubmit(values: CasoFormValues) {
    onSubmit(values)
    onOpenChange(false)
    form.reset()
  }


  useEffect(() => {
    const getClientes = async () => {
      const dataLocal = localStorage.getItem("clientes")
      if (dataLocal) {
        const data = JSON.parse(dataLocal);
        setClientes(data);
      } else {

        try {
          const response = await fetch('/api/clientes')
          const data = await response.json()
          if (response.ok) {
            setClientes(data)
            localStorage.setItem("clientes", JSON.stringify(data))
          } else {
            console.error("Error fetching clientes:", data)
          }
        } catch (ex) {
          console.log(ex)
        }
      }
    }
    getClientes()
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} {...field}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente._id} value={cliente.nombre}>
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
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Caso</FormLabel>
                    <Select onValueChange={field.onChange} {...field}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposCaso.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
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
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Inicio</FormLabel>
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
              <FormField
                control={form.control}
                name="fechaFin"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Cierre (opcional)</FormLabel>
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
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange}{...field}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="En proceso">En proceso</SelectItem>
                      <SelectItem value="En espera">En espera</SelectItem>
                      <SelectItem value="Cerrado">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Textarea placeholder="Notas adicionales sobre el caso"{...field} />
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
