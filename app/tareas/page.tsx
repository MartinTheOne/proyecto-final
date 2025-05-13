"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreHorizontal, FileEdit, Trash2, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TareaDialog } from "@/components/dialogs/tarea-dialog"
import { DeleteDialog } from "@/components/dialogs/delete-dialog"

// Datos de ejemplo para tareas
const tareasData = [
  {
    id: 1,
    titulo: "Preparar documentación para audiencia",
    cliente: "Juan Pérez",
    caso: "Reclamación laboral",
    fechaLimite: "12/05/2025",
    prioridad: "Alta",
    estado: "Pendiente",
  },
  {
    id: 2,
    titulo: "Reunión con cliente",
    cliente: "María López",
    caso: "Divorcio",
    fechaLimite: "13/05/2025",
    prioridad: "Media",
    estado: "Pendiente",
  },
  {
    id: 3,
    titulo: "Presentar recurso de apelación",
    cliente: "Carlos Rodríguez",
    caso: "Herencia",
    fechaLimite: "15/05/2025",
    prioridad: "Alta",
    estado: "Pendiente",
  },
  {
    id: 4,
    titulo: "Revisar contrato",
    cliente: "Ana Martínez",
    caso: "Reclamación de seguro",
    fechaLimite: "10/05/2025",
    prioridad: "Baja",
    estado: "Completada",
  },
  {
    id: 5,
    titulo: "Preparar informe pericial",
    cliente: "Roberto Sánchez",
    caso: "Disputa contractual",
    fechaLimite: "20/05/2025",
    prioridad: "Media",
    estado: "Completada",
  },
]

export default function TareasPage() {
  const [tareas, setTareas] = useState(tareasData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [currentTarea, setCurrentTarea] = useState<any>(null)

  // Filtrar tareas según el término de búsqueda y el filtro de estado
  const filteredTareas = tareas.filter(
    (tarea) =>
      (tarea.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarea.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarea.caso.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filtroEstado === "todos" || tarea.estado.toLowerCase() === filtroEstado.toLowerCase()),
  )

  // Funciones para manejar los diálogos
  const handleCreateTarea = (values: any) => {
    const newTarea = {
      id: tareas.length + 1,
      titulo: values.titulo,
      cliente: "Cliente Asignado", // Esto se reemplazaría con el nombre real del cliente
      caso: "Caso Asignado", // Esto se reemplazaría con el título real del caso
      fechaLimite: values.fechaLimite.toLocaleDateString(),
      prioridad: values.prioridad,
      estado: values.estado,
    }
    setTareas([...tareas, newTarea])
  }

  const handleEditTarea = (values: any) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === currentTarea.id
          ? {
              ...tarea,
              titulo: values.titulo,
              fechaLimite: values.fechaLimite.toLocaleDateString(),
              prioridad: values.prioridad,
              estado: values.estado,
            }
          : tarea,
      ),
    )
  }

  const handleDeleteTarea = () => {
    setTareas(tareas.filter((tarea) => tarea.id !== currentTarea.id))
  }

  const handleCompletarTarea = (id: number) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id
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
                    <TableRow key={tarea.id}>
                      <TableCell className="font-medium">{tarea.titulo}</TableCell>
                      <TableCell>{tarea.cliente}</TableCell>
                      <TableCell>{tarea.caso}</TableCell>
                      <TableCell>{tarea.fechaLimite}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tarea.prioridad === "Alta"
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
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tarea.estado === "Completada"
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
                              <DropdownMenuItem onClick={() => handleCompletarTarea(tarea.id)}>
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
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onSubmit={handleCreateTarea}
        title="Nueva Tarea"
        description="Agregue una nueva tarea a su sistema"
        buttonText="Crear Tarea"
      />

      {/* Diálogo para editar tarea */}
      <TareaDialog
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
