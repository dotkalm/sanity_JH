export default function ArtworkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <h1>Artwork Gallery</h1>
      {children}
    </div>
  )
}
