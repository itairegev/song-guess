'use client'

import { useState, useEffect } from 'react'

export interface LetterResult {
  letter: string
  status: 'correct' | 'present' | 'absent' | 'space'
}

export function compareGuess(guess: string, target: string): LetterResult[] {
  const guessLower = guess.toLowerCase()
  const targetLower = target.toLowerCase()
  const targetChars = [...targetLower]
  const result: LetterResult[] = []
  const used = new Array(targetChars.length).fill(false)

  // First pass: mark spaces and correct positions
  for (let i = 0; i < guessLower.length; i++) {
    if (guessLower[i] === ' ') {
      result.push({ letter: ' ', status: 'space' })
    } else if (i < targetLower.length && guessLower[i] === targetLower[i]) {
      result.push({ letter: guess[i], status: 'correct' })
      used[i] = true
    } else {
      result.push({ letter: guess[i], status: 'absent' })
    }
  }

  // Second pass: mark present (wrong position), skip spaces
  for (let i = 0; i < result.length; i++) {
    if (result[i].status !== 'absent') continue
    const idx = targetChars.findIndex((c, j) => !used[j] && c === guessLower[i])
    if (idx !== -1) {
      result[i] = { ...result[i], status: 'present' }
      used[idx] = true
    }
  }

  return result
}

interface GuessInputProps {
  onGuess: (guess: string) => boolean
  disabled: boolean
  songName: string
}

export function GuessInput({ onGuess, disabled, songName }: GuessInputProps) {
  const [value, setValue] = useState('')
  const [shaking, setShaking] = useState(false)
  const [lastGuess, setLastGuess] = useState<LetterResult[] | null>(null)

  useEffect(() => {
    setLastGuess(null)
    setValue('')
  }, [songName])

  const handleSubmit = () => {
    if (!value.trim() || disabled) return
    const guess = value.trim()
    const correct = onGuess(guess)
    if (!correct) {
      setLastGuess(compareGuess(guess, songName))
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    } else {
      setLastGuess(null)
    }
    setValue('')
  }

  const statusColor = {
    correct: 'bg-emerald-500 border-emerald-500',
    present: 'bg-yellow-500 border-yellow-500',
    absent: 'bg-gray-700 border-gray-700',
    space: '',
  }

  return (
    <div className="space-y-2">
      {lastGuess && (
        <div className="flex flex-wrap gap-1 justify-center" dir="auto">
          {lastGuess.map((lr, i) =>
            lr.status === 'space' ? (
              <span key={i} className="w-2" />
            ) : (
              <span
                key={i}
                className={`inline-flex items-center justify-center w-7 h-9 text-sm font-bold rounded border
                  ${statusColor[lr.status]} text-white`}
              >
                {lr.letter.toUpperCase()}
              </span>
            )
          )}
        </div>
      )}
      <div className={`flex gap-2 ${shaking ? 'animate-shake' : ''}`}>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Type your guess..."
          disabled={disabled}
          className="flex-1 px-4 py-3.5 bg-[#1a1a2e] border-2 border-gray-700 rounded-xl
            text-white placeholder-gray-600 text-base outline-none
            focus:border-purple-500 transition-colors disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="px-5 py-3.5 bg-emerald-500 rounded-xl font-semibold text-sm
            disabled:opacity-50 transition-opacity"
        >
          Guess
        </button>
      </div>
    </div>
  )
}
