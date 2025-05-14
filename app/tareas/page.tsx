import TareasPage from './tareas'
export default async function Tareas() {
  const tareas = await fetch(`${process.env.NEXTAUTH_URL}/api/tareas`)
  const data = await tareas.json()
  return (
    <TareasPage InitialTareas={data} />
  )
}