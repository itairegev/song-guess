import { useState, useCallback } from 'react'
import { Song } from '@/lib/deezer'
import { calculateRoundScore } from '@/lib/scoring'
import { isCorrectGuess } from '@/lib/fuzzy-match'

export interface RoundState {
  song: Song
  revealedSeconds: number
  audioHints: number
  letterHints: number
  revealedIndices: number[]
  guessedCorrectly: boolean
  skipped: boolean
  score: number
}

export interface GameState {
  era: string
  songs: Song[]
  currentRound: number
  rounds: RoundState[]
  phase: 'playing' | 'round-result' | 'game-over'
}

export function createInitialRound(song: Song): RoundState {
  return {
    song,
    revealedSeconds: 2,
    audioHints: 0,
    letterHints: 0,
    revealedIndices: [],
    guessedCorrectly: false,
    skipped: false,
    score: 0,
  }
}

export function addAudioHint(round: RoundState): RoundState {
  const newSeconds = Math.min(30, round.revealedSeconds + 3)
  return {
    ...round,
    revealedSeconds: newSeconds,
    audioHints: round.audioHints + 1,
  }
}

export function revealLetter(round: RoundState): RoundState {
  const name = round.song.name
  const letterIndices: number[] = []
  for (let i = 0; i < name.length; i++) {
    const ch = name[i]
    if (ch !== ' ' && !round.revealedIndices.includes(i)) {
      letterIndices.push(i)
    }
  }
  if (letterIndices.length === 0) return round

  const idx = letterIndices[Math.floor(Math.random() * letterIndices.length)]
  return {
    ...round,
    revealedIndices: [...round.revealedIndices, idx],
    letterHints: round.letterHints + 1,
  }
}

export function getVisibleLetters(name: string, revealedIndices: number[]): string[] {
  return name.split('').map((ch, i) => {
    if (ch === ' ') return ' '
    if (revealedIndices.includes(i)) return ch
    return '_'
  })
}

export function useGame() {
  const [game, setGame] = useState<GameState | null>(null)

  const currentRound = game
    ? game.rounds[game.currentRound] ?? null
    : null

  const totalScore = game
    ? game.rounds.reduce((sum, r) => sum + r.score, 0)
    : 0

  const startGame = useCallback((era: string, songs: Song[]) => {
    const rounds = songs.map(createInitialRound)
    setGame({
      era,
      songs,
      currentRound: 0,
      rounds,
      phase: 'playing',
    })
  }, [])

  function handleAudioHint() {
    setGame(prev => {
      if (!prev) return prev
      const round = prev.rounds[prev.currentRound]
      if (!round) return prev
      const updatedRound = addAudioHint(round)
      const rounds = [...prev.rounds]
      rounds[prev.currentRound] = updatedRound
      return { ...prev, rounds }
    })
  }

  function handleLetterHint() {
    setGame(prev => {
      if (!prev) return prev
      const round = prev.rounds[prev.currentRound]
      if (!round) return prev
      const updatedRound = revealLetter(round)
      const rounds = [...prev.rounds]
      rounds[prev.currentRound] = updatedRound
      return { ...prev, rounds }
    })
  }

  function handleGuess(guess: string): boolean {
    if (!game) return false
    const round = game.rounds[game.currentRound]
    if (!round) return false

    const correct = isCorrectGuess(guess, round.song.name)
    if (!correct) return false

    const score = calculateRoundScore(round.audioHints, round.letterHints)

    setGame(prev => {
      if (!prev) return prev
      const r = prev.rounds[prev.currentRound]
      if (!r) return prev
      const updatedRound: RoundState = {
        ...r,
        guessedCorrectly: true,
        score,
      }
      const rounds = [...prev.rounds]
      rounds[prev.currentRound] = updatedRound
      return { ...prev, rounds, phase: 'round-result' }
    })
    return true
  }

  function handleSkip() {
    setGame(prev => {
      if (!prev) return prev
      const round = prev.rounds[prev.currentRound]
      if (!round) return prev
      const updatedRound: RoundState = { ...round, skipped: true, score: 0 }
      const rounds = [...prev.rounds]
      rounds[prev.currentRound] = updatedRound
      return { ...prev, rounds, phase: 'round-result' }
    })
  }

  function handleNextRound() {
    setGame(prev => {
      if (!prev) return prev
      const next = prev.currentRound + 1
      const phase = next >= prev.rounds.length ? 'game-over' : 'playing'
      return { ...prev, currentRound: next, phase }
    })
  }

  return {
    game,
    setGame,
    currentRound,
    totalScore,
    startGame,
    handleAudioHint,
    handleLetterHint,
    handleGuess,
    handleSkip,
    handleNextRound,
  }
}
