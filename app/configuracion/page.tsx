import ConfiguracionPage from "./configuracion";

export default async function Configuracione() {
  
  const data = await fetch(`${process.env.NEXTAUTH_URL}/api/configuracion`);
  const configuracion = await data.json();


  return (
    <ConfiguracionPage configuracion={configuracion} />
  );
}