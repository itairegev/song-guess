export class AudioPlayer {
  private audio: HTMLAudioElement | null = null
  private stopTimeout: ReturnType<typeof setTimeout> | null = null

  async load(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.audio = new Audio()
      this.audio.crossOrigin = 'anonymous'
      this.audio.preload = 'auto'

      this.audio.addEventListener('canplaythrough', () => resolve(), { once: true })
      this.audio.addEventListener('error', () => reject(new Error('Failed to load audio')), { once: true })

      this.audio.src = url
    })
  }

  play(durationSeconds: number, onEnd?: () => void): void {
    if (!this.audio) return

    this.stop()
    this.audio.currentTime = 0
    this.audio.play()

    this.stopTimeout = setTimeout(() => {
      this.audio?.pause()
      onEnd?.()
    }, durationSeconds * 1000)
  }

  stop(): void {
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout)
      this.stopTimeout = null
    }
    if (this.audio) {
      this.audio.pause()
      this.audio.currentTime = 0
    }
  }

  destroy(): void {
    this.stop()
    if (this.audio) {
      this.audio.src = ''
      this.audio = null
    }
  }

  get isLoaded(): boolean {
    return this.audio !== null && this.audio.readyState >= 3
  }
}
