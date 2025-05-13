import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from 'mongodb';
import { Casos } from '@/interfaces/ICasos';
const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME || '';
const collectionName = 'casos';


let isConnected = false;
async function connectToDatabase() {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
    }
    return client.db(dbName).collection<Casos>(collectionName);
}

export async function GET() {
    try {
        const collection = await connectToDatabase();
        const casos = await collection.find().toArray();
        return NextResponse.json(casos);
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener los casos' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const collection = await connectToDatabase();
        const casos: Casos = await req.json();
        const result = await collection.insertOne(casos);
        return NextResponse.json(result.insertedId);
    } catch (error) {
        return NextResponse.json({ error: 'Error al crear el caso' }, { status: 500 });
    }
}