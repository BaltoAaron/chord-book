import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SongForm from '@/components/SongForm'

interface EditSongPageProps {
  params: { id: string }
}

export default async function EditSongPage({ params }: EditSongPageProps) {
  const supabase = createClient()

  const { data: song, error } = await supabase
    .from('songs')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !song) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Song</h1>
          <Link
            href="/home"
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Link>
        </div>
        <SongForm song={song} />
      </div>
    </div>
  )
}
