import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SongCard from '@/components/SongCard'
import SetlistCard from '@/components/SetlistCard'
import LogoutButton from './LogoutButton'
import NewSetlistButton from './NewSetlistButton'

export default async function HomePage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [songsResult, setlistsResult, setlistSongsResult] = await Promise.all([
    supabase
      .from('songs')
      .select('*')
      .eq('user_id', user.id)
      .order('artist', { ascending: true })
      .order('title', { ascending: true }),
    supabase
      .from('setlists')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true }),
    supabase
      .from('setlist_songs')
      .select('setlist_id'),
  ])

  const songs = songsResult.data || []
  const setlists = setlistsResult.data || []
  const setlistSongs = setlistSongsResult.data || []

  // Count songs per setlist
  const songCounts: Record<string, number> = {}
  setlistSongs.forEach((ss) => {
    songCounts[ss.setlist_id] = (songCounts[ss.setlist_id] || 0) + 1
  })

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chord Book</h1>
          <LogoutButton />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Setlists Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Setlists</h2>
              <NewSetlistButton />
            </div>
            <div className="space-y-3">
              {setlists.length === 0 ? (
                <p className="text-gray-500">No setlists yet</p>
              ) : (
                setlists.map((setlist) => (
                  <SetlistCard
                    key={setlist.id}
                    setlist={setlist}
                    songCount={songCounts[setlist.id] || 0}
                  />
                ))
              )}
            </div>
          </section>

          {/* Songs Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Songs</h2>
              <Link
                href="/song/new"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Song
              </Link>
            </div>
            <div className="space-y-3">
              {songs.length === 0 ? (
                <p className="text-gray-500">No songs yet</p>
              ) : (
                songs.map((song) => <SongCard key={song.id} song={song} />)
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
