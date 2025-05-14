import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from 'mongodb';
import { Tareas } from '@/interfaces/ITareas';
const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME || '';
const collectionName = 'tareas';


let isConnected = false;
async function connectToDatabase() {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
    }
    return client.db(dbName).collection<Tareas>(collectionName);
}


// Esto es para obtener todas las tareas
export async function GET(req: NextRequest) {
  try {
    const collection = await connectToDatabase();

    const tareas = await collection.find({}).toArray();

    return NextResponse.json(tareas);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al obtener las tareas' }, { status: 500 });
  }
}

// Esto es para crear una nueva tarea
export async function POST(req: NextRequest) {
    try {
        const collection = await connectToDatabase();
        const tarea: Tareas = await req.json();
        const result = await collection.insertOne(tarea);
        return NextResponse.json(result.insertedId);
    } catch (error) {
        return NextResponse.json({ error: 'Error al crear la tarea' }, { status: 500 });
    }
}


// Esto es para actualizar una tarea por ID
export async function PUT(req: NextRequest) {
    try {
        const collection = await connectToDatabase();
        const { id, ...tarea }: Partial<Tareas> & { id: string } = await req.json();
        const result = await collection.updateOne({ _id: new ObjectId(id) as any }, { $set: tarea });
        return NextResponse.json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar la tarea' }, { status: 500 });
    }
}

// Esto es para eliminar una tarea por ID
export async function DELETE(req: NextRequest) {
    try {
        const collection = await connectToDatabase();
        const { id }: { id: string } = await req.json();
        const result = await collection.deleteOne({ _id: new ObjectId(id) as any });
        return NextResponse.json({ deletedCount: result.deletedCount });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar la tarea' }, { status: 500 });
    }
}




