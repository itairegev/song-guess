'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { RoundState } from '@/hooks/use-game'

interface GameResult {
  era: string
  rounds: RoundState[]
  totalScore: number
}

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<GameResult | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('gameResult')
    if (!raw) {
      router.push('/')
      return
    }
    setResult(JSON.parse(raw))
  }, [router])

  if (!result) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Game Over</p>
        <p className="text-5xl font-bold text-purple-400 mb-1">{result.totalScore}</p>
        <p className="text-gray-500">out of {result.rounds.length * 1000}</p>
      </div>

      <div className="w-full space-y-3">
        {result.rounds.map((round, i) => (
          <div key={i} className="flex items-center justify-between bg-[#1a1a2e] rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <span className={`text-lg ${round.guessedCorrectly ? 'text-emerald-400' : 'text-red-400'}`}>
                {round.guessedCorrectly ? '\u2713' : '\u2717'}
              </span>
              <div>
                <p className="font-medium text-sm">{round.song.name}</p>
                <p className="text-xs text-gray-500">{round.song.artist}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-purple-400">{round.score}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/')}
        className="px-12 py-4 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl text-lg font-bold"
      >
        Play Again
      </button>
    </div>
  )
}
