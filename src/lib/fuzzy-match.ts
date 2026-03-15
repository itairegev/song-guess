import { distance } from 'fastest-levenshtein'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')       // remove punctuation
    .replace(/\s+/g, ' ')              // collapse whitespace
    .trim()
    .replace(/^(the|a|an)\s+/, '')     // strip leading articles
}

export function isCorrectGuess(guess: string, target: string): boolean {
  const normalizedGuess = normalize(guess)
  const normalizedTarget = normalize(target)

  if (normalizedGuess === normalizedTarget) return true

  const maxLen = Math.max(normalizedGuess.length, normalizedTarget.length)
  if (maxLen === 0) return false

  const similarity = 1 - distance(normalizedGuess, normalizedTarget) / maxLen
  return similarity > 0.85
}
