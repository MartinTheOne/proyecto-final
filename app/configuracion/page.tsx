import { da, el } from "date-fns/locale";
import ConfiguracionPage from "./configuracion";

export default async function Configuracione() {
  let configuracion;
  const data = await fetch(`${process.env.NEXTAUTH_URL}/api/configuracion`)
  if (data.ok) {
    configuracion = await data.json();
  } else {
    configuracion = { perfil: {}, despacho: {} };
  }

  return (

    <ConfiguracionPage configuracion={configuracion} />

  );
}