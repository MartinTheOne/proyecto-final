import ClientesPage from "./clientes"
export default async function Clientes() {
  const clientes = await fetch(`${process.env.NEXTAUTH_URL}/api/clientes`)
  const data = await clientes.json()
  return (
    <ClientesPage initialClientes={data} />
  )

}