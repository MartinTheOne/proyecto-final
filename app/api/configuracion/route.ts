import { Configuracion } from "@/interfaces/Iconfiguracion";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME || "";
const collectionName = "configuracion";

export async function GET() {
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const configuracion = await collection.findOne({});

        if (!configuracion) {
            return new Response("No configuration found", { status: 404 });
        }

        return new Response(JSON.stringify(configuracion), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching configuration from MongoDB:", error);
        return new Response("Error fetching configuration", { status: 500 });
    } finally {
        await client.close();
    }
}

export async function POST(request: Request) {
    try {
        const {configuracion,email} = await request.json();
        if (!configuracion || !email) {
            return new Response("Invalid data", { status: 400 });
        }
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);


        const result = await collection.updateOne(
            {email: email},
            { $set: configuracion },
            { upsert: true }
        );

        return new Response("Configuration updated successfully", { status: 200 });
    } catch (error) {
        console.error("Error updating configuration in MongoDB:", error);
        return new Response("Error updating configuration", { status: 500 });
    } finally {
        await client.close();
    }
}