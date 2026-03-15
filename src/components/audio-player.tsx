'use client'

interface AudioPlayerUIProps {
  revealedSeconds: number
  maxSeconds: number
  isPlaying: boolean
  isLoaded: boolean
  onPlay: () => void
}

export function AudioPlayerUI({
  revealedSeconds,
  maxSeconds,
  isPlaying,
  isLoaded,
  onPlay,
}: AudioPlayerUIProps) {
  const progress = (revealedSeconds / maxSeconds) * 100

  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-5 text-center">
      <p className="text-xs text-gray-500 mb-3">
        {isLoaded ? 'Tap to play' : 'Loading...'}
      </p>

      <button
        onClick={onPlay}
        disabled={!isLoaded || isPlaying}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-400
          flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20
          disabled:opacity-50 transition-opacity"
      >
        {isPlaying ? (
          <div className="w-5 h-5 border-2 border-white rounded-sm" />
        ) : (
          <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
        )}
      </button>

      <div className="relative h-1.5 bg-gray-800 rounded-full mb-2">
        <div
          className="absolute left-0 top-0 h-1.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-600">
        <span>0:00</span>
        <span className="text-purple-400">{revealedSeconds}s / {maxSeconds}s</span>
        <span>0:30</span>
      </div>
    </div>
  )
}
