export const dynamic = 'force-dynamic';
import { getPagos } from "@/lib/obtener";
import PagosPage from "./pagos";

export default async function Pagos() {
  const pagos = await getPagos();

  if (!pagos) throw new Error("No se encontró la configuración.");;
  const pagosSerializados = pagos.map(pago => ({
    ...pago,
    _id: pago._id.toString(),
  }));

  return <PagosPage pagos={pagosSerializados} />;
}