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

// Esquema de validación para el formulario de tarea
const tareaSchema = z.object({
  titulo: z.string().min(2, { message: "El título debe tener al menos 2 caracteres" }),
  descripcion: z.string().optional(),
  clienteId: z.string({ required_error: "Seleccione un cliente" }),
  casoId: z.string({ required_error: "Seleccione un caso" }),
  fechaLimite: z.date({ required_error: "Seleccione una fecha límite" }),
  prioridad: z.enum(["Alta", "Media", "Baja"]),
  estado: z.enum(["Pendiente", "En progreso", "Completada"]),
})

type TareaFormValues = z.infer<typeof tareaSchema>

interface TareaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tarea?: {
    id?: number
    titulo?: string
    descripcion?: string
    clienteId?: string
    casoId?: string
    fechaLimite?: Date
    prioridad?: string
    estado?: string
  }
  onSubmit: (values: TareaFormValues) => void
  title: string
  description: string
  buttonText: string
}

export function TareaDialog({ open, onOpenChange, tarea, onSubmit, title, description, buttonText }: TareaDialogProps) {
  const form = useForm<TareaFormValues>({
    resolver: zodResolver(tareaSchema),
    defaultValues: {
      titulo: tarea?.titulo || "",
      descripcion: tarea?.descripcion || "",
      clienteId: tarea?.clienteId || "",
      casoId: tarea?.casoId || "",
      fechaLimite: tarea?.fechaLimite || new Date(),
      prioridad: (tarea?.prioridad as "Alta" | "Media" | "Baja") || "Media",
      estado: (tarea?.estado as "Pendiente" | "En progreso" | "Completada") || "Pendiente",
    },
  })

  function handleSubmit(values: TareaFormValues) {
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
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título de la tarea" {...field} />
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
                    <Textarea placeholder="Descripción detallada de la tarea" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fechaLimite"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-[10px]">
                    <FormLabel>Fecha Límite</FormLabel>
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
                name="prioridad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione prioridad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Baja">Baja</SelectItem>
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
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En progreso">En progreso</SelectItem>
                        <SelectItem value="Completada">Completada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
