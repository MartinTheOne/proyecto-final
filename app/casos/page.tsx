export const dynamic = 'force-dynamic';
import { getCasos } from '@/lib/obtener';
import CasosPage from './casos'
export default async function Casos() {
  const casos = await getCasos()

  if (!casos) throw new Error("No se encontró los casos.");
  const pagosSerializados = casos.map(cli => ({
    ...cli,
    _id: cli._id.toString(),
  }));

  // En caso extremo, podés asegurarte que sea array
  return <CasosPage InitialData={pagosSerializados} />;
}
