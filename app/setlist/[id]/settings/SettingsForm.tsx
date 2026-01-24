'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Setlist } from '@/lib/types'

interface SettingsFormProps {
  setlist: Setlist
}

export default function SettingsForm({ setlist }: SettingsFormProps) {
  const [alphabeticalOrder, setAlphabeticalOrder] = useState(
    setlist.settings?.alphabetical_order ?? false
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleToggle = async () => {
    const newValue = !alphabeticalOrder
    setAlphabeticalOrder(newValue)
    setSaving(true)
    setMessage(null)

    const supabase = createClient()
    const { error } = await supabase
      .from('setlists')
      .update({
        settings: { alphabetical_order: newValue },
        updated_at: new Date().toISOString(),
      })
      .eq('id', setlist.id)

    setSaving(false)

    if (error) {
      setAlphabeticalOrder(!newValue) // Revert on error
      setMessage({ type: 'error', text: 'Failed to save setting' })
    } else {
      setMessage({ type: 'success', text: 'Setting saved' })
      setTimeout(() => setMessage(null), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="alphabetical-toggle" className="text-sm font-medium text-gray-900">
            Alphabetical Order
          </label>
          <p className="text-sm text-gray-500">
            Sort songs alphabetically in display mode
          </p>
        </div>
        <button
          id="alphabetical-toggle"
          type="button"
          role="switch"
          aria-checked={alphabeticalOrder}
          disabled={saving}
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            alphabeticalOrder ? 'bg-green-600' : 'bg-gray-200'
          } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              alphabeticalOrder ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  )
}
