import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || ""; 
const client = new MongoClient(uri);

export async function GET() {
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME || ""); 

        const pagosCollection = database.collection("pagos");
        const clientesCollection = database.collection("clientes");
        const tareasCollection = database.collection("tareas");
        const casosCollection = database.collection("casos");

        const [pagos, clientes, tareas, casos] = await Promise.all([
            pagosCollection.find({ estado: "Pendiente" }).toArray(),
            clientesCollection.find({ estado: "Activo" }).toArray(),
            tareasCollection.find({ estado: "Pendiente" }).toArray(),
            casosCollection.find({ estado: "En proceso" }).toArray(),
        ]);

        return NextResponse.json({
            pagos,
            clientes,
            tareas,
            casos,
        });
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
        return NextResponse.json(
            { error: "Error fetching data from MongoDB" },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}