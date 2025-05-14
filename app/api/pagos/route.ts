import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { Pago } from "@/interfaces/Ipago"
// MongoDB connection
const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME || '';
const collectionName = 'pagos';

// Interface for Pago

let isConnected = false;

async function connectToDatabase() {
    if (isConnected) {
        await client.connect();
        isConnected = true;
    }
    return client.db(dbName).collection<Pago>(collectionName);
}

// GET: Retrieve all pagos
export async function GET() {
    try {
        const collection = await connectToDatabase();
        const pagos = await collection.find({}).toArray();
        return NextResponse.json(pagos);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch pagos' }, { status: 500 });
    }
}

// POST: Create a new pago
export async function POST(req: Request) {
    try {
        const collection = await connectToDatabase();
        const body: Pago = await req.json();
        const result = await collection.insertOne(body);
        return NextResponse.json({ _id: result.insertedId, ...body });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create pago' }, { status: 500 });
    }
}

// PUT: Update a pago by ID
export async function PUT(req: Request) {
    try {
        const collection = await connectToDatabase();
        const { _id, ...updateData }: Pago = await req.json();
        if (!_id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
        const result = await collection.updateOne(
            { _id: new ObjectId(_id) as any },
            { $set: updateData }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Pago not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Pago updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update pago' }, { status: 500 });
    }
}

// DELETE: Delete a pago by ID
export async function DELETE(req: Request) {
    try {
        const collection = await connectToDatabase();
        const { _id }: { _id: string } = await req.json();
        if (!_id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
        const result = await collection.deleteOne({ _id: new ObjectId(_id) as any});
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Pago not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Pago deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete pago' }, { status: 500 });
    }
}