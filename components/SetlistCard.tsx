'use client'

import Link from 'next/link'
import type { Setlist } from '@/lib/types'

interface SetlistCardProps {
  setlist: Setlist
  songCount: number
}

export default function SetlistCard({ setlist, songCount }: SetlistCardProps) {
  return (
    <Link
      href={`/setlist/${setlist.id}`}
      className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
    >
      <h3 className="font-semibold text-white">{setlist.name}</h3>
      <p className="text-sm text-gray-400">
        {songCount} {songCount === 1 ? 'song' : 'songs'}
      </p>
    </Link>
  )
}
