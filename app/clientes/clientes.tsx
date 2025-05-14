"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, MoreHorizontal, FileEdit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ClienteDialog } from "@/components/dialogs/cliente-dialog"
import { DeleteDialog } from "@/components/dialogs/delete-dialog"
import type { Cliente } from "@/interfaces/Icliente"
import { toast } from "@/components/ui/use-toast"
import { useLoading } from "@/components/loading-provider"

interface ClientesPageProps {
    initialClientes: Cliente[]
}

export default function ClientesPage({ initialClientes }: ClientesPageProps) {

    console.log(initialClientes)
    const [clientes, setClientes] = useState<Cliente[]>(initialClientes)
    const [searchTerm, setSearchTerm] = useState("")
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [currentCliente, setCurrentCliente] = useState<Cliente | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { startLoading, stopLoading } = useLoading()

    // Cargar clientes al montar el componente


    // Filtrar clientes según el término de búsqueda
    const filteredClientes = clientes.filter(
        (cliente) =>
            cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.telefono.includes(searchTerm) ||
            cliente.caso.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Funciones para manejar los diálogos
    const handleCreateCliente = async (values: Omit<Cliente, "_id">) => {
        try {
            startLoading()
            const response = await fetch("/api/clientes", {
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

            // Añadir el nuevo cliente a la lista con el ID generado
            const newCliente: Cliente = {
                _id: insertedId,
                ...values,
            }

            setClientes([...clientes, newCliente])

            toast({
                title: "Cliente creado",
                description: "El cliente ha sido creado exitosamente.",
            })
        } catch (error) {
            console.error("Error al crear el cliente:", error)
            toast({
                title: "Error",
                description: "No se pudo crear el cliente. Por favor, intente de nuevo.",
                variant: "destructive",
            })
        } finally {
            stopLoading()
        }
    }

    const handleEditCliente = async (values: Omit<Cliente, "_id">) => {
        if (!currentCliente || !currentCliente._id) return

        try {
            startLoading()
            const response = await fetch("/api/clientes", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: currentCliente._id,
                    ...values,
                }),
            })

            if (!response.ok) {
                throw new Error(`Error al actualizar el cliente: ${response.statusText}`)
            }

            // Actualizar el cliente en la lista local
            setClientes(
                clientes.map((cliente) =>
                    cliente._id === currentCliente._id
                        ? {
                            ...cliente,
                            ...values,
                        }
                        : cliente,
                ),
            )

            toast({
                title: "Cliente actualizado",
                description: "El cliente ha sido actualizado exitosamente.",
            })
        } catch (error) {
            console.error("Error al actualizar el cliente:", error)
            toast({
                title: "Error",
                description: "No se pudo actualizar el cliente. Por favor, intente de nuevo.",
                variant: "destructive",
            })
        } finally {
            stopLoading()
        }
    }

    const handleDeleteCliente = async () => {
        if (!currentCliente || !currentCliente._id) return

        try {
            startLoading()
            const response = await fetch("/api/clientes", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: currentCliente._id,
                }),
            })

            if (!response.ok) {
                throw new Error(`Error al eliminar el cliente: ${response.statusText}`)
            }

            // Eliminar el cliente de la lista local
            setClientes(clientes.filter((cliente) => cliente._id !== currentCliente._id))

            toast({
                title: "Cliente eliminado",
                description: "El cliente ha sido eliminado exitosamente.",
            })
        } catch (error) {
            console.error("Error al eliminar el cliente:", error)
            toast({
                title: "Error",
                description: "No se pudo eliminar el cliente. Por favor, intente de nuevo.",
                variant: "destructive",
            })
        } finally {
            stopLoading()
        }
    }

    return (
        <div className="flex flex-col p-4 md:p-8 space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                <p className="text-muted-foreground">Gestione la información de sus clientes</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Lista de Clientes</CardTitle>
                        <CardDescription>Tiene un total de {clientes.length} clientes registrados</CardDescription>
                    </div>
                    <Button className="bg-[#001F3F] hover:bg-[#003366]" onClick={() => setOpenCreateDialog(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Cliente
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar cliente..."
                                className="pl-8 bg-white dark:bg-gray-950"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Caso</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="w-[80px]">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            Cargando clientes...
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-red-500">
                                            {error}
                                        </TableCell>
                                    </TableRow>
                                ) : filteredClientes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                            No se encontraron clientes
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClientes.map((cliente) => (
                                        <TableRow key={cliente._id}>
                                            <TableCell className="font-medium">{cliente.nombre}</TableCell>
                                            <TableCell>{cliente.email}</TableCell>
                                            <TableCell>{cliente.telefono}</TableCell>
                                            <TableCell>{cliente.caso}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cliente.estado === "Activo"
                                                        ? "bg-green-100 text-green-800"
                                                        : cliente.estado === "En espera"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {cliente.estado}
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
                                                                setCurrentCliente(cliente)
                                                                setOpenEditDialog(true)
                                                            }}
                                                        >
                                                            <FileEdit className="mr-2 h-4 w-4" />
                                                            <span>Editar</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                setCurrentCliente(cliente)
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

            {/* Diálogo para crear cliente */}
            <ClienteDialog
                open={openCreateDialog}
                onOpenChange={setOpenCreateDialog}
                onSubmit={(values) => {
                    const clienteData: Omit<Cliente, "_id"> = {
                        ...values,
                        direccion: values.direccion ?? '',
                        notas: values.notas ?? '',
                    };
                    return handleCreateCliente(clienteData);
                }}
                title="Nuevo Cliente"
                description="Agregue un nuevo cliente a su sistema"
                buttonText="Crear Cliente"
            />

            {/* Diálogo para editar cliente */}
            <ClienteDialog
                open={openEditDialog}
                onOpenChange={setOpenEditDialog}
                cliente={currentCliente}
                onSubmit={(values) => {
                    const clienteData: Omit<Cliente, "_id"> = {
                        ...values,
                        direccion: values.direccion ?? '',
                        notas: values.notas ?? '',
                    };
                    return handleEditCliente(clienteData);
                }}
                title="Editar Cliente"
                description="Modifique la información del cliente"
                buttonText="Guardar Cambios"
            />

            {/* Diálogo para eliminar cliente */}
            <DeleteDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
                onConfirm={handleDeleteCliente}
                title="Eliminar Cliente"
                description={`¿Está seguro de que desea eliminar a ${currentCliente?.nombre}?`}
                entityName="el cliente"
            />
        </div>
    )
}
