import { NextRequest, NextResponse } from 'next/server'
import {
  fetchPlaylistTracks,
  filterTracks,
  pickRandomSongs,
  ERA_PLAYLISTS,
} from '@/lib/deezer'

export async function GET(request: NextRequest) {
  const era = request.nextUrl.searchParams.get('era')

  if (!era || !ERA_PLAYLISTS[era]) {
    return NextResponse.json(
      { error: 'Invalid era. Must be one of: ' + Object.keys(ERA_PLAYLISTS).join(', ') },
      { status: 400 }
    )
  }

  try {
    const { playlistId } = ERA_PLAYLISTS[era]
    const rawTracks = await fetchPlaylistTracks(playlistId)
    const songs = filterTracks(rawTracks)

    if (songs.length === 0) {
      return NextResponse.json(
        { error: 'No songs with previews found for this era' },
        { status: 404 }
      )
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
