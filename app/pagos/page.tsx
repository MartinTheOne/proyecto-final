"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreHorizontal, FileEdit, Trash2, Download, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PagoDialog } from "@/components/dialogs/pago-dialog"
import { DeleteDialog } from "@/components/dialogs/delete-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Datos de ejemplo para pagos
const pagosData = [
  {
    id: 1,
    cliente: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    caso: "Reclamación laboral",
    monto: 2500,
    fecha: "12/05/2025",
    metodo: "Transferencia",
    estado: "Completado",
    comprobante: "TRF-12345",
    notas: "Pago por servicios de asesoría legal",
  },
  {
    id: 2,
    cliente: "María López",
    email: "maria.lopez@ejemplo.com",
    caso: "Divorcio",
    monto: 1800,
    fecha: "10/05/2025",
    metodo: "Tarjeta de crédito",
    estado: "Completado",
    comprobante: "CC-67890",
    notas: "Pago inicial por trámites de divorcio",
  },
  {
    id: 3,
    cliente: "Carlos Rodríguez",
    email: "carlos.rodriguez@ejemplo.com",
    caso: "Herencia",
    monto: 3200,
    fecha: "05/05/2025",
    metodo: "Efectivo",
    estado: "Completado",
    comprobante: "EFT-54321",
    notas: "Pago por gestión de herencia",
  },
  {
    id: 4,
    cliente: "Ana Martínez",
    email: "ana.martinez@ejemplo.com",
    caso: "Reclamación de seguro",
    monto: 1500,
    fecha: "01/06/2025",
    metodo: "Transferencia",
    estado: "Pendiente",
    comprobante: "TRF-98765",
    notas: "Pago parcial por reclamación de seguro",
  },
  {
    id: 5,
    cliente: "Roberto Sánchez",
    email: "roberto.sanchez@ejemplo.com",
    caso: "Disputa contractual",
    monto: 2000,
    fecha: "15/06/2025",
    metodo: "Cheque",
    estado: "Pendiente",
    comprobante: "CHK-24680",
    notas: "Pago por asesoría en disputa contractual",
  },
]

