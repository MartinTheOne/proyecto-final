import { Casos } from "@/interfaces/ICasos";
import { Cliente } from "@/interfaces/Icliente";
import { Configuracion } from "@/interfaces/Iconfiguracion";
import { Pago } from "@/interfaces/Ipago";
import { Tareas } from "@/interfaces/ITareas";
import { connect } from "http2";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || ""
const dbName = process.env.DB_NAME || ""
const client = new MongoClient(uri)

export async function getCasos() {
    try {
        const connect = await client.connect();
        const collection = connect.db(dbName).collection<Casos>("casos")

        const casos = await collection.find({}).toArray();

        return casos;

    } catch (error) {
        console.log(error)
    }
    finally {

    }
}


export async function getClientes() {
    try {
        const connect = await client.connect();
        const collection = connect.db(dbName).collection<Cliente>("clientes")

        const clientes = await collection.find({}).toArray();

        return clientes;

    } catch (error) {
        console.log(error)
    }
}



export async function getPagos() {
    try {
        const connect = await client.connect();
        const collection = connect.db(dbName).collection<Pago>("pagos")

        const pagos = await collection.find({}).toArray();

        return pagos;

    } catch (error) {
        console.log(error)
    }
}



export async function getTareas() {
    try {
        const connect = await client.connect();
        const collection = connect.db(dbName).collection<Tareas>("tareas")

        const tareas = await collection.find({}).toArray();

        return tareas;

    } catch (error) {
        console.log(error)
    }
}



export async function getConfiguracion() {
    try {
        const connect = await client.connect();
        const collection = connect.db(dbName).collection<Configuracion>("configuracion");

        const configuracion = await collection.findOne({}); // solo un objeto
        return configuracion;

    } catch (error) {
        console.log(error);
    }
}

export async function getDashboard() {
    try {
        const connect = await client.connect();
        const database = connect.db(dbName)
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

        return {
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
        }

    } catch (error) {
        console.log(error)
    }
}




