import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Tag,
  ArrowLeft,
  Package,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { useProduct } from '../hooks/useProducts'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/products/ProductCard'
import ProductSkeleton from '../components/products/ProductSkeleton'
import {
  buildWhatsAppUrl,
  formatPrice,
  PRODUCT_CONDITIONS,
  STORE_NAME,
} from '../lib/constants'

function ImageGallery({ images }) {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(null)

  const prev = () => setCurrent((i) => Math.max(0, i - 1))
  const next = () => setCurrent((i) => Math.min(images.length - 1, i + 1))

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev()
    }
    touchStartX.current = null
  }

  const img = images[current]

  return (
    <div className="space-y-3">
      <div
        className="relative rounded-2xl overflow-hidden bg-gray-100 gallery-main"
        style={{ aspectRatio: '4/3' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {img ? (
          <img
            src={img.url}
            alt="Imagen del producto"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package className="w-20 h-20" />
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={current === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition-all disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={current === images.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-600 hover:bg-white transition-all disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all ${
                    i === current ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === current ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function RelatedProducts({ categoryId, currentId }) {
  const { products, loading } = useProducts({
    categories: categoryId ? [categoryId] : [],
    limit: 5,
  })

  const filtered = products.filter((p) => p.id !== currentId).slice(0, 4)

  if (!loading && !filtered.length) return null

  return (
    <section className="mt-16">
      <h2
        className="text-xl font-bold text-gray-900 mb-6"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Productos relacionados
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          : filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="skeleton rounded-2xl" style={{ aspectRatio: '4/3' }} />
          <div className="space-y-4">
            <div className="skeleton h-5 w-1/4 rounded-full" />
            <div className="skeleton h-8 w-3/4 rounded-xl" />
            <div className="skeleton h-4 w-1/2 rounded-full" />
            <div className="skeleton h-24 w-full rounded-xl mt-4" />
            <div className="skeleton h-12 w-full rounded-xl mt-4" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-gray-600 font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Producto no encontrado
        </h2>
        <Link to="/catalogo" className="text-sm" style={{ color: 'var(--color-secondary)' }}>
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const {
    name,
    description,
    price,
    brand,
    condition,
    is_available,
    categories,
    product_images,
  } = product

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-gray-600 transition-colors">
          Inicio
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/catalogo" className="hover:text-gray-600 transition-colors">
          Catálogo
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-600 truncate max-w-xs">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <ImageGallery images={product_images || []} />
        </div>

        {/* Info */}
        <div className="space-y-5">
          {/* Category + condition */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories && (
              <Link
                to={`/catalogo?categoria=${categories.id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {categories.name}
              </Link>
            )}
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                condition === 'nuevo'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {PRODUCT_CONDITIONS[condition] || condition}
            </span>
            {!is_available && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Sin stock
              </span>
            )}
          </div>

          {/* Name */}
          <h1
            className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {name}
          </h1>

          {/* Brand */}
          {brand && (
            <p className="text-sm text-gray-500">
              Marca: <span className="font-medium text-gray-700">{brand}</span>
            </p>
          )}

          {/* Price */}
          <div className="py-4 border-y border-gray-100">
            {price !== null && price !== undefined ? (
              <p
                className="text-3xl font-extrabold"
                style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
              >
                {formatPrice(price)}
              </p>
            ) : (
              <div>
                <span
                  className="inline-block text-lg font-bold px-4 py-1.5 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(255,107,0,0.1)',
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  Consultar precio
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  Contactanos por WhatsApp para conocer el precio actual
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide">
                Descripción
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {/* WhatsApp CTA */}
          <a
            href={buildWhatsAppUrl(name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white text-base shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: '#25D366', fontFamily: 'var(--font-display)' }}
          >
            <MessageCircle className="w-5 h-5" />
            Consultar por WhatsApp
          </a>

          <p className="text-xs text-center text-gray-400">
            Te respondemos a la brevedad con disponibilidad y precio actualizado
          </p>
        </div>
      </div>

      {/* Related products */}
      <RelatedProducts categoryId={categories?.id} currentId={id} />
    </div>
  )
}