export default function PagosPage() {
  const router = useRouter()
  const [pagos, setPagos] = useState(pagosData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [currentPago, setCurrentPago] = useState<any>(null)
  const [isDownloading, setIsDownloading] = useState<number | null>(null)

  // Filtrar pagos según el término de búsqueda y el filtro de estado
  const filteredPagos = pagos.filter(
    (pago) =>
      (pago.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.caso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.metodo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pago.monto.toString().includes(searchTerm)) &&
      (filtroEstado === "todos" || pago.estado.toLowerCase() === filtroEstado.toLowerCase()),
  )

  // Funciones para manejar los diálogos
  const handleCreatePago = (values: any) => {
    const newPago = {
      id: pagos.length + 1,
      cliente: "Cliente Asignado", // Esto se reemplazaría con el nombre real del cliente
      email: "",
      caso: "Caso Asignado", // Esto se reemplazaría con el título real del caso
      monto: values.monto, // Ya es un número gracias a z.coerce.number()
      fecha: values.fecha.toLocaleDateString(),
      metodo: values.metodo,
      estado: values.estado,
      comprobante: "",
      notas: "",
    }
    setPagos([...pagos, newPago])
  }

  const handleEditPago = (values: any) => {
    setPagos(
      pagos.map((pago) =>
        pago.id === currentPago.id
          ? {
              ...pago,
              monto: values.monto, // Ya es un número gracias a z.coerce.number()
              fecha: values.fecha.toLocaleDateString(),
              metodo: values.metodo,
              estado: values.estado,
            }
          : pago,
      ),
    )
  }

  const handleDeletePago = () => {
    setPagos(pagos.filter((pago) => pago.id !== currentPago.id))
  }

  // Función para descargar el recibo
  const handleDownloadReceipt = async (id: number) => {
    try {
      setIsDownloading(id)

      // Verificar si el pago existe
      const pago = pagos.find((p) => p.id === id)
      if (!pago) {
        toast({
          title: "Error",
          description: "No se encontró el pago solicitado",
          variant: "destructive",
        })
        setIsDownloading(null)
        return
      }

      // Si el pago está pendiente, mostrar una advertencia
      if (pago.estado === "Pendiente") {
        toast({
          title: "Advertencia",
          description: "Este pago está pendiente. El recibo incluirá una marca de agua.",
        })
      }

      // Realizar la solicitud para descargar el PDF
      const response = await fetch(`/api/recibos/${id}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error al descargar el recibo: ${response.statusText}`)
      }

      // Obtener el blob del PDF
      const blob = await response.blob()

      // Crear un objeto URL para el blob
      const url = window.URL.createObjectURL(blob)

      // Crear un elemento <a> para descargar el archivo
      const a = document.createElement("a")
      a.href = url
      a.download = `recibo-${id}.pdf`
      document.body.appendChild(a)
      a.click()

      // Limpiar
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Éxito",
        description: "Recibo descargado correctamente",
      })
    } catch (error) {
      console.error("Error al descargar el recibo:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "No se pudo descargar el recibo. Inténtelo de nuevo más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(null)
    }
  }

  // Cálculos para las tarjetas de resumen
  const totalRecibido = pagos.filter((pago) => pago.estado === "Completado").reduce((sum, pago) => sum + pago.monto, 0)

  const totalPendiente = pagos.filter((pago) => pago.estado === "Pendiente").reduce((sum, pago) => sum + pago.monto, 0)

  const pagosPendientes = pagos.filter((pago) => pago.estado === "Pendiente").length
  const pagosCompletados = pagos.filter((pago) => pago.estado === "Completado").length

  // Método de pago más usado
  const metodosCount: Record<string, number> = {}
  pagos.forEach((pago) => {
    metodosCount[pago.metodo] = (metodosCount[pago.metodo] || 0) + 1
  })

  let metodoMasUsado = ""
  let maxCount = 0

  for (const metodo in metodosCount) {
    if (metodosCount[metodo] > maxCount) {
      maxCount = metodosCount[metodo]
      metodoMasUsado = metodo
    }
  }

  const porcentajeMetodoMasUsado = Math.round((maxCount / pagos.length) * 100)

  return (
    <div className="flex flex-col p-4 md:p-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Pagos</h1>
        <p className="text-muted-foreground">Gestione los pagos de sus clientes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Recibido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRecibido.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPendiente.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{pagosPendientes} pagos pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pagos Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagosCompletados}</div>
            <p className="text-xs text-muted-foreground">Últimos 30 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Método más usado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metodoMasUsado}</div>
            <p className="text-xs text-muted-foreground">{porcentajeMetodoMasUsado}% de los pagos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>Gestione todos los pagos de sus clientes</CardDescription>
          </div>
          <Button className="bg-[#001F3F] hover:bg-[#003366]" onClick={() => setOpenCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Registrar Pago
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar pago..."
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
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Caso</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPagos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No se encontraron pagos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPagos.map((pago) => (
                    <TableRow key={pago.id}>
                      <TableCell className="font-medium">{pago.cliente}</TableCell>
                      <TableCell>{pago.caso}</TableCell>
                      <TableCell>${pago.monto.toLocaleString()}</TableCell>
                      <TableCell>{pago.fecha}</TableCell>
                      <TableCell>{pago.metodo}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            pago.estado === "Completado"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {pago.estado}
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
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentPago(pago)
                                setOpenEditDialog(true)
                              }}
                            >
                              <FileEdit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDownloadReceipt(pago.id)}
                              disabled={isDownloading === pago.id}
                            >
                              {isDownloading === pago.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="mr-2 h-4 w-4" />
                              )}
                              <span>{isDownloading === pago.id ? "Descargando..." : "Descargar recibo"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setCurrentPago(pago)
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

      {/* Diálogo para crear pago */}
      <PagoDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onSubmit={handleCreatePago}
        title="Registrar Pago"
        description="Agregue un nuevo pago al sistema"
        buttonText="Registrar Pago"
      />

      {/* Diálogo para editar pago */}
      <PagoDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        pago={currentPago}
        onSubmit={handleEditPago}
        title="Editar Pago"
        description="Modifique la información del pago"
        buttonText="Guardar Cambios"
      />

      {/* Diálogo para eliminar pago */}
      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleDeletePago}
        title="Eliminar Pago"
        description={`¿Está seguro de que desea eliminar el pago de ${currentPago?.cliente}?`}
        entityName="el pago"
      />
    </div>
  )
}
