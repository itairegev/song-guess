import { describe, it, expect, vi, beforeEach } from 'vitest'
import { filterTracks, pickRandomSongs, ERA_PLAYLISTS, fetchPlaylistTracks, cleanSongTitle } from '@/lib/deezer'

describe('cleanSongTitle', () => {
  it('removes parenthesized version info', () => {
    expect(cleanSongTitle('Return of the Mack (Radio Edit)')).toBe('Return of the Mack')
  })

  it('removes bracketed version info', () => {
    expect(cleanSongTitle('Believe [Club Mix]')).toBe('Believe')
  })

  it('removes remaster after hyphen', () => {
    expect(cleanSongTitle('Something Got Me Started - 2008 Remaster')).toBe('Something Got Me Started')
  })

  it('removes remix after hyphen', () => {
    expect(cleanSongTitle('Blue Monday - Remix')).toBe('Blue Monday')
  })

  it('removes multiple parenthesized parts', () => {
    expect(cleanSongTitle('MMMBop (Single Version) [Remastered]')).toBe('MMMBop')
  })

  it('keeps titles without version info', () => {
    expect(cleanSongTitle('Bohemian Rhapsody')).toBe('Bohemian Rhapsody')
  })

  it('keeps meaningful hyphens', () => {
    expect(cleanSongTitle('Self-Esteem')).toBe('Self-Esteem')
  })

  it('removes feat after hyphen', () => {
    expect(cleanSongTitle('Song Name - feat. Someone')).toBe('Song Name')
  })
})

describe('ERA_PLAYLISTS', () => {
  it('maps era labels to playlist ID arrays', () => {
    expect(ERA_PLAYLISTS['90s'].playlistIds.length).toBeGreaterThan(0)
    expect(ERA_PLAYLISTS['2000s'].playlistIds.length).toBeGreaterThan(0)
  })

  it('covers all categories', () => {
    expect(Object.keys(ERA_PLAYLISTS)).toEqual(['60s', '70s', '80s', '90s', '2000s', '2010s', '2020s', 'Israeli', 'Hot Now'])
  })
})

describe('filterTracks', () => {
  const mockTracks = [
    { id: 1, title: 'Song A', preview: 'https://cdn.deezer.com/preview/a.mp3', rank: 800000, artist: { name: 'Artist A' }, album: { title: 'Album A' } },
    { id: 2, title: 'Song B', preview: '', rank: 900000, artist: { name: 'Artist B' }, album: { title: 'Album B' } },
    { id: 3, title: 'Song C', preview: 'https://cdn.deezer.com/preview/c.mp3', rank: 300000, artist: { name: 'Artist C' }, album: { title: 'Album C' } },
  ]

  it('filters out tracks without preview', () => {
    const result = filterTracks(mockTracks)
    expect(result).toHaveLength(2)
    expect(result.every(t => t.previewUrl.length > 10)).toBe(true)
  })

  it('returns correctly shaped objects', () => {
    const result = filterTracks(mockTracks)
    expect(result[0]).toEqual({
      id: '1',
      name: 'Song A',
      artist: 'Artist A',
      year: '',
      previewUrl: 'https://cdn.deezer.com/preview/a.mp3',
    })
  })
})

describe('pickRandomSongs', () => {
  const songs = Array.from({ length: 10 }, (_, i) => ({
    id: String(i),
    name: `Song ${i}`,
    artist: `Artist ${i}`,
    year: '',
    previewUrl: `https://cdn.deezer.com/preview/${i}.mp3`,
  }))

  it('picks the requested number of songs', () => {
    expect(pickRandomSongs(songs, 5)).toHaveLength(5)
  })

  it('returns all if fewer available than requested', () => {
    expect(pickRandomSongs(songs.slice(0, 3), 5)).toHaveLength(3)
  })

  it('returns unique songs', () => {
    const result = pickRandomSongs(songs, 5)
    const ids = result.map(s => s.id)
    expect(new Set(ids).size).toBe(5)
  })
})

describe('fetchPlaylistTracks', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns track data from playlist', async () => {
    const mockData = [{ id: 1, title: 'Song' }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockData }),
    }))
    const result = await fetchPlaylistTracks('12345')
    expect(result).toEqual(mockData)
  })

  it('returns empty array when no data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    }))
    const result = await fetchPlaylistTracks('12345')
    expect(result).toEqual([])
  })

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }))
    await expect(fetchPlaylistTracks('12345')).rejects.toThrow('Deezer API error: 500')
  })
})
