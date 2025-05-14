import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import type { Pago } from "@/interfaces/Ipago"
import type { Cliente } from "@/interfaces/Icliente"
import type { Casos } from "@/interfaces/ICasos"
import type { Tareas } from "@/interfaces/ITareas"

const uri = process.env.MONGODB_URI || ""
const client = new MongoClient(uri)
const dbName = process.env.DB_NAME || ""

export async function GET() {
  try {
    const clienteCon = await client.connect()
    const database = clienteCon.db(dbName)

    const pagosCollection = database.collection<Pago>("pagos")
    const clientesCollection = database.collection<Cliente>("clientes")
    const tareasCollection = database.collection<Tareas>("tareas")
    const casosCollection = database.collection<Casos>("casos")

    // Obtener datos básicos
    const [pagos, clientes, tareas, casos] = await Promise.all([
      pagosCollection.find({ estado: "Pendiente" }).toArray(),
      clientesCollection.find({ estado: "Activo" }).toArray(),
      tareasCollection.find({ estado: "Pendiente" }).toArray(),
      casosCollection.find({ estado: "En proceso" }).toArray(),
    ])

    // Calcular estadísticas adicionales
    const [totalPagosCompletados, totalPagosPendientes, proximasTareas, casosRecientes, pagosRecientes] =
      await Promise.all([
        pagosCollection.find({ estado: "Completado" }).toArray(),
        pagosCollection.find({ estado: "Pendiente" }).toArray(),
        // Ordenar por fechaLimite (formato ISO)
        tareasCollection
          .find({ estado: "Pendiente" })
          .sort({ fechaLimite: 1 })
          .limit(3)
          .toArray(),
        // Ordenar por fechaInicio (formato ISO)
        casosCollection
          .find({})
          .sort({ fechaInicio: -1 })
          .limit(3)
          .toArray(),
        // Ordenar por fecha (formato YYYY-MM-DD)
        pagosCollection
          .find({ estado: "Completado" })
          .sort({ fecha: -1 })
          .limit(3)
          .toArray(),
      ])

    // Calcular montos totales
    const totalRecibido = totalPagosCompletados.reduce((sum, pago) => sum + pago.monto, 0)
    const totalPendiente = totalPagosPendientes.reduce((sum, pago) => sum + pago.monto, 0)

    // Calcular incrementos (simulados para este ejemplo)
    const clientesIncremento = 2 // Incremento de clientes desde el mes pasado
    const casosIncremento = 3 // Incremento de casos desde el mes pasado
    const pagosPendientesIncremento = -1200 // Cambio en pagos pendientes desde el mes pasado
    const tareasIncremento = 4 // Incremento de tareas desde ayer

    return NextResponse.json({
      resumen: {
        clientesActivos: clientes.length,
        clientesIncremento,
        casosAbiertos: casos.length,
        casosIncremento,
        pagosPendientes: totalPendiente,
        pagosPendientesIncremento,
        tareasPendientes: tareas.length,
        tareasIncremento,
      },
      detalle: {
        proximasTareas,
        casosRecientes,
        pagosRecientes,
      },
    })
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error)
    return NextResponse.json({ error: "Error fetching data from MongoDB" }, { status: 500 })
  } finally {
    await client.close()
  }
}
