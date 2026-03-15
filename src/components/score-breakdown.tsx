interface ScoreBreakdownProps {
  audioHints: number
  letterHints: number
  roundScore: number
  skipped: boolean
}

export function ScoreBreakdown({ audioHints, letterHints, roundScore, skipped }: ScoreBreakdownProps) {
  if (skipped) {
    return (
      <div className="bg-[#1a1a2e] rounded-xl p-4 w-full max-w-[280px]">
        <div className="flex justify-between font-semibold">
          <span>Round score</span>
          <span className="text-gray-500">0</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a2e] rounded-xl p-4 w-full max-w-[280px]">
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gray-500">Base score</span>
        <span>1000</span>
      </div>
      {audioHints > 0 && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-500">+3 sec hints x {audioHints}</span>
          <span className="text-red-400">-{audioHints * 100}</span>
        </div>
      )}
      {letterHints > 0 && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-500">Letter hints x {letterHints}</span>
          <span className="text-red-400">-{letterHints * 150}</span>
        </div>
      )}
      <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-semibold">
        <span>Round score</span>
        <span className="text-purple-400">{roundScore}</span>
      </div>
    </div>
  )
}
