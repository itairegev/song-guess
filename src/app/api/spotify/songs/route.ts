import { NextRequest, NextResponse } from 'next/server'
import { fetchSongsForEra, ERA_PLAYLISTS } from '@/lib/deezer'

export async function GET(request: NextRequest) {
  const era = request.nextUrl.searchParams.get('era')

  if (!era || !ERA_PLAYLISTS[era]) {
    return NextResponse.json(
      { error: 'Invalid era. Must be one of: ' + Object.keys(ERA_PLAYLISTS).join(', ') },
      { status: 400 }
    )
  }

  try {
    const songs = await fetchSongsForEra(era)

    if (songs.length === 0) {
      return NextResponse.json(
        { error: 'No songs with previews found for this era' },
        { status: 404 }
      )
    }

    return NextResponse.json({ songs })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 502 }
    )
  }
}
