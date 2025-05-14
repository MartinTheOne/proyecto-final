import PagosPage from "./pagos";

export default async function Pagos() {
  const pagos = await fetch(`${process.env.NEXTAUTH_URL}/api/pagos`);
  const dataPagos = await pagos.json();

  const clientes = await fetch(`${process.env.NEXTAUTH_URL}/api/clientes`)
  const dataClientes = await clientes.json()
  return (
    <PagosPage pagos={dataPagos} clientes={dataClientes} />
  );
}