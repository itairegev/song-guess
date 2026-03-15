'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGame, getVisibleLetters, createInitialRound } from '@/hooks/use-game'
import type { Song } from '@/lib/deezer'
import { useAudio } from '@/hooks/use-audio'
import { AudioPlayerUI } from '@/components/audio-player'
import { SongBlanks } from '@/components/song-blanks'
import { GuessInput } from '@/components/guess-input'
import { HintButtons } from '@/components/hint-buttons'
import { RoundResult } from '@/components/round-result'

export default function GamePage() {
  const router = useRouter()
  const {
    game, setGame, currentRound, totalScore,
    startGame, handleAudioHint, handleLetterHint,
    handleGuess, handleSkip, handleNextRound,
  } = useGame()
  const audio = useAudio()

  const substitutesRef = useRef<Song[]>([])

  // Load game data from sessionStorage
  useEffect(() => {
    const raw = sessionStorage.getItem('gameData')
    if (!raw) {
      router.push('/')
      return
    }
    const { era, songs } = JSON.parse(raw)
    if (!songs?.length) {
      router.push('/')
      return
    }
    // Use first 5 for game, rest as substitutes
    startGame(era, songs.slice(0, 5))
    substitutesRef.current = songs.slice(5)
  }, [router, startGame])

  // Load audio when round changes
  useEffect(() => {
    if (currentRound?.song.previewUrl) {
      audio.load(currentRound.song.previewUrl)
    }
  }, [currentRound?.song.previewUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  // If audio fails to load, try a substitute song
  useEffect(() => {
    if (audio.loadError && game?.phase === 'playing') {
      if (substitutesRef.current.length > 0) {
        const [sub, ...rest] = substitutesRef.current
        substitutesRef.current = rest
        setGame(prev => {
          if (!prev) return prev
          const rounds = [...prev.rounds]
          rounds[prev.currentRound] = createInitialRound(sub)
          return { ...prev, rounds, songs: prev.songs.map((s, i) => i === prev.currentRound ? sub : s) }
        })
      } else {
        handleSkip()
      }
    }
  }, [audio.loadError]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!game || !currentRound) return null

  const letters = getVisibleLetters(currentRound.song.name, currentRound.revealedIndices)
  const allLettersRevealed = !letters.includes('_')
  const maxAudioReached = currentRound.revealedSeconds >= 30

  const handlePlayAudio = () => {
    audio.play(currentRound.revealedSeconds)
  }

  const handleNext = () => {
    audio.stop()
    if (game.currentRound + 1 >= game.songs.length) {
      sessionStorage.setItem('gameResult', JSON.stringify({
        era: game.era,
        rounds: game.rounds,
        totalScore,
      }))
      router.push('/result')
    } else {
      handleNextRound()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">Round <span className="text-purple-400">{game.currentRound + 1}</span>/{game.songs.length}</span>
        <span className="text-gray-500">{game.era} Hits</span>
        <span className="text-purple-400 font-semibold">{totalScore} pts</span>
      </div>

      {/* Audio player */}
      <AudioPlayerUI
        revealedSeconds={currentRound.revealedSeconds}
        maxSeconds={30}
        isPlaying={audio.isPlaying}
        isLoaded={audio.isLoaded}
        onPlay={handlePlayAudio}
      />

      {/* Song blanks */}
      <SongBlanks letters={letters} letterHints={currentRound.letterHints} />

      {/* Guess input */}
      <GuessInput
        onGuess={handleGuess}
        disabled={game.phase !== 'playing'}
        songName={currentRound.song.name}
      />

      {/* Hint buttons */}
      <HintButtons
        onAudioHint={handleAudioHint}
        onLetterHint={handleLetterHint}
        onSkip={handleSkip}
        audioDisabled={maxAudioReached}
        letterDisabled={allLettersRevealed}
      />

      {/* Round result overlay */}
      {game.phase === 'round-result' && (
        <RoundResult
          round={currentRound}
          roundNumber={game.currentRound + 1}
          totalRounds={game.songs.length}
          totalScore={totalScore}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
