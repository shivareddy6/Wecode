// Root page - middleware handles all auth redirects
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">WeCode</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}