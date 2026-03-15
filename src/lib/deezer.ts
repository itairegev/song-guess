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

// Multiple playlists per era for variety
export const ERA_PLAYLISTS: Record<string, { playlistIds: string[]; label: string }> = {
  '60s': {
    label: '60s',
    playlistIds: ['11798814481', '7281498024', '4448533262'],
  },
  '70s': {
    label: '70s',
    playlistIds: ['11798818261', '7957934742', '6046721604'],
  },
  '80s': {
    label: '80s',
    playlistIds: ['11798808421', '867825522', '8512471762'],
  },
  '90s': {
    label: '90s',
    playlistIds: ['11798812881', '878989033', '8873744282', '9796303762'],
  },
  '2000s': {
    label: '2000s',
    playlistIds: ['11153531204', '248297032', '1318937087'],
  },
  '2010s': {
    label: '2010s',
    playlistIds: ['11153461484', '14917875723', '12092135471'],
  },
  '2020s': {
    label: '2020s',
    playlistIds: ['13650084141', '2714778644'],
  },
  'Israeli': {
    label: 'Israeli',
    playlistIds: ['14340903501', '9886516382'],
  },
  'Hot Now': {
    label: 'Hot Now',
    playlistIds: ['chart:0', '10064140302', '9890417302'],
  },
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
  // Deduplicate by song name (same song can appear in multiple playlists)
  const unique = new Map<string, Song>()
  for (const song of songs) {
    const key = song.name.toLowerCase()
    if (!unique.has(key)) {
      unique.set(key, song)
    }
  }
  const deduped = [...unique.values()]
  const shuffled = deduped.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export async function fetchPlaylistTracks(
  playlistId: string,
  limit: number = 200,
  offset: number = 0
): Promise<DeezerTrackRaw[]> {
  // Support Deezer chart endpoint via "chart:N" IDs
  const isChart = playlistId.startsWith('chart:')
  const url = isChart
    ? `https://api.deezer.com/chart/${playlistId.slice(6)}/tracks?limit=${limit}&index=${offset}`
    : `https://api.deezer.com/playlist/${playlistId}/tracks?limit=${limit}&index=${offset}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Deezer API error: ${response.status}`)
  }

  const data = await response.json()
  return data.data ?? []
}

export async function fetchSongsForEra(era: string): Promise<Song[]> {
  const config = ERA_PLAYLISTS[era]
  if (!config) {
    throw new Error(`Invalid era: ${era}`)
  }

  // Pick a random playlist from the era's options
  const playlistId = config.playlistIds[Math.floor(Math.random() * config.playlistIds.length)]

  // Fetch with random offset for large playlists
  const rawTracks = await fetchPlaylistTracks(playlistId, 200)
  const songs = filterTracks(rawTracks)

  // Pick 8 (5 to play + 3 substitutes)
  return pickRandomSongs(songs, 8)
}
