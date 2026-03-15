'use client'

interface SongBlanksProps {
  letters: string[]
  letterHints: number
}

export function SongBlanks({ letters, letterHints }: SongBlanksProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-600 mb-2">SONG TITLE</p>
      <div className="flex flex-wrap gap-1.5 justify-center mb-2" dir="auto">
        {letters.map((ch, i) => {
          if (ch === ' ') {
            return <span key={i} className="w-3" />
          }
          const isRevealed = ch !== '_'
          return (
            <span
              key={i}
              className={`inline-flex items-center justify-center w-7 h-9 text-lg font-semibold
                border-b-2 ${isRevealed ? 'border-purple-500 text-purple-400' : 'border-gray-700 text-gray-600'}`}
            >
              {ch}
            </span>
          )
        })}
      </div>
      {letterHints > 0 && (
        <p className="text-xs text-gray-600">{letterHints} letter{letterHints !== 1 ? 's' : ''} revealed</p>
      )}
    </div>
  )
}
