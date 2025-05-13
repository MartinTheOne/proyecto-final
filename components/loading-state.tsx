import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function LoadingState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background shadow-lg border">
        <LoadingSpinner size={32} className="text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Cargando...</p>
      </div>
    </div>
  )
}
