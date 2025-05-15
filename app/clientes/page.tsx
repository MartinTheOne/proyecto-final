export const dynamic = 'force-dynamic';
import { getClientes } from "@/lib/obtener"
import ClientesPage from "./clientes"
export default async function Clientes() {
  const clientes = await getClientes();

  if (!clientes) throw new Error("No se encontró los clientes.");;
  const pagosSerializados = clientes.map(cli => ({
    ...cli,
    _id: cli._id.toString(),
  }));

  return (
    <ClientesPage initialClientes={pagosSerializados || []} />
  )

}