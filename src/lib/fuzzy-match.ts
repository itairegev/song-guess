import { distance } from 'fastest-levenshtein'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')   // remove punctuation, keep all unicode letters & numbers
    .replace(/\s+/g, ' ')               // collapse whitespace
    .trim()
    .replace(/^(the|a|an)\s+/, '')      // strip leading English articles
}

export function isCorrectGuess(guess: string, target: string): boolean {
  const normalizedGuess = normalize(guess)
  const normalizedTarget = normalize(target)

  if (!normalizedGuess || !normalizedTarget) return false
  if (normalizedGuess === normalizedTarget) return true

  const maxLen = Math.max(normalizedGuess.length, normalizedTarget.length)

  const similarity = 1 - distance(normalizedGuess, normalizedTarget) / maxLen
  return similarity > 0.85
}
