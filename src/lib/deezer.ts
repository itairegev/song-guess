export interface DeezerTrackRaw {
  id: number
  title: string
  preview: string
  rank: number
  artist: { name: string }
  album: { title: string }
}

export interface Song {
  id: string
  name: string
  artist: string
  year: string
  previewUrl: string
}

// Curated Deezer playlists: "100 Greatest Songs of the [decade]"
export const ERA_PLAYLISTS: Record<string, { playlistId: string; label: string }> = {
  '60s': { playlistId: '11798814481', label: '60s' },
  '70s': { playlistId: '11798818261', label: '70s' },
  '80s': { playlistId: '11798808421', label: '80s' },
  '90s': { playlistId: '11798812881', label: '90s' },
  '2000s': { playlistId: '11153531204', label: '2000s' },
  '2010s': { playlistId: '11153461484', label: '2010s' },
  '2020s': { playlistId: '13650084141', label: '2020s' },
}

export function cleanSongTitle(title: string): string {
  return title
    .replace(/\s*[\(\[].*?[\)\]]/g, '')  // remove (anything) and [anything]
    .replace(/\s*-\s*(\d{4}\s+)?(remaster|remix|edit|version|mix|live|mono|stereo|single|deluxe|bonus|acoustic|radio|original|feat\b).*$/i, '')  // remove " - Remaster...", " - 2008 Remaster..." etc.
    .trim()
}

export function filterTracks(tracks: DeezerTrackRaw[]): Song[] {
  return tracks
    .filter(t => t.preview && t.preview.length > 10)
    .map(t => ({
      id: String(t.id),
      name: cleanSongTitle(t.title),
      artist: t.artist?.name ?? 'Unknown',
      year: '',
      previewUrl: t.preview,
    }))
}

export function pickRandomSongs(songs: Song[], count: number): Song[] {
  const shuffled = [...songs].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export async function fetchPlaylistTracks(
  playlistId: string,
  limit: number = 100
): Promise<DeezerTrackRaw[]> {
  const url = `https://api.deezer.com/playlist/${playlistId}/tracks?limit=${limit}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Deezer API error: ${response.status}`)
  }

  const data = await response.json()
  return data.data ?? []
}

export async function fetchSongsForEra(era: string): Promise<Song[]> {
  const playlist = ERA_PLAYLISTS[era]
  if (!playlist) {
    throw new Error(`Invalid era: ${era}`)
  }

  const rawTracks = await fetchPlaylistTracks(playlist.playlistId)
  const songs = filterTracks(rawTracks)

  // Pick 8 (5 to play + 3 substitutes)
  return pickRandomSongs(songs, 8)
}
