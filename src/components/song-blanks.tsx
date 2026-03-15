'use client'

interface SongBlanksProps {
  letters: string[]
  letterHints: number
}

function isHebrew(letters: string[]): boolean {
  return letters.some(ch => /[\u0590-\u05FF]/.test(ch))
}

export function SongBlanks({ letters, letterHints }: SongBlanksProps) {
  // Group letters into words (split by spaces)
  const words: string[][] = []
  let current: string[] = []
  for (const ch of letters) {
    if (ch === ' ') {
      if (current.length > 0) words.push(current)
      current = []
    } else {
      current.push(ch)
    }
  }
  if (current.length > 0) words.push(current)

  const rtl = isHebrew(letters)

  return (
    <div className="text-center" dir={rtl ? 'rtl' : 'ltr'}>
      <p className="text-xs text-gray-600 mb-2">SONG TITLE</p>
      <div className="flex flex-wrap gap-3 justify-center mb-2">
        {words.map((word, wi) => (
          <div key={wi} className="flex flex-nowrap gap-1">
            {word.map((ch, ci) => {
              const isRevealed = ch !== '_'
              return (
                <span
                  key={ci}
                  className={`inline-flex items-center justify-center w-7 h-9 text-lg font-semibold
                    border-b-2 ${isRevealed ? 'border-purple-500 text-purple-400' : 'border-gray-700 text-gray-600'}`}
                >
                  {ch}
                </span>
              )
            })}
          </div>
        ))}
      </div>
      {letterHints > 0 && (
        <p className="text-xs text-gray-600">{letterHints} letter{letterHints !== 1 ? 's' : ''} revealed</p>
      )}
    </div>
  )
}
