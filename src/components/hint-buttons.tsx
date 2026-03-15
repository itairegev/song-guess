'use client'

interface HintButtonsProps {
  onAudioHint: () => void
  onLetterHint: () => void
  onSkip: () => void
  audioDisabled: boolean
  letterDisabled: boolean
}

export function HintButtons({
  onAudioHint,
  onLetterHint,
  onSkip,
  audioDisabled,
  letterDisabled,
}: HintButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <button
          onClick={onAudioHint}
          disabled={audioDisabled}
          className="flex-1 py-3.5 bg-[#1a1a2e] border-2 border-purple-500 rounded-xl text-center
            disabled:opacity-30 disabled:border-gray-700 transition-all"
        >
          <div className="text-base mb-0.5">&#9835; +3 sec</div>
          <div className="text-xs text-gray-500">-100 pts</div>
        </button>
        <button
          onClick={onLetterHint}
          disabled={letterDisabled}
          className="flex-1 py-3.5 bg-[#1a1a2e] border-2 border-purple-500 rounded-xl text-center
            disabled:opacity-30 disabled:border-gray-700 transition-all"
        >
          <div className="text-base mb-0.5">A&#818; Letter</div>
          <div className="text-xs text-gray-500">-150 pts</div>
        </button>
      </div>
      <button
        onClick={onSkip}
        className="w-full text-center text-sm text-gray-600 hover:text-gray-400 transition-colors py-2"
      >
        Skip this song
      </button>
    </div>
  )
}
