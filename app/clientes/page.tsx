import ClientesPage from "./clientes"
export default async function Clientes() {
  const clientes = await fetch('http://localhost:3000/api/clientes')
  const data = await clientes.json()
  return (
    <ClientesPage initialClientes={data} />
  )

}