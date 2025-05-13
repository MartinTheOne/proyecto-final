import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function ConfiguracionPage() {
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
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
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
                  <Input id="nombre" defaultValue="Carlos" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input id="apellido" defaultValue="González" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="carlos.gonzalez@ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" defaultValue="555-123-4567" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Textarea id="direccion" defaultValue="Calle Principal 123, Ciudad" />
                </div>
              </div>
              <Button className="bg-[#001F3F] hover:bg-[#003366]">Guardar Cambios</Button>
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
                  <Input id="nombre-despacho" defaultValue="González & Asociados" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfc">RFC</Label>
                  <Input id="rfc" defaultValue="GONA123456ABC" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-despacho">Email</Label>
                  <Input id="email-despacho" type="email" defaultValue="contacto@gonzalezasociados.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono-despacho">Teléfono</Label>
                  <Input id="telefono-despacho" defaultValue="555-987-6543" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="direccion-despacho">Dirección</Label>
                  <Textarea id="direccion-despacho" defaultValue="Av. Reforma 500, Piso 12, Ciudad" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="logo">Logo del Despacho</Label>
                  <Input id="logo" type="file" />
                </div>
              </div>
              <Button className="bg-[#001F3F] hover:bg-[#003366]">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notificaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Configure cómo desea recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif">Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Reciba notificaciones sobre tareas, pagos y casos por email
                    </p>
                  </div>
                  <Switch id="email-notif" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="recordatorios">Recordatorios de Tareas</Label>
                    <p className="text-sm text-muted-foreground">Reciba recordatorios de tareas próximas a vencer</p>
                  </div>
                  <Switch id="recordatorios" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pagos-pendientes">Alertas de Pagos Pendientes</Label>
                    <p className="text-sm text-muted-foreground">Reciba alertas sobre pagos pendientes de clientes</p>
                  </div>
                  <Switch id="pagos-pendientes" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="actualizaciones">Actualizaciones del Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Reciba notificaciones sobre actualizaciones del sistema
                    </p>
                  </div>
                  <Switch id="actualizaciones" />
                </div>
              </div>
              <Button className="bg-[#001F3F] hover:bg-[#003366]">Guardar Preferencias</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="seguridad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad de la Cuenta</CardTitle>
              <CardDescription>Actualice su contraseña y configure la seguridad de su cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña Actual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Autenticación de Dos Factores</Label>
                    <p className="text-sm text-muted-foreground">Añada una capa adicional de seguridad a su cuenta</p>
                  </div>
                  <Switch id="two-factor" />
                </div>
              </div>
              <Button className="bg-[#001F3F] hover:bg-[#003366]">Actualizar Contraseña</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
