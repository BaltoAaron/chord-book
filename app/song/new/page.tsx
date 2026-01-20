import Link from 'next/link'
import SongForm from '@/components/SongForm'

export default function NewSongPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">New Song</h1>
          <Link
            href="/home"
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Link>
        </div>
        <SongForm />
      </div>
    </div>
  )
}
