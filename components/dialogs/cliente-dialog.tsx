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
  import type { Cliente } from "@/interfaces/Icliente"
  import { useEffect } from "react"

  // Esquema de validación para el formulario de cliente
  const clienteSchema = z.object({
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z.string().email({ message: "Ingrese un email válido" }),
    telefono: z.string().min(6, { message: "Ingrese un número de teléfono válido" }),
    direccion: z.string().optional(),
    caso: z.string().default("Sin asignar"),
    estado: z.enum(["Activo", "Inactivo", "En espera"]),
    notas: z.string().optional(),
  })

  type ClienteFormValues = z.infer<typeof clienteSchema>

  interface ClienteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    cliente?: Cliente | null
    onSubmit: (values: ClienteFormValues) => void
    title: string
    description: string
    buttonText: string
  }

  export function ClienteDialog({
    open,
    onOpenChange,
    cliente,
    onSubmit,
    title,
    description,
    buttonText,
  }: ClienteDialogProps) {
    const form = useForm<ClienteFormValues>({
      resolver: zodResolver(clienteSchema),
      defaultValues: {
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        caso: "Sin asignar",
        estado: "Activo",
        notas: "",
      },
    })

    // Actualizar el formulario cuando cambia el cliente seleccionado
    useEffect(() => {
      if (cliente) {
        form.reset({
          nombre: cliente.nombre || "",
          email: cliente.email || "",
          telefono: cliente.telefono || "",
          direccion: cliente.direccion || "",
          caso: cliente.caso || "Sin asignar",
          estado: (cliente.estado as "Activo" | "Inactivo" | "En espera") || "Activo",
          notas: cliente.notas || "",
        })
      } else {
        form.reset({
          nombre: "",
          email: "",
          telefono: "",
          direccion: "",
          caso: "Sin asignar",
          estado: "Activo",
          notas: "",
        })
      }
    }, [cliente, form])

    function handleSubmit(values: ClienteFormValues) {
      onSubmit(values)
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
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+543818725612" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Dirección del cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="caso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caso</FormLabel>
                    <FormControl>
                      <Input placeholder="Caso asociado" {...field} />
                    </FormControl>
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
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                        <SelectItem value="En espera">En espera</SelectItem>
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
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notas adicionales sobre el cliente" {...field} />
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
