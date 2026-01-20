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
      className="block p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
    >
      <h3 className="font-semibold text-gray-900">{song.artist} - {song.title}</h3>
      {/* <p className="text-sm text-gray-400">{song.artist}</p> */}
    </Link>
  )
}
