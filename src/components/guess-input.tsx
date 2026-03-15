'use client'

import { useState } from 'react'

interface GuessInputProps {
  onGuess: (guess: string) => boolean
  disabled: boolean
}

export function GuessInput({ onGuess, disabled }: GuessInputProps) {
  const [value, setValue] = useState('')
  const [shaking, setShaking] = useState(false)

  const handleSubmit = () => {
    if (!value.trim() || disabled) return
    const correct = onGuess(value.trim())
    if (!correct) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
    setValue('')
  }

  return (
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
  )
}
