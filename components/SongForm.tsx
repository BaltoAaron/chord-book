'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Song } from '@/lib/types'

interface SongFormProps {
  song?: Song
}

export default function SongForm({ song }: SongFormProps) {
  const [artist, setArtist] = useState(song?.artist || '')
  const [title, setTitle] = useState(song?.title || '')
  const [chords, setChords] = useState(song?.chords || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!song

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('songs')
          .update({ artist, title, chords, updated_at: new Date().toISOString() })
          .eq('id', song.id)
        if (error) throw error
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { error } = await supabase
          .from('songs')
          .insert({ artist, title, chords, user_id: user.id })
        if (error) throw error
      }

      router.push('/home')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!song || !confirm('Are you sure you want to delete this song?')) return

    setLoading(true)
    try {
      const { error } = await supabase.from('songs').delete().eq('id', song.id)
      if (error) throw error

      router.push('/home')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded bg-red-100 text-red-700">{error}</div>
      )}

      <div>
        <label htmlFor="artist" className="block text-sm font-medium text-gray-700">
          Artist
        </label>
        <input
          id="artist"
          type="text"
          required
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Artist name"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Song title"
        />
      </div>

      <div>
        <label htmlFor="chords" className="block text-sm font-medium text-gray-700">
          Chords
        </label>
        <textarea
          id="chords"
          required
          value={chords}
          onChange={(e) => setChords(e.target.value)}
          rows={15}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="Enter your chord chart here..."
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Song' : 'Create Song'}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
