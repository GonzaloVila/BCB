import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Zap } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/products/ProductCard'
import ProductSkeleton from '../components/products/ProductSkeleton'
import { STORE_NAME, CATEGORY_ICONS } from '../lib/constants'

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-24"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, var(--color-secondary) 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
           style={{ background: 'radial-gradient(circle, var(--color-accent), transparent)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
           style={{ background: 'radial-gradient(circle, var(--color-secondary), transparent)', transform: 'translate(-30%, 30%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
          <Zap className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
          Electrodomésticos y artículos para el hogar
        </div>

        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
        >
          Todo lo que tu hogar
          <br />
          <span style={{ color: 'var(--color-accent)' }}>necesita</span>, en un solo lugar
        </h1>

        <p className="text-lg text-blue-200 max-w-xl mx-auto mb-8">
          Calidad, variedad y las mejores marcas al mejor precio. Consultá disponibilidad directo por WhatsApp.
        </p>

        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ backgroundColor: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}
        >
          Ver catálogo completo
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}

function CategoryCard({ category }) {
  const icon = category.icon || CATEGORY_ICONS[category.slug] || CATEGORY_ICONS.default
  return (
    <Link
      to={`/catalogo?categoria=${category.id}`}
      className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-blue-100"
    >
      <span className="text-3xl">{icon}</span>
      <span
        className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors text-center"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {category.name}
      </span>
    </Link>
  )
}

function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl">
      <div className="skeleton w-8 h-8 rounded-full" />
      <div className="skeleton h-3 w-16 rounded-full" />
    </div>
  )
}

function CategoriesSection({ categories, loading }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Explorá por categoría
            </h2>
            <p className="text-sm text-gray-500 mt-1">Encontrá lo que buscás fácilmente</p>
          </div>
          <Link
            to="/catalogo"
            className="hidden sm:flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--color-secondary)' }}
          >
            Ver todo <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
            : categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)}
        </div>
      </div>
    </section>
  )
}

function FeaturedSection({ products, loading }) {
  return (
    <section className="py-16" style={{ backgroundColor: 'rgba(10,36,99,0.04)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Productos destacados
            </h2>
            <p className="text-sm text-gray-500 mt-1">Los más consultados de la semana</p>
          </div>
          <Link
            to="/catalogo"
            className="hidden sm:flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--color-secondary)' }}
          >
            Ver catálogo <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
          >
            Ver todos los productos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { categories, loading: catLoading } = useCategories()
  const { products, loading: prodLoading } = useProducts({ featuredOnly: true, limit: 8 })

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} loading={catLoading} />
      <FeaturedSection products={products} loading={prodLoading} />
    </>
  )
}
