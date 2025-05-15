export const dynamic = 'force-dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, CreditCard, CheckSquare, Briefcase, Clock, TrendingUp, AlertCircle } from "lucide-react"
import { formatCurrency, formatDate, parseDate } from "@/lib/utils"
import { differenceInDays, isToday, isTomorrow } from "date-fns"
import { getDashboard } from "@/lib/obtener"

async function getDashboardData() {
  try {
    const res = await getDashboard();

    if (!res) {
      throw new Error("Failed to fetch dashboard data")
    }

    return res
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return {
      resumen: {
        clientesActivos: 0,
        clientesIncremento: 0,
        casosAbiertos: 0,
        casosIncremento: 0,
        pagosPendientes: 0,
        pagosPendientesIncremento: 0,
        tareasPendientes: 0,
        tareasIncremento: 0,
      },
      detalle: {
        proximasTareas: [],
        casosRecientes: [],
        pagosRecientes: [],
      },
    }
  }
}

// Componente principal del dashboard
export default async function Dashboard() {
  // Obtener datos del dashboard
  const { resumen, detalle } = await getDashboardData()

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
            <div className="text-2xl font-bold">{resumen.clientesActivos}</div>
            <p className="text-xs text-muted-foreground">
              {resumen.clientesIncremento > 0 ? "+" : ""}
              {resumen.clientesIncremento} desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Casos Abiertos</CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumen.casosAbiertos}</div>
            <p className="text-xs text-muted-foreground">
              {resumen.casosIncremento > 0 ? "+" : ""}
              {resumen.casosIncremento} desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(resumen.pagosPendientes)}</div>
            <p className="text-xs text-muted-foreground">
              {resumen.pagosPendientesIncremento > 0 ? "+" : ""}
              {formatCurrency(resumen.pagosPendientesIncremento)} desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <CheckSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumen.tareasPendientes}</div>
            <p className="text-xs text-muted-foreground">
              {resumen.tareasIncremento > 0 ? "+" : ""}
              {resumen.tareasIncremento} desde ayer
            </p>
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
              <CardDescription>Tiene {resumen.tareasPendientes} tareas pendientes para esta semana</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {detalle.proximasTareas.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No hay tareas pendientes</div>
              ) : (
                detalle.proximasTareas.map((tarea: any) => {
                  // Determinar el icono y color según la prioridad
                  let IconComponent = Clock
                  let bgColorClass = "bg-blue-100"
                  let textColorClass = "text-blue-700"

                  if (tarea.prioridad === "Alta") {
                    IconComponent = AlertCircle
                    bgColorClass = "bg-red-100"
                    textColorClass = "text-red-700"
                  } else if (tarea.prioridad === "Media") {
                    IconComponent = Clock
                    bgColorClass = "bg-yellow-100"
                    textColorClass = "text-yellow-700"
                  }

                  return (
                    <div key={tarea._id} className="flex items-center p-4 border rounded-lg">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${bgColorClass} ${textColorClass} mr-4`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{tarea.titulo}</h3>
                        <p className="text-sm text-muted-foreground">
                          Cliente: {tarea.cliente}
                          {tarea.caso && ` | Caso: ${tarea.caso}`}
                        </p>
                      </div>
                      <div className={` text-sm font-medium ${getTimeUntilClass(tarea.fechaLimite)}`}>
                        <p className="">Fecha limite</p>
                        <p className="">{getTimeUntil(tarea.fechaLimite)}</p>

                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="casos-recientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Casos Recientes</CardTitle>
              <CardDescription>Ha agregado {detalle.casosRecientes.length} nuevos casos recientemente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {detalle.casosRecientes.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No hay casos recientes</div>
              ) : (
                detalle.casosRecientes.map((caso: any) => (
                  <div key={caso._id} className="flex items-center p-4 border rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 mr-4">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{caso.titulo}</h3>
                      <p className="text-sm text-muted-foreground">
                        {caso.cliente} | {caso.tipo}
                      </p>
                    </div>
                    <div className="text-sm font-medium">Iniciado: {formatDate(caso.fechaInicio)}</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pagos-recientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pagos Recientes</CardTitle>
              <CardDescription>Ha recibido {detalle.pagosRecientes.length} pagos recientemente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {detalle.pagosRecientes.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No hay pagos recientes</div>
              ) : (
                detalle.pagosRecientes.map((pago: any) => (
                  <div key={pago._id} className="flex items-center p-4 border rounded-lg">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 mr-4">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{pago.cliente}</h3>
                      <p className="text-sm text-muted-foreground">
                        Caso: {pago.caso} | Fecha: {formatDate(pago.fecha)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-green-600">{formatCurrency(pago.monto)}</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Función para obtener el tiempo hasta una fecha límite
function getTimeUntil(dateString: string): string {
  const date = parseDate(dateString)
  if (!date) return "Fecha inválida"

  const now = new Date()

  // Si la fecha ya pasó
  if (date < now) return "Vencida"

  // Si es hoy
  if (isToday(date)) return "Hoy"

  // Si es mañana
  if (isTomorrow(date)) return "Mañana"

  // Calcular diferencia en días
  const diffDays = differenceInDays(date, now)

  if (diffDays < 7) return `En ${diffDays} días`
  return formatDate(dateString)
}

// Función para obtener la clase de color según el tiempo restante
function getTimeUntilClass(dateString: string): string {
  const date = parseDate(dateString)
  if (!date) return "text-gray-600"

  const now = new Date()

  // Si la fecha ya pasó
  if (date < now) return "text-red-600"

  // Si es hoy
  if (isToday(date)) return "text-red-600"

  // Si es mañana
  if (isTomorrow(date)) return "text-orange-600"

  // Calcular diferencia en días
  const diffDays = differenceInDays(date, now)

  if (diffDays < 3) return "text-orange-600"
  if (diffDays < 7) return "text-yellow-600"
  return "text-gray-600"
}
