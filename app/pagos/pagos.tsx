"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreHorizontal, FileEdit, Trash2, Download, Loader2, Flag } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PagoDialog } from "@/components/dialogs/pago-dialog"
import { DeleteDialog } from "@/components/dialogs/delete-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useLoading } from "@/components/loading-provider"
import type { Pago } from "@/interfaces/Ipago"
import { Cliente } from "@/interfaces/Icliente"
import { Casos } from "@/interfaces/ICasos"

interface PagosPageProps {
  pagos: Pago[]
}

export default function PagosPage({ pagos: pagosinitial }: PagosPageProps) {
  const { startLoading, stopLoading } = useLoading()
  const [pagos, setPagos] = useState<Pago[]>(pagosinitial)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [currentPago, setCurrentPago] = useState<Pago | null>(null)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
  }, [pagosinitial])


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
  const handleCreatePago = async (values: Omit<Pago, "_id">) => {
    try {
      startLoading()
      const response = await fetch("/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Error al crear el pago: ${response.statusText}`)
      }

      const newPago = await response.json()
      setPagos([...pagos, newPago])

      toast({
        title: "Pago registrado",
        description: "El pago ha sido registrado exitosamente.",
      })
    } catch (error) {
      console.error("Error al crear el pago:", error)
      toast({
        title: "Error",
        description: "No se pudo registrar el pago. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  const handleEditPago = async (values: Omit<Pago, "_id">) => {
    if (!currentPago || !currentPago._id) return

    try {
      startLoading()
      const response = await fetch("/api/pagos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: currentPago._id,
          ...values,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error al actualizar el pago: ${response.statusText}`)
      }

      // Actualizar el pago en la lista local
      setPagos(
        pagos.map((pago) =>
          pago._id === currentPago._id
            ? {
              ...pago,
              ...values,
            }
            : pago,
        ),
      )

      toast({
        title: "Pago actualizado",
        description: "El pago ha sido actualizado exitosamente.",
      })
    } catch (error) {
      console.error("Error al actualizar el pago:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el pago. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  const handleDeletePago = async () => {
    if (!currentPago || !currentPago._id) return

    try {
      startLoading()
      const response = await fetch("/api/pagos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: currentPago._id,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar el pago: ${response.statusText}`)
      }

      // Eliminar el pago de la lista local
      setPagos(pagos.filter((pago) => pago._id !== currentPago._id))

      toast({
        title: "Pago eliminado",
        description: "El pago ha sido eliminado exitosamente.",
      })
    } catch (error) {
      console.error("Error al eliminar el pago:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el pago. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  // Función para descargar el recibo
  const handleDownloadReceipt = async (id: string) => {
    try {
      setIsDownloading(id)
      startLoading() // Iniciar estado de carga global

      // Verificar si el pago existe
      const pago = pagos.find((p) => p._id === id)
      if (!pago) {
        toast({
          title: "Error",
          description: "No se encontró el pago solicitado",
          variant: "destructive",
        })
        setIsDownloading(null)
        stopLoading() // Detener estado de carga global
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
      stopLoading() // Detener estado de carga global
    }
  }

  // Cálculos para las tarjetas de resumen
  const totalRecibido = filteredPagos.filter((pago) => pago.estado === "Completado").reduce((sum, pago) => sum + pago.monto, 0)

  const totalPendiente = filteredPagos.filter((pago) => pago.estado === "Pendiente").reduce((sum, pago) => sum + pago.monto, 0)

  const pagosPendientes = filteredPagos.filter((pago) => pago.estado === "Pendiente").length
  const pagosCompletados = filteredPagos.filter((pago) => pago.estado === "Completado").length

  // Método de pago más usado
  const metodosCount: Record<string, number> = {}
  filteredPagos.forEach((pago) => {
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

  const porcentajeMetodoMasUsado = filteredPagos.length > 0 ? Math.round((maxCount / filteredPagos.length) * 100) : 0

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
            <div className="text-2xl font-bold">{metodoMasUsado || "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              {metodoMasUsado ? `${porcentajeMetodoMasUsado}% de los pagos` : "Sin datos"}
            </p>
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
                <SelectItem value="cancelado">Cancelado</SelectItem>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      Cargando pagos...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredPagos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No se encontraron pagos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPagos.map((pago) => (
                    <TableRow key={pago._id}>
                      <TableCell className="font-medium">{pago.cliente}</TableCell>
                      <TableCell>{pago.caso}</TableCell>
                      <TableCell>${pago.monto.toLocaleString()}</TableCell>
                      <TableCell>{pago.fecha}</TableCell>
                      <TableCell>{pago.metodo}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pago.estado === "Completado"
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
                              onClick={() => pago._id && handleDownloadReceipt(pago._id)}
                              disabled={isDownloading === pago._id}
                            >
                              {isDownloading === pago._id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="mr-2 h-4 w-4" />
                              )}
                              <span>{isDownloading === pago._id ? "Descargando..." : "Descargar recibo"}</span>
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
        clientes={clientes}
        casos={casos}
        title="Registrar Pago"
        description="Agregue un nuevo pago al sistema"
        buttonText="Registrar Pago"
      />

      {/* Diálogo para editar pago */}
      <PagoDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        pago={currentPago}
        clientes={clientes}
        casos={casos}
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
