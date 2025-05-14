import { MongoClient } from "mongodb";
import { hash,compare } from "bcrypt";
const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME || "";
const collectionName = "user";

export async function PUT(request: Request) {

    try {
        const clientconect = await client.connect();
        const db = clientconect.db(dbName);
        const collection = db.collection(collectionName);

        const { password, newPassword, email } = await request.json();
        if (!password || !email) {
            return new Response("Invalid data", { status: 400 });
        }

        const comparePassword = await collection.findOne({ email: email });
        if (!comparePassword) {
            return new Response("User not found", { status: 404 });
        }

        const isPasswordValid = await compare(password, comparePassword.password);
        if (!isPasswordValid) {
            return new Response("Invalid password", { status: 401 });
        }
        const hashedPassword = await hash(newPassword, 10);
        const result = await collection.updateOne(
            { email: email },
            { $set: { password: hashedPassword } },
            { upsert: true }
        )
        return new Response("Password updated successfully", { status: 200 });

    } catch (error) {
        console.error("Error updating password in MongoDB:", error);
        return new Response("Error updating password", { status: 500 });
    }
}