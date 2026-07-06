import { useEffect, useState, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function SearchBar({ placeholder = 'Buscar productos...' }) {
  const { searchQuery, setSearchQuery } = useStore()
  const [localValue, setLocalValue] = useState(searchQuery)
  const debounceRef = useRef(null)

  // Sync external changes (e.g., clearFilters)
  useEffect(() => {
    setLocalValue(searchQuery)
  }, [searchQuery])

  const handleChange = (e) => {
    const val = e.target.value
    setLocalValue(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchQuery(val)
    }, 300)
  }

  const handleClear = () => {
    setLocalValue('')
    setSearchQuery('')
    clearTimeout(debounceRef.current)
  }

  return (
    <div className="relative w-full">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
        style={{ '--tw-ring-color': 'var(--color-secondary)' }}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
