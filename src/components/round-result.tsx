'use client'

import { ScoreBreakdown } from './score-breakdown'
import type { RoundState } from '@/hooks/use-game'

interface RoundResultProps {
  round: RoundState
  roundNumber: number
  totalRounds: number
  totalScore: number
  onNext: () => void
}

export function RoundResult({ round, roundNumber, totalRounds, totalScore, onNext }: RoundResultProps) {
  const isCorrect = round.guessedCorrectly

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="bg-[#0f0f1a] rounded-2xl p-6 max-w-sm w-full text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl
          ${isCorrect
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-400'
            : 'bg-gradient-to-br from-red-500 to-red-400'
          }`}
        >
          {isCorrect ? '\u2713' : '\u2717'}
        </div>

        <p className={`text-xl font-bold mb-2 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
          {isCorrect ? 'Correct!' : 'Skipped'}
        </p>

        <p className="text-lg font-semibold">{round.song.name}</p>
        <p className="text-sm text-gray-500 mb-6">{round.song.artist} &bull; {round.song.year}</p>

        <div className="flex justify-center mb-6">
          <ScoreBreakdown
            audioHints={round.audioHints}
            letterHints={round.letterHints}
            roundScore={round.score}
            skipped={round.skipped}
          />
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Round {roundNumber} of {totalRounds} &nbsp;|&nbsp; Total: {totalScore} pts
        </p>

        <button
          onClick={onNext}
          className="px-12 py-3.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl font-semibold"
        >
          {roundNumber < totalRounds ? 'Next Song \u2192' : 'See Results'}
        </button>
      </div>
    </div>
  )
}
