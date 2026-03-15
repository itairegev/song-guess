import { describe, it, expect } from 'vitest'
import { isCorrectGuess } from '@/lib/fuzzy-match'

describe('isCorrectGuess', () => {
  it('matches exact title', () => {
    expect(isCorrectGuess('Bohemian Rhapsody', 'Bohemian Rhapsody')).toBe(true)
  })

  it('matches case insensitive', () => {
    expect(isCorrectGuess('bohemian rhapsody', 'Bohemian Rhapsody')).toBe(true)
  })

  it('strips leading "The" from both', () => {
    expect(isCorrectGuess('Sound of Silence', 'The Sound of Silence')).toBe(true)
  })

  it('strips leading "A" article', () => {
    expect(isCorrectGuess('Hard Days Night', "A Hard Day's Night")).toBe(true)
  })

  it('ignores punctuation', () => {
    expect(isCorrectGuess("dont stop believin", "Don't Stop Believin'")).toBe(true)
  })

  it('accepts close typos (>85% similarity)', () => {
    expect(isCorrectGuess('Bohemain Rhapsody', 'Bohemian Rhapsody')).toBe(true)
  })

  it('rejects very different strings', () => {
    expect(isCorrectGuess('Yesterday', 'Bohemian Rhapsody')).toBe(false)
  })

  it('rejects partial matches that are too short', () => {
    expect(isCorrectGuess('Teen Spirit', 'Smells Like Teen Spirit')).toBe(false)
  })

  it('handles extra whitespace', () => {
    expect(isCorrectGuess('  bohemian   rhapsody  ', 'Bohemian Rhapsody')).toBe(true)
  })
})
