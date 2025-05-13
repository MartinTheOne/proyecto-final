import TareasPage from './tareas'
export default async function Tareas(){
  const tareas = await fetch('http://localhost:3000/api/tareas')
  const data = await tareas.json()
  console.log(data);
  return (
    <TareasPage InitialTareas={data} />
  )
}