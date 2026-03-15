import { useState, useCallback, useRef, useEffect } from 'react'
import { AudioPlayer } from '@/lib/audio-player'

export function useAudio() {
  const playerRef = useRef<AudioPlayer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    playerRef.current = new AudioPlayer()
    return () => {
      playerRef.current?.destroy()
    }
  }, [])

  const load = useCallback(async (url: string) => {
    setIsLoaded(false)
    setLoadError(false)
    try {
      await playerRef.current?.load(url)
      setIsLoaded(true)
    } catch {
      setLoadError(true)
    }
  }, [])

  const play = useCallback((durationSeconds: number) => {
    if (!playerRef.current?.isLoaded) return
    setIsPlaying(true)
    playerRef.current.play(durationSeconds, () => {
      setIsPlaying(false)
    })
  }, [])

  const stop = useCallback(() => {
    playerRef.current?.stop()
    setIsPlaying(false)
  }, [])

  return { isPlaying, isLoaded, loadError, load, play, stop }
}
