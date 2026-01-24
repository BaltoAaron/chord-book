import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SettingsForm from './SettingsForm'

interface SettingsPageProps {
  params: { id: string }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: setlist, error } = await supabase
    .from('setlists')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !setlist) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href={`/setlist/${params.id}`} className="text-gray-600 hover:text-gray-900">
            &larr; Back
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Setlist Settings</h1>
          <p className="text-gray-600 mb-6">{setlist.name}</p>
          <SettingsForm setlist={setlist} />
        </div>
      </div>
    </div>
  )
}
