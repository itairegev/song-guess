import { describe, it, expect } from 'vitest'
import { calculateRoundScore } from '@/lib/scoring'

describe('calculateRoundScore', () => {
  it('returns 1000 with no hints', () => {
    expect(calculateRoundScore(0, 0)).toBe(1000)
  })

  it('deducts 100 per audio hint', () => {
    expect(calculateRoundScore(2, 0)).toBe(800)
  })

  it('deducts 150 per letter hint', () => {
    expect(calculateRoundScore(0, 2)).toBe(700)
  })

  it('deducts both hint types', () => {
    expect(calculateRoundScore(2, 1)).toBe(650)
  })

  it('floors at 100 for correct guess', () => {
    expect(calculateRoundScore(5, 3)).toBe(100)
  })

  it('floors at 100 even with extreme hints', () => {
    expect(calculateRoundScore(9, 10)).toBe(100)
  })
})
