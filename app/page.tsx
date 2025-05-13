import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, CreditCard, CheckSquare, Briefcase, Clock, AlertCircle, TrendingUp, Calendar } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex flex-col p-4 md:p-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido a su panel de gestión legal</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Casos Abiertos</CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+3 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">-$1,200 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <CheckSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+4 desde ayer</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="proximas-tareas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proximas-tareas">Próximas Tareas</TabsTrigger>
          <TabsTrigger value="casos-recientes">Casos Recientes</TabsTrigger>
          <TabsTrigger value="pagos-recientes">Pagos Recientes</TabsTrigger>
        </TabsList>
        <TabsContent value="proximas-tareas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Tareas</CardTitle>
              <CardDescription>Tiene 12 tareas pendientes para esta semana</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 mr-4">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Preparar documentación para audiencia</h3>
                  <p className="text-sm text-muted-foreground">Caso: Martínez vs. Seguros ABC</p>
                </div>
                <div className="text-sm font-medium text-red-600">Hoy</div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 mr-4">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Reunión con cliente</h3>
                  <p className="text-sm text-muted-foreground">Cliente: Juan Pérez</p>
                </div>
                <div className="text-sm font-medium text-orange-600">Mañana</div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 mr-4">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Presentar recurso de apelación</h3>
                  <p className="text-sm text-muted-foreground">Caso: Rodríguez - Herencia</p>
                </div>
                <div className="text-sm font-medium">En 3 días</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="casos-recientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Casos Recientes</CardTitle>
              <CardDescription>Ha agregado 5 nuevos casos este mes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 mr-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Martínez vs. Seguros ABC</h3>
                  <p className="text-sm text-muted-foreground">Reclamación de seguro</p>
                </div>
                <div className="text-sm font-medium">Iniciado: 12/05/2025</div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 mr-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Rodríguez - Herencia</h3>
                  <p className="text-sm text-muted-foreground">Disputa de herencia</p>
                </div>
                <div className="text-sm font-medium">Iniciado: 05/05/2025</div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 mr-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">García - Divorcio</h3>
                  <p className="text-sm text-muted-foreground">Proceso de divorcio</p>
                </div>
                <div className="text-sm font-medium">Iniciado: 28/04/2025</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pagos-recientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pagos Recientes</CardTitle>
              <CardDescription>Ha recibido 8 pagos en los últimos 30 días</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 mr-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Juan Pérez</h3>
                  <p className="text-sm text-muted-foreground">Caso: Reclamación laboral</p>
                </div>
                <div className="text-sm font-medium text-green-600">$2,500</div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 mr-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">María López</h3>
                  <p className="text-sm text-muted-foreground">Caso: Divorcio</p>
                </div>
                <div className="text-sm font-medium text-green-600">$1,800</div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 mr-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Carlos Rodríguez</h3>
                  <p className="text-sm text-muted-foreground">Caso: Herencia</p>
                </div>
                <div className="text-sm font-medium text-green-600">$3,200</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
