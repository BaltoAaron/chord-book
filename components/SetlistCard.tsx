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
      className="block p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
    >
      <h3 className="font-semibold text-gray-900">{setlist.name}</h3>
      <p className="text-sm text-gray-500">
        {songCount} {songCount === 1 ? 'song' : 'songs'}
      </p>
    </Link>
  )
}
