'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NewSetlistButton() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleCreate = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('setlists')
        .insert({ name: 'New Setlist', user_id: user.id })
        .select()
        .single()

      if (error) throw error

      router.push(`/setlist/${data.id}`)
      router.refresh()
    } catch (err) {
      console.error('Error creating setlist:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Creating...' : 'Add Setlist'}
    </button>
  )
}
