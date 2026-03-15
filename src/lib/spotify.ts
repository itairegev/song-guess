export interface SpotifyTrackRaw {
  id: string
  name: string
  preview_url: string | null
  popularity: number
  artists: { name: string }[]
  album: { release_date: string }
}

export interface Song {
  id: string
  name: string
  artist: string
  year: string
  previewUrl: string
}

export const ERA_RANGES: Record<string, string> = {
  '60s': '1960-1969',
  '70s': '1970-1979',
  '80s': '1980-1989',
  '90s': '1990-1999',
  '2000s': '2000-2009',
  '2010s': '2010-2019',
  '2020s': '2020-2029',
}

export function buildSearchQuery(yearRange: string): string {
  return `year:${yearRange}`
}

export function filterTracks(
  tracks: SpotifyTrackRaw[],
  minPopularity: number
): Song[] {
  return tracks
    .filter(t => t.preview_url !== null && t.popularity >= minPopularity)
    .map(t => ({
      id: t.id,
      name: t.name,
      artist: t.artists[0]?.name ?? 'Unknown',
      year: t.album.release_date.slice(0, 4),
      previewUrl: t.preview_url!,
    }))
}

export function pickRandomSongs(songs: Song[], count: number): Song[] {
  const shuffled = [...songs].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

let cachedToken: { token: string; expiresAt: number } | null = null

export function _resetTokenCache(): void {
  cachedToken = null
}

export async function getSpotifyToken(
  clientId: string,
  clientSecret: string
): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    throw new Error(`Spotify token error: ${response.status}`)
  }

  const data = await response.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }
  return data.access_token
}

export async function searchTracks(
  token: string,
  yearRange: string,
  offset: number = 0
): Promise<SpotifyTrackRaw[]> {
  const query = encodeURIComponent(buildSearchQuery(yearRange))
  const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=50&offset=${offset}`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Spotify search error: ${response.status}`)
  }

  const data = await response.json()
  return data.tracks?.items ?? []
}
