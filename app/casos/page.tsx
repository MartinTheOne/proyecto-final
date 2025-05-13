import CasosPage from './casos'
export default async function Casos(){
  const res = await fetch('http://localhost:3000/api/casos/', { cache: 'no-store' });

  if (!res.ok) {
    console.error('Falló el fetch con status:', res.status);
    throw new Error('El servidor se cagó. Andá a revisar el backend.');
  }

  const data = await res.json();

  // En caso extremo, podés asegurarte que sea array
  return <CasosPage InitialData={Array.isArray(data) ? data : []} />;
}
