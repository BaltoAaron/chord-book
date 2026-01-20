import Link from 'next/link'
import SongForm from '@/components/SongForm'

export default function NewSongPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">New Song</h1>
          <Link
            href="/home"
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Link>
        </div>
        <SongForm />
      </div>
    </div>
  )
}
