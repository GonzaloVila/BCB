import { Link } from 'react-router-dom'
import { Tag, AlertCircle } from 'lucide-react'
import { formatPrice, PRODUCT_CONDITIONS } from '../../lib/constants'

function CoverImage({ images, name }) {
  const cover = images?.find((img) => img.is_cover) || images?.[0]
  return (
    <div className="aspect-square w-full overflow-hidden bg-gray-100">
      {cover ? (
        <img
          src={cover.url}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default function ProductCard({ product }) {
  const {
    id,
    name,
    brand,
    price,
    condition,
    is_available,
    categories,
    product_images,
  } = product

  return (
    <Link
      to={`/producto/${id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col border border-transparent hover:border-blue-100"
    >
      <div className="relative">
        <CoverImage images={product_images} name={name} />

        {/* Condition badge */}
        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
            condition === 'nuevo'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {PRODUCT_CONDITIONS[condition] || condition}
        </span>

        {/* Unavailable overlay */}
        {!is_available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Sin stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-1">
        {/* Category */}
        {categories && (
          <span className="text-xs text-blue-500 font-medium flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {categories.name}
          </span>
        )}

        {/* Name */}
        <h3
          className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mt-0.5"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {name}
        </h3>

        {/* Brand */}
        {brand && (
          <p className="text-xs text-gray-500">{brand}</p>
        )}

        {/* Price */}
        <div className="mt-auto pt-3">
          {price !== null && price !== undefined ? (
            <p
              className="text-base font-bold"
              style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
            >
              {formatPrice(price)}
            </p>
          ) : (
            <span
              className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ backgroundColor: 'rgba(255,107,0,0.1)', color: 'var(--color-accent)' }}
            >
              Consultar precio
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          className="mt-2 w-full py-2 rounded-lg text-sm font-semibold text-white transition-colors duration-150"
          style={{ backgroundColor: 'var(--color-primary)' }}
          tabIndex={-1}
        >
          Ver más
        </button>
      </div>
    </Link>
  )
}
