"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreHorizontal, FileEdit, Trash2, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CasoDialog } from "@/components/dialogs/caso-dialog"
import { DeleteDialog } from "@/components/dialogs/delete-dialog"
import { Casos } from "@/interfaces/ICasos"


interface props{
    InitialData:Casos[]
}



export default function CasosPage({InitialData}:props) {
  const [casos, setCasos] = useState<Casos[]>(InitialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [currentCaso, setCurrentCaso] = useState<any>(null)

  // Filtrar casos según el término de búsqueda y el filtro de estado
  const filteredCasos = casos.filter(
    (caso) =>
      (caso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caso.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caso.tipo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filtroEstado === "todos" || caso.estado.toLowerCase() === filtroEstado.toLowerCase()),
  )

 
    const handleCreateCaso = async (caso: Casos) => {
        const response = await fetch('http://localhost:3000/api/casos', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(caso),
        })
        const data = await response.json()
        setCasos((prev) => [...prev, data])
    }



  const handleDeleteCaso = () => {
    setCasos(casos.filter((caso) => caso._id !== currentCaso.id))
  }

  // Contadores para las tarjetas de resumen
  const casosActivos = casos.filter((caso) => caso.estado === "En proceso").length
  const casosCerrados = casos.filter((caso) => caso.estado === "Cerrado").length

  return (
    <div className="flex flex-col p-4 md:p-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Casos</h1>
        <p className="text-muted-foreground">Gestione todos sus casos legales</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Casos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{casosActivos}</div>
            <p className="text-xs text-muted-foreground">+3 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Casos Cerrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{casosCerrados}</div>
            <p className="text-xs text-muted-foreground">Este año</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5 meses</div>
            <p className="text-xs text-muted-foreground">Para resolución de casos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Casos</CardTitle>
            <CardDescription>Gestione todos sus casos legales</CardDescription>
          </div>
          <Button className="bg-[#001F3F] hover:bg-[#003366]" onClick={() => setOpenCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Caso
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar caso..."
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
                <SelectItem value="en proceso">En proceso</SelectItem>
                <SelectItem value="cerrado">Cerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Fecha Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCasos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No se encontraron casos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCasos.map((caso) => (
                    <TableRow key={caso._id}>
                      <TableCell className="font-medium">{caso.titulo}</TableCell>
                      <TableCell>{caso.cliente}</TableCell>
                      <TableCell>{caso.tipo}</TableCell>
                      <TableCell>{caso.fechaInicio instanceof Date ? caso.fechaInicio.toLocaleDateString() : caso.fechaInicio}</TableCell>
                      <TableCell>
                        {caso.fechaFin
                          ? (caso.fechaFin instanceof Date
                              ? caso.fechaFin.toLocaleDateString()
                              : caso.fechaFin)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            caso.estado === "En proceso" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {caso.estado}
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
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Ver detalles</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentCaso(caso)
                                setOpenEditDialog(true)
                              }}
                            >
                              <FileEdit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setCurrentCaso(caso)
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

      {/* Diálogo para crear caso */}
      <CasoDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onSubmit={handleCreateCaso}
        title="Nuevo Caso"
        description="Agregue un nuevo caso a su sistema"
        buttonText="Crear Caso"
      />

      {/* Diálogo para editar caso */}
      {/* <CasoDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        caso={currentCaso}
        onSubmit={handleEditCaso}
        title="Editar Caso"
        description="Modifique la información del caso"
        buttonText="Guardar Cambios"
      /> */}

      {/* Diálogo para eliminar caso */}
      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleDeleteCaso}
        title="Eliminar Caso"
        description={`¿Está seguro de que desea eliminar el caso "${currentCaso?.titulo}"?`}
        entityName="el caso"
      />
    </div>
  )
}
