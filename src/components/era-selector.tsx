'use client'

const ERAS = ['60s', '70s', '80s', '90s', '2000s', '2010s', '2020s', 'Israeli', 'Hot Now']

interface EraSelectorProps {
  selected: string | null
  onSelect: (era: string) => void
}

export function EraSelector({ selected, onSelect }: EraSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {ERAS.map(era => (
        <button
          key={era}
          onClick={() => onSelect(era)}
          className={`px-5 py-3 rounded-xl text-sm font-semibold border-2 transition-all
            ${selected === era
              ? 'border-purple-500 bg-purple-500/20 text-purple-300'
              : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
        >
          {era}
        </button>
      ))}
    </div>
  )
}
