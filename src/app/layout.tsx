import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Name the song... (mmmm him)',
  description: 'Guess the song from audio snippets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f1a] text-white min-h-screen font-sans">
        <main className="max-w-md mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
