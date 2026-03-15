'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EraSelector } from '@/components/era-selector'

export default function Home() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handlePlay = async () => {
    if (!selectedEra) return
    setLoading(true)
    setError(null)

    const MAX_RETRIES = 3
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const res = await fetch(`/api/spotify/songs?era=${selectedEra}`)
        if (!res.ok) throw new Error('Failed to fetch songs')
        const data = await res.json()
        sessionStorage.setItem('gameData', JSON.stringify({
          era: selectedEra,
          songs: data.songs,
        }))
        router.push('/game')
        return
      } catch {
        if (attempt === MAX_RETRIES - 1) {
          setError('Could not load songs. Tap to retry.')
          setLoading(false)
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
          Song Guess
        </h1>
        <p className="text-gray-500">How well do you know your music?</p>
      </div>

      <div>
        <p className="text-sm text-gray-500 text-center mb-4">Pick your era</p>
        <EraSelector selected={selectedEra} onSelect={setSelectedEra} />
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <button
        onClick={handlePlay}
        disabled={!selectedEra || loading}
        className="px-12 py-4 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl
          text-lg font-bold disabled:opacity-30 transition-opacity"
      >
        {loading ? 'Loading...' : error ? 'Try Again' : 'Play'}
      </button>
    </div>
  )
}
