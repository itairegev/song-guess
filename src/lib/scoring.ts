const BASE_SCORE = 1000
const AUDIO_HINT_COST = 100
const LETTER_HINT_COST = 150
const MIN_SCORE = 100

export function calculateRoundScore(
  audioHints: number,
  letterHints: number
): number {
  const deductions = audioHints * AUDIO_HINT_COST + letterHints * LETTER_HINT_COST
  return Math.max(MIN_SCORE, BASE_SCORE - deductions)
}
