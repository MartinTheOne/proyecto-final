import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { Cliente } from '@/interfaces/Icliente';
const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME || '';
const collectionName = 'clientes';



let isConnected = false;

async function connectToDatabase() {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
    }
    return client.db(dbName).collection<Cliente>(collectionName);
}

// GET: Obtener todos los clientes
export async function GET() {
    try {
        const collection = await connectToDatabase();
        const clientes = await collection.find().toArray();
        return NextResponse.json(clientes);
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener los clientes' }, { status: 500 });
    }
}

// POST: Crear un nuevo cliente
export async function POST(req: Request) {
    try {
        const collection = await connectToDatabase();
        const cliente: Cliente = await req.json();
        const result = await collection.insertOne(cliente);
        return NextResponse.json(result.insertedId);
    } catch (error) {
        return NextResponse.json({ error: 'Error al crear el cliente' }, { status: 500 });
    }
}

// PUT: Actualizar un cliente por ID
export async function PUT(req: Request) {
    try {
        const collection = await connectToDatabase();
        const { id, ...cliente }: Partial<Cliente> & { id: string } = await req.json();
        const result = await collection.updateOne({ _id: new ObjectId(id) as any }, { $set: cliente });
        return NextResponse.json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar el cliente' }, { status: 500 });
    }
}

// DELETE: Eliminar un cliente por ID
export async function DELETE(req: Request) {
    try {
        const collection = await connectToDatabase();
        const { id }: { id: string } = await req.json();
        const result = await collection.deleteOne({ _id: new ObjectId(id) as any });
        return NextResponse.json({ deletedCount: result.deletedCount });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar el cliente' }, { status: 500 });
    }
}