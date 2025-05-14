import { getConfiguracion } from "@/lib/obtener";
import ConfiguracionPage from "./configuracion";

export default async function Configuracione() {
  const data = await getConfiguracion();

  if (!data) throw new Error("No se encontró los clientes.");
  
  const pagosSerializados = {perfil:data.perfil,despacho:data.despacho}
  return <ConfiguracionPage configuracion={pagosSerializados} />;
}