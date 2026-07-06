import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/filters/SearchBar'
import FilterPanel from '../components/filters/FilterPanel'
import ProductGrid from '../components/products/ProductGrid'
import { useStore } from '../store/useStore'
import { useCategories } from '../hooks/useCategories'
import { useProducts, useAllBrands } from '../hooks/useProducts'

function ActiveFilters() {
  const {
    searchQuery,
    selectedCategories,
    selectedBrands,
    selectedCondition,
    showAvailableOnly,
    toggleCategory,
    toggleBrand,
    setSelectedCondition,
    setShowAvailableOnly,
    clearFilters,
  } = useStore()
  const { categories } = useCategories()

  const chips = [
    ...selectedCategories.map((id) => {
      const cat = categories.find((c) => c.id === id)
      return cat ? { label: cat.name, onRemove: () => toggleCategory(id) } : null
    }),
    ...selectedBrands.map((b) => ({ label: b, onRemove: () => toggleBrand(b) })),
    selectedCondition
      ? {
          label: selectedCondition === 'nuevo' ? 'Nuevo' : 'Usado',
          onRemove: () => setSelectedCondition(''),
        }
      : null,
    showAvailableOnly
      ? { label: 'Solo disponibles', onRemove: () => setShowAvailableOnly(false) }
      : null,
  ].filter(Boolean)

  if (!chips.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs text-gray-500 font-medium">Filtros activos:</span>
      {chips.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="text-blue-400 hover:text-blue-700 transition-colors"
          >
            ×
          </button>
        </span>
      ))}
      <button
        onClick={clearFilters}
        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
      >
        Limpiar todos
      </button>
    </div>
  )
}

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const {
    searchQuery,
    selectedCategories,
    selectedBrands,
    selectedCondition,
    showAvailableOnly,
    sortBy,
    toggleCategory,
    clearFilters,
  } = useStore()

  const { categories } = useCategories()
  const brands = useAllBrands()

  // Apply category param from URL (e.g. from HomePage category click)
  useEffect(() => {
    const categoryId = searchParams.get('categoria')
    if (categoryId && !selectedCategories.includes(categoryId)) {
      clearFilters()
      toggleCategory(categoryId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { products, loading } = useProducts({
    search: searchQuery,
    categories: selectedCategories,
    brands: selectedBrands,
    condition: selectedCondition,
    availableOnly: showAvailableOnly,
    sortBy,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Catálogo de productos
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {loading ? 'Cargando...' : `${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchBar />
      </div>

      {/* Active filter chips */}
      <ActiveFilters />

      {/* Layout: filter sidebar + grid */}
      <div className="flex gap-6 items-start">
        <FilterPanel categories={categories} brands={brands} />

        <div className="flex-1 min-w-0">
          <ProductGrid
            products={products}
            loading={loading}
            emptyMessage="No encontramos productos con esos filtros"
          />
        </div>
      </div>
    </div>
  )
}
