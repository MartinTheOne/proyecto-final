"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreHorizontal, FileEdit, Trash2, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TareaDialog } from "@/components/dialogs/tarea-dialog"
import { DeleteDialog } from "@/components/dialogs/delete-dialog"
import { Tareas } from "@/interfaces/ITareas"
import { toast } from "@/components/ui/use-toast"
import { Cliente } from "@/interfaces/Icliente"
import { Casos } from "@/interfaces/ICasos"

interface props {
  InitialTareas: Tareas[]
}

export default function TareasPage({ InitialTareas }: props) {
  const [tareas, setTareas] = useState<Tareas[]>(InitialTareas)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [currentTarea, setCurrentTarea] = useState<Tareas | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [casos, setCasos] = useState<Casos[]>([])

  useEffect(() => {
    const getClientes = async () => {
      const dateLocal = localStorage.getItem("clientes");
      if (dateLocal) {
        const data = JSON.parse(dateLocal);
        setClientes(data);
      }
      else {
        try {
          const response = await fetch(`/api/clientes`)
          if (!response.ok) {
            throw new Error('Error al obtener los clientes')
          }
          const data = await response.json()
          setClientes(data)
          localStorage.setItem("clientes", JSON.stringify(data));
        } catch (error) {
          console.error("Error al obtener los clientes:", error)
        }
      }
    }
    const getCasos = async () => {
      const dateLocal = localStorage.getItem("casos");
      if (dateLocal) {
        const data = JSON.parse(dateLocal);
        setCasos(data);
      }
      else {
        try {
          const response = await fetch(`/api/casos`)
          if (!response.ok) {
            throw new Error('Error al obtener los clientes')
          }
          const data = await response.json()
          setCasos(data)
          localStorage.setItem("casos", JSON.stringify(data));
        } catch (error) {
          console.error("Error al obtener los clientes:", error)
        }
      }
    }
    getClientes()
    getCasos()
  }, [InitialTareas])


  // Filtrar tareas según el término de búsqueda y el filtro de estado
  const filteredTareas = tareas.filter(
    (tarea) =>
      (tarea.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarea.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarea.caso.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filtroEstado === "todos" || tarea.estado.toLowerCase() === filtroEstado.toLowerCase()),
  )

  // Funciones para manejar los diálogos
  const handleCreateTarea = async (values: Omit<Tareas, "_id">) => {
    try {
      const response = await fetch("/api/tareas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      if (!response.ok) {
        throw new Error(`Error al crear el cliente: ${response.statusText}`)
      }
      const insertedId = await response.json()


      const newTarea: Tareas = {
        _id: insertedId,
        ...values,
      }

      setTareas([...tareas, newTarea])

      toast({
        title: "Tarea creada",
        description: "La Tarea ha sido creado exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la tarea. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleEditTarea = async (values: any) => {
    if (!currentTarea) return;
    try {
      const response = await fetch(`/api/tareas`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, id: currentTarea._id }),
      })
      if (!response.ok) {
        throw new Error(`Error al crear el cliente: ${response.statusText}`)
      }
      const updatedTarea = tareas.map((tarea) =>
        tarea._id === currentTarea._id ? { ...tarea, ...values } : tarea,
      )


      toast({
        title: "Tarea actualizada",
        description: "La tarea ha sido actualizada exitosamente.",
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo editar la tarea. Por favor, intente de nuevo.",
        variant: "destructive",
      });
    }
  }

  const handleDeleteTarea = async () => {
    if (!currentTarea) return;

    try {
      const response = await fetch("/api/tareas", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentTarea._id,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar el cliente: ${response.statusText}`)
      }

      setTareas(tareas.filter((t) => t._id !== currentTarea._id))

      toast({
        title: "Tarea eliminada",
        description: "La tarea ha sido eliminado exitosamente.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Hubo un error al eliminar la tarea.",
      })
    }
  }

  const handleCompletarTarea = (id: String) => {
    setTareas(
      tareas.map((tarea) =>
        tarea._id === id
          ? {
            ...tarea,
            estado: "Completada",
          }
          : tarea,
      ),
    )
  }

  // Contadores para las tarjetas de resumen
  const tareasPendientes = tareas.filter((tarea) => tarea.estado === "Pendiente").length
  const tareasCompletadas = tareas.filter((tarea) => tarea.estado === "Completada").length
  const tareasPrioridadAlta = tareas.filter(
    (tarea) => tarea.estado === "Pendiente" && tarea.prioridad === "Alta",
  ).length

  return (
    <div className="flex flex-col p-4 md:p-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tareas</h1>
        <p className="text-muted-foreground">Gestione sus tareas y actividades</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tareasPendientes}</div>
            <p className="text-xs text-muted-foreground">{tareasPrioridadAlta} con prioridad alta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tareasCompletadas}</div>
            <p className="text-xs text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Próximos Vencimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">En las próximas 24 horas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Tareas</CardTitle>
            <CardDescription>Gestione todas sus tareas y actividades</CardDescription>
          </div>
          <Button className="bg-[#001F3F] hover:bg-[#003366]" onClick={() => setOpenCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Tarea
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar tarea..."
                className="pl-8 bg-white dark:bg-gray-950"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Caso</TableHead>
                  <TableHead>Fecha Límite</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTareas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No se encontraron tareas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTareas.map((tarea) => (
                    <TableRow key={tarea._id}>
                      <TableCell className="font-medium">{tarea.titulo}</TableCell>
                      <TableCell>{tarea.cliente}</TableCell>
                      <TableCell>{tarea.caso}</TableCell>
                      <TableCell>{new Date(tarea.fechaLimite).toLocaleDateString('es-AR')}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tarea.prioridad === "Alta"
                            ? "bg-red-100 text-red-800"
                            : tarea.prioridad === "Media"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {tarea.prioridad}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tarea.estado === "Completada"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {tarea.estado}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {tarea.estado === "Pendiente" && (
                              <DropdownMenuItem onClick={() => handleCompletarTarea(tarea._id)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                <span>Marcar como completada</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentTarea(tarea)
                                setOpenEditDialog(true)
                              }}
                            >
                              <FileEdit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setCurrentTarea(tarea)
                                setOpenDeleteDialog(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para crear tarea */}
      <TareaDialog
        casos={casos}
        clientes={clientes}
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onSubmit={(values) => {
          const tareaData: Omit<Tareas, "_id"> = {
            ...values,
            descripcion: values.descripcion ?? ""
          };
          return handleCreateTarea(tareaData);
        }}
        title="Nueva Tarea"
        description="Agregue una nueva tarea a su sistema"
        buttonText="Crear Tarea"
      />

      {/* Diálogo para editar tarea */}
      <TareaDialog
        casos={casos}
        clientes={clientes}
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        tarea={currentTarea}
        onSubmit={handleEditTarea}
        title="Editar Tarea"
        description="Modifique la información de la tarea"
        buttonText="Guardar Cambios"
      />

      {/* Diálogo para eliminar tarea */}
      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleDeleteTarea}
        title="Eliminar Tarea"
        description={`¿Está seguro de que desea eliminar la tarea "${currentTarea?.titulo}"?`}
        entityName="la tarea"
      />
    </div>
  )
}

