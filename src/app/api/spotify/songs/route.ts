import { NextRequest, NextResponse } from 'next/server'
import {
  getSpotifyToken,
  searchTracks,
  filterTracks,
  pickRandomSongs,
  ERA_RANGES,
} from '@/lib/spotify'

export async function GET(request: NextRequest) {
  const era = request.nextUrl.searchParams.get('era')

  if (!era || !ERA_RANGES[era]) {
    return NextResponse.json(
      { error: 'Invalid era. Must be one of: ' + Object.keys(ERA_RANGES).join(', ') },
      { status: 400 }
    )
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Spotify credentials not configured' },
      { status: 500 }
    )
  }

  try {
    const token = await getSpotifyToken(clientId, clientSecret)
    const yearRange = ERA_RANGES[era]
    const offset = Math.floor(Math.random() * 950)

    const rawTracks = await searchTracks(token, yearRange, offset)
    let songs = filterTracks(rawTracks, 50)

    // Fallback: relax popularity if not enough songs
    if (songs.length < 5) {
      const fallbackTracks = await searchTracks(token, yearRange, 0)
      songs = filterTracks(fallbackTracks, 30)
    }

    // Pick 8 (5 to play + 3 substitutes)
    const selected = pickRandomSongs(songs, 8)

    return NextResponse.json({ songs: selected })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 502 }
    )
  }
}
