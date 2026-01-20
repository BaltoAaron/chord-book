'use client'

import Link from 'next/link'
import type { Song } from '@/lib/types'

interface SongCardProps {
  song: Song
}

export default function SongCard({ song }: SongCardProps) {
  return (
    <Link
      href={`/song/${song.id}`}
      className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
    >
      <h3 className="font-semibold text-white">{song.artist} - {song.title}</h3>
      {/* <p className="text-sm text-gray-400">{song.artist}</p> */}
    </Link>
  )
}
