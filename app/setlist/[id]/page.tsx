import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SetlistEditor from './SetlistEditor'

interface SetlistPageProps {
  params: { id: string }
}

export default async function SetlistPage({ params }: SetlistPageProps) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const [setlistResult, setlistSongsResult, allSongsResult] = await Promise.all([
    supabase
      .from('setlists')
      .select('*')
      .eq('id', params.id)
      .single(),
    supabase
      .from('setlist_songs')
      .select('*, song:songs(*)')
      .eq('setlist_id', params.id)
      .order('position'),
    supabase
      .from('songs')
      .select('*')
      .eq('user_id', user.id)
      .order('artist', { ascending: true })
      .order('title', { ascending: true }),
  ])

  if (setlistResult.error || !setlistResult.data) {
    notFound()
  }

  const setlist = setlistResult.data
  const setlistSongs = setlistSongsResult.data || []
  const allSongs = allSongsResult.data || []

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/home" className="text-gray-600 hover:text-gray-900">
            &larr; Back
          </Link>
          <Link
            href={`/setlist/${params.id}/play`}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Display Setlist
          </Link>
        </div>
        <SetlistEditor
          setlist={setlist}
          setlistSongs={setlistSongs}
          allSongs={allSongs}
        />
      </div>
    </div>
  )
}
