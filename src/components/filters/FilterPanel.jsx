import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { SORT_OPTIONS, PRODUCT_CONDITIONS } from '../../lib/constants'

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0">
      <button
        className="flex items-center justify-between w-full text-left mb-3"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && children}
    </div>
  )
}

function CheckItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
        style={{ accentColor: 'var(--color-primary)' }}
      />
      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </label>
  )
}

function FilterContent({ categories, brands, onClose }) {
  const {
    selectedCategories,
    toggleCategory,
    selectedBrands,
    toggleBrand,
    selectedCondition,
    setSelectedCondition,
    showAvailableOnly,
    setShowAvailableOnly,
    sortBy,
    setSortBy,
    clearFilters,
    searchQuery,
  } = useStore()

  const hasActive =
    searchQuery !== '' ||
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedCondition !== '' ||
    showAvailableOnly

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
          Filtros
        </h2>
        <div className="flex items-center gap-2">
          {hasActive && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              Limpiar todo
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Sort */}
        <FilterSection title="Ordenar por">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1"
            style={{ '--tw-ring-color': 'var(--color-secondary)' }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FilterSection>

        {/* Categories */}
        {categories.length > 0 && (
          <FilterSection title="Categoría">
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <CheckItem
                  key={cat.id}
                  label={`${cat.icon ? cat.icon + ' ' : ''}${cat.name}`}
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <FilterSection title="Marca">
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <CheckItem
                  key={brand}
                  label={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Condition */}
        <FilterSection title="Condición">
          <div className="space-y-1">
            <CheckItem
              label="Todos"
              checked={selectedCondition === ''}
              onChange={() => setSelectedCondition('')}
            />
            {Object.entries(PRODUCT_CONDITIONS).map(([value, label]) => (
              <CheckItem
                key={value}
                label={label}
                checked={selectedCondition === value}
                onChange={() => setSelectedCondition(value === selectedCondition ? '' : value)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Disponibilidad">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <div
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                showAvailableOnly ? 'bg-primary' : 'bg-gray-200'
              }`}
              style={showAvailableOnly ? { backgroundColor: 'var(--color-primary)' } : {}}
              onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  showAvailableOnly ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </div>
            <span className="text-sm text-gray-600">Solo disponibles</span>
          </label>
        </FilterSection>
      </div>
    </div>
  )
}

export default function FilterPanel({ categories = [], brands = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const {
    selectedCategories,
    selectedBrands,
    selectedCondition,
    showAvailableOnly,
    searchQuery,
  } = useStore()

  const activeCount = [
    searchQuery !== '',
    selectedCategories.length > 0,
    selectedBrands.length > 0,
    selectedCondition !== '',
    showAvailableOnly,
  ].filter(Boolean).length

  return (
    <>
      {/* Mobile trigger button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-xs font-bold flex items-center justify-center"
                  style={{ color: 'var(--color-accent)' }}>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-xl p-5 shadow-sm sticky top-20">
          <FilterContent categories={categories} brands={brands} />
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] bg-white shadow-xl p-5 lg:hidden overflow-y-auto">
            <FilterContent
              categories={categories}
              brands={brands}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </>
      )}
    </>
  )
}
