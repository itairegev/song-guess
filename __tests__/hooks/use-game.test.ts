import { describe, it, expect } from 'vitest'
import {
  createInitialRound,
  addAudioHint,
  revealLetter,
  getVisibleLetters,
} from '@/hooks/use-game'

describe('createInitialRound', () => {
  it('creates round with 2s revealed audio', () => {
    const round = createInitialRound({
      id: '1', name: 'Bohemian Rhapsody', artist: 'Queen',
      year: '1975', previewUrl: 'http://audio.mp3',
    })
    expect(round.revealedSeconds).toBe(2)
    expect(round.audioHints).toBe(0)
    expect(round.letterHints).toBe(0)
    expect(round.guessedCorrectly).toBe(false)
    expect(round.skipped).toBe(false)
  })
})

describe('addAudioHint', () => {
  it('adds 3 seconds', () => {
    const round = createInitialRound({
      id: '1', name: 'Test', artist: 'A',
      year: '2000', previewUrl: 'http://a.mp3',
    })
    const updated = addAudioHint(round)
    expect(updated.revealedSeconds).toBe(5)
    expect(updated.audioHints).toBe(1)
  })

  it('caps at 30 seconds', () => {
    let round = createInitialRound({
      id: '1', name: 'Test', artist: 'A',
      year: '2000', previewUrl: 'http://a.mp3',
    })
    round = { ...round, revealedSeconds: 29, audioHints: 9 }
    const updated = addAudioHint(round)
    expect(updated.revealedSeconds).toBe(30)
  })
})

describe('revealLetter', () => {
  it('reveals one letter', () => {
    const round = createInitialRound({
      id: '1', name: 'Hi', artist: 'A',
      year: '2000', previewUrl: 'http://a.mp3',
    })
    const updated = revealLetter(round)
    expect(updated.revealedIndices.length).toBe(1)
    expect(updated.letterHints).toBe(1)
  })
})

describe('getVisibleLetters', () => {
  it('shows spaces and punctuation by default', () => {
    const result = getVisibleLetters('Hey Jude', [])
    expect(result).toEqual(['_', '_', '_', ' ', '_', '_', '_', '_'])
  })

  it('shows revealed letters', () => {
    const result = getVisibleLetters('Hey Jude', [0, 4])
    expect(result).toEqual(['H', '_', '_', ' ', 'J', '_', '_', '_'])
  })
})
