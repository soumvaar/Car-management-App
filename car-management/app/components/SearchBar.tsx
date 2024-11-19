'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/?query=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cars..."
        className="border p-2 rounded mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>
    </form>
  )
}