export const dynamic = 'force-dynamic';
import { getTareas } from '@/lib/obtener'
import TareasPage from './tareas'
export default async function Tareas() {
  const tareas = await getTareas();
  if (!tareas) throw new Error("No se encontró los clientes.");;
  const pagosSerializados = tareas.map(cli => ({
    ...cli,
    _id: cli._id.toString(),
  }));

  return (
    <TareasPage InitialTareas={pagosSerializados} />
  )
}