import { compare } from "bcrypt"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || ""
const client = new MongoClient(uri)
const dbName = process.env.DB_NAME || ""
const db = client.db(dbName)
const collection = db.collection("user")

interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: string;
}


export async function getUserByEmail(email: string) {
  const user = await collection.findOne({ email });
  if (!user) {
    return false;
  }
  return true;

}

export async function validarUser(email: string, password: string) {
  const user: User | null = await collection.findOne<User>({ email });
  if (!user) {
    return null;
  }
  const comparePassword = await compare(password, user.password);

  if (!comparePassword) {
    return null;
  }
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
