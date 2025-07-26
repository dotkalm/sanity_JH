import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Joel Holmberg',
  description: 'Artist portfolio and personal website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/artwork">Artwork</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <p>&copy; 2024 Joel Holmberg</p>
        </footer>
      </body>
    </html>
  )
}
