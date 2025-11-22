export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Future: Add navigation, sidebar, etc. */}
      {children}
    </div>
  )
}
