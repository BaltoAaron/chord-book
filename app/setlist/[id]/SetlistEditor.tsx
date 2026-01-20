'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Setlist, Song, SetlistSong } from '@/lib/types'

interface SetlistEditorProps {
  setlist: Setlist
  setlistSongs: (SetlistSong & { song: Song })[]
  allSongs: Song[]
}

export default function SetlistEditor({
  setlist,
  setlistSongs: initialSetlistSongs,
  allSongs,
}: SetlistEditorProps) {
  const [name, setName] = useState(setlist.name)
  const [setlistSongs, setSetlistSongs] = useState(initialSetlistSongs)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Songs not yet in the setlist
  const availableSongs = allSongs.filter(
    (song) => !setlistSongs.some((ss) => ss.song_id === song.id)
  )

  const handleNameChange = async () => {
    try {
      const { error } = await supabase
        .from('setlists')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', setlist.id)
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleAddSong = async (songId: string) => {
    setLoading(true)
    setError(null)
    try {
      const position = setlistSongs.length
      const { data, error } = await supabase
        .from('setlist_songs')
        .insert({ setlist_id: setlist.id, song_id: songId, position })
        .select('*, song:songs(*)')
        .single()

      if (error) throw error
      setSetlistSongs([...setlistSongs, data])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSong = async (setlistSongId: string) => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase
        .from('setlist_songs')
        .delete()
        .eq('id', setlistSongId)

      if (error) throw error

      const updated = setlistSongs.filter((ss) => ss.id !== setlistSongId)
      // Update positions
      await Promise.all(
        updated.map((ss, index) =>
          supabase
            .from('setlist_songs')
            .update({ position: index })
            .eq('id', ss.id)
        )
      )
      setSetlistSongs(updated.map((ss, index) => ({ ...ss, position: index })))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    setLoading(true)
    setError(null)
    try {
      const newSongs = [...setlistSongs]
      const temp = newSongs[index]
      newSongs[index] = newSongs[index - 1]
      newSongs[index - 1] = temp

      await Promise.all([
        supabase
          .from('setlist_songs')
          .update({ position: index - 1 })
          .eq('id', temp.id),
        supabase
          .from('setlist_songs')
          .update({ position: index })
          .eq('id', newSongs[index].id),
      ])

      setSetlistSongs(
        newSongs.map((ss, i) => ({ ...ss, position: i }))
      )
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index === setlistSongs.length - 1) return
    setLoading(true)
    setError(null)
    try {
      const newSongs = [...setlistSongs]
      const temp = newSongs[index]
      newSongs[index] = newSongs[index + 1]
      newSongs[index + 1] = temp

      await Promise.all([
        supabase
          .from('setlist_songs')
          .update({ position: index + 1 })
          .eq('id', temp.id),
        supabase
          .from('setlist_songs')
          .update({ position: index })
          .eq('id', newSongs[index].id),
      ])

      setSetlistSongs(
        newSongs.map((ss, i) => ({ ...ss, position: i }))
      )
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this setlist?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('setlists')
        .delete()
        .eq('id', setlist.id)
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
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded bg-red-900 text-red-200">{error}</div>
      )}

      {/* Setlist Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Setlist Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameChange}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Songs in Setlist */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Songs in Setlist ({setlistSongs.length})
        </h2>
        {setlistSongs.length === 0 ? (
          <p className="text-gray-400">No songs in this setlist yet</p>
        ) : (
          <ul className="space-y-2">
            {setlistSongs.map((ss, index) => (
              <li
                key={ss.id}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-mono w-6">{index + 1}</span>
                  <div>
                    <p className="text-white font-medium">{ss.song.title}</p>
                    <p className="text-sm text-gray-400">{ss.song.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0 || loading}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                    title="Move up"
                  >
                    &#9650;
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === setlistSongs.length - 1 || loading}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                    title="Move down"
                  >
                    &#9660;
                  </button>
                  <button
                    onClick={() => handleRemoveSong(ss.id)}
                    disabled={loading}
                    className="p-1 text-red-400 hover:text-red-300"
                    title="Remove from setlist"
                  >
                    &times;
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Songs */}
      {availableSongs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Add Songs</h2>
          <ul className="space-y-2">
            {availableSongs.map((song) => (
              <li
                key={song.id}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
                <button
                  onClick={() => handleAddSong(song.id)}
                  disabled={loading}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete Setlist */}
      <div className="pt-6 border-t border-gray-700">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          Delete Setlist
        </button>
      </div>
    </div>
  )
}
