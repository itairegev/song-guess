import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildSearchQuery, filterTracks, pickRandomSongs, ERA_RANGES, getSpotifyToken, searchTracks, _resetTokenCache } from '@/lib/spotify'

describe('ERA_RANGES', () => {
  it('maps era labels to year ranges', () => {
    expect(ERA_RANGES['90s']).toBe('1990-1999')
    expect(ERA_RANGES['2000s']).toBe('2000-2009')
  })
})

describe('buildSearchQuery', () => {
  it('builds a Spotify search query with year filter', () => {
    const query = buildSearchQuery('1990-1999')
    expect(query).toContain('year:1990-1999')
  })
})

describe('filterTracks', () => {
  const mockTracks = [
    { id: '1', name: 'Song A', preview_url: 'http://audio.mp3', popularity: 80, artists: [{ name: 'Artist A' }], album: { release_date: '1995' } },
    { id: '2', name: 'Song B', preview_url: null, popularity: 90, artists: [{ name: 'Artist B' }], album: { release_date: '1993' } },
    { id: '3', name: 'Song C', preview_url: 'http://audio2.mp3', popularity: 30, artists: [{ name: 'Artist C' }], album: { release_date: '1998' } },
    { id: '4', name: 'Song D', preview_url: 'http://audio3.mp3', popularity: 60, artists: [{ name: 'Artist D' }], album: { release_date: '1991' } },
  ]

  it('filters out tracks without preview_url', () => {
    const result = filterTracks(mockTracks, 50)
    expect(result.every(t => t.previewUrl !== null)).toBe(true)
  })

  it('filters out tracks below popularity threshold', () => {
    const result = filterTracks(mockTracks, 50)
    expect(result).toHaveLength(2)
  })

  it('returns correctly shaped objects', () => {
    const result = filterTracks(mockTracks, 50)
    expect(result[0]).toEqual({
      id: '1',
      name: 'Song A',
      artist: 'Artist A',
      year: '1995',
      previewUrl: 'http://audio.mp3',
    })
  })
})

describe('pickRandomSongs', () => {
  const songs = Array.from({ length: 10 }, (_, i) => ({
    id: String(i),
    name: `Song ${i}`,
    artist: `Artist ${i}`,
    year: '1990',
    previewUrl: `http://audio${i}.mp3`,
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

describe('getSpotifyToken', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    _resetTokenCache()
  })

  it('returns access token on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ access_token: 'test-token', expires_in: 3600 }),
    }))
    const token = await getSpotifyToken('id', 'secret')
    expect(token).toBe('test-token')
  })

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    }))
    await expect(getSpotifyToken('id', 'secret')).rejects.toThrow('Spotify token error: 401')
  })
})

describe('searchTracks', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns track items from search', async () => {
    const mockItems = [{ id: '1', name: 'Song' }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ tracks: { items: mockItems } }),
    }))
    const result = await searchTracks('token', '1990-1999', 0)
    expect(result).toEqual(mockItems)
  })

  it('returns empty array when no tracks', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ tracks: { items: [] } }),
    }))
    const result = await searchTracks('token', '1990-1999')
    expect(result).toEqual([])
  })

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
    }))
    await expect(searchTracks('token', '1990-1999')).rejects.toThrow('Spotify search error: 403')
  })
})
