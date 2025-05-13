import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size={40} className="text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Cargando pagos...</p>
      </div>
    </div>
  )
}
