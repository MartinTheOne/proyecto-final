import PagosPage from "./pagos";

export default async function Pagos() {
  const pagos = await fetch(`${process.env.NEXTAUTH_URL}/api/pagos`);
  const dataPagos = await pagos.json();

  return (
    <PagosPage pagos={dataPagos}  />
  );
}