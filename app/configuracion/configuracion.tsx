"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Configuracion } from "@/interfaces/Iconfiguracion"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { Eye, EyeOff } from "lucide-react"
interface pageConfiguracionProps {
    configuracion: Configuracion
}

export default function ConfiguracionPage({ configuracion: configuracionInicial }: pageConfiguracionProps) {

    const { data: session } = useSession();
    const [configuracion, setConfiguracion] = useState<Configuracion>(configuracionInicial);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)


    const handleSave = async () => {
        if (!configuracion.perfil.nombre || !configuracion.perfil.apellido || !configuracion.perfil.email || !configuracion.perfil.telefono || !configuracion.perfil.direccion) {
            toast({
                title: "Error",
                description: "Por favor complete todos los campos obligatorios.",
                variant: "destructive",
            })
            return;
        }
        try {
            setLoading(true);
            const response = await fetch('/api/configuracion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    configuracion: {
                        perfil: configuracion.perfil
                    }, email: session?.user?.email
                }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar la configuración');
            }

            toast({
                title: "Configuración guardada",
                description: "La configuración ha sido guardada exitosamente.",
            })
        } catch (error) {
            console.error("Error al guardar la configuración:", error);
            toast({
                title: "Error",
                description: "No se pudo guardar la configuración.",
                variant: "destructive",
            })
        }
        finally {
            setLoading(false);
        }
    }

    const handleSaveDespacho = async () => {
        if (!configuracion.despacho.nombre || !configuracion.despacho.rfc || !configuracion.despacho.email || !configuracion.despacho.telefono || !configuracion.despacho.direccion) {
            toast({
                title: "Error",
                description: "Por favor complete todos los campos obligatorios.",
                variant: "destructive",
            })
            return;
        }
        try {
            setLoading(true);
            const response = await fetch('/api/configuracion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    configuracion: {
                        despacho: configuracion.despacho
                    }, email: session?.user?.email
                }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar la configuración');
            }

            toast({
                title: "Configuración guardada",
                description: "La configuración ha sido guardada exitosamente.",
            })
        } catch (error) {
            console.error("Error al guardar la configuración:", error);
            toast({
                title: "Error",
                description: "No se pudo guardar la configuración.",
                variant: "destructive",
            })
        }
        finally {
            setLoading(false);
        }
    }

    const handleUpdatePassword = async () => {
        if (!password || !newPassword || !confirmPassword) {
            toast({
                title: "Error",
                description: "Por favor complete todos los campos obligatorios.",
                variant: "destructive",
            })
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "Las contraseñas no coinciden.",
                variant: "destructive",
            })
            return;
        }
        try {
            setLoading(true);
            const response = await fetch('/api/configuracion/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, newPassword, email: session?.user?.email }),
            });
            if (response.status === 401) {
                toast({
                    title: "Error",
                    description: "La contraseña actual es incorrecta.",
                    variant: "destructive",
                })
            }
            if (!response.ok) {
                throw new Error('Error al guardar la configuración');
            }
            toast({
                title: "Configuración guardada",
                description: "La configuración ha sido guardada exitosamente.",
            })
        } catch (error) {
            console.error("Error al guardar la configuración:", error);
            toast({
                title: "Error",
                description: "No se pudo guardar la configuración.",
                variant: "destructive",
            })
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col p-4 md:p-8 space-y-6">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
                <p className="text-muted-foreground">Gestione la configuración de su cuenta y aplicación</p>
            </div>

            <Tabs defaultValue="perfil" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="perfil">Perfil</TabsTrigger>
                    <TabsTrigger value="despacho">Despacho</TabsTrigger>
                    <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
                </TabsList>
                <TabsContent value="perfil" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                            <CardDescription>Actualice su información personal</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input id="nombre" placeholder="Martin" value={configuracion?.perfil.nombre ?? ""} onChange={(e) => setConfiguracion(prev => ({ ...prev, perfil: { ...prev.perfil, nombre: e.target.value } }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="apellido">Apellido</Label>
                                    <Input id="apellido" placeholder="González" value={configuracion?.perfil.apellido ?? ""} onChange={(e) => setConfiguracion(prev => ({ ...prev, perfil: { ...prev.perfil, apellido: e.target.value } }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="martin.gonzalez@ejemplo.com" value={configuracion?.perfil.email ?? ""} onChange={(e) => setConfiguracion(prev => ({ ...prev, perfil: { ...prev.perfil, email: e.target.value } }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input id="telefono" placeholder="+5493816520271" value={configuracion?.perfil.telefono ?? ""} onChange={(e) => setConfiguracion(prev => ({ ...prev, perfil: { ...prev.perfil, telefono: e.target.value } }))} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="direccion">Dirección</Label>
                                    <Textarea id="direccion" placeholder="Calle Principal 123, Ciudad" value={configuracion?.perfil.direccion ?? ""} onChange={(e) => setConfiguracion(prev => ({ ...prev, perfil: { ...prev.perfil, direccion: e.target.value } }))} />
                                </div>
                            </div>
                            <Button className="bg-[#001F3F] hover:bg-[#003366]" disabled={loading} onClick={handleSave}>Guardar Cambios</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="despacho" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Despacho</CardTitle>
                            <CardDescription>Actualice la información de su despacho legal</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre-despacho">Nombre del Despacho</Label>
                                    <Input id="nombre-despacho" placeholder="González & Asociados" value={configuracion?.despacho.nombre ?? ""} onChange={(e) => setConfiguracion(prev => ({ ...prev, despacho: { ...prev.despacho, nombre: e.target.value } }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rfc">RFC</Label>
                                    <Input id="rfc" placeholder="GONA123456ABC" value={configuracion?.despacho.rfc ?? ""} onChange={(e) => setConfiguracion(prev => ({ ...prev, despacho: { ...prev.despacho, rfc: e.target.value } }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email-despacho">Email</Label>
                                    <Input id="email-despacho" type="email" placeholder="contacto@gonzalezasociados.com" value={configuracion?.despacho.email ?? ""} onChange={(e) => setConfiguracion(prev => ({ ...prev, despacho: { ...prev.despacho, email: e.target.value } }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefono-despacho">Teléfono</Label>
                                    <Input id="telefono-despacho" placeholder="555-987-6543" value={configuracion?.despacho.telefono ?? ""} onChange={(e) => setConfiguracion(prev => ({ ...prev, despacho: { ...prev.despacho, telefono: e.target.value } }))} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="direccion-despacho">Dirección</Label>
                                    <Textarea id="direccion-despacho" placeholder="Av. Reforma 500, Piso 12, Ciudad" value={configuracion?.despacho.direccion ?? ""} onChange={(e) => setConfiguracion(prev => ({ ...prev, despacho: { ...prev.despacho, direccion: e.target.value } }))} />
                                </div>
                            </div>
                            <Button className="bg-[#001F3F] hover:bg-[#003366]" disabled={loading} onClick={handleSaveDespacho}>Guardar Cambios</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="seguridad" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Seguridad de la Cuenta</CardTitle>
                            <CardDescription>Actualice su contraseña</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                {/* Contraseña Actual */}
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Contraseña Actual</Label>
                                    <div className="relative">
                                        <Input
                                            id="current-password"
                                            type={showCurrent ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrent(!showCurrent)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Nueva Contraseña */}
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="new-password"
                                            type={showNew ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirmar Contraseña */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirm-password"
                                            type={showConfirm ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Button
                                className="bg-[#001F3F] hover:bg-[#003366]"
                                disabled={loading}
                                onClick={handleUpdatePassword}
                            >
                                Actualizar Contraseña
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
