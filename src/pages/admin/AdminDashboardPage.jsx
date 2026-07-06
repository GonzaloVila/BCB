import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LogOut,
  Plus,
  Package,
  Tag,
  Zap,
  Loader2,
  Trash2,
  X,
  LayoutDashboard,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth, useAdminProducts, useAdminCategories } from '../../hooks/useAdmin'
import AdminProductList from '../../components/admin/AdminProductList'
import AdminProductForm from '../../components/admin/AdminProductForm'
import { STORE_NAME, CATEGORY_ICONS } from '../../lib/constants'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
          {value}
        </p>
      </div>
    </div>
  )
}

function CategoryManager({ categories, loading, onCreate, onDelete }) {
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      await onCreate(newName.trim(), newIcon.trim())
      setNewName('')
      setNewIcon('')
      toast.success('Categoría creada')
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2
        className="font-bold text-gray-900 mb-5 flex items-center gap-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Tag className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
        Categorías
      </h2>

      {/* Create form */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-5">
        <input
          value={newIcon}
          onChange={(e) => setNewIcon(e.target.value)}
          placeholder="Emoji"
          className="w-16 px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-center"
          maxLength={2}
        />
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre de categoría"
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Crear
        </button>
      </form>

      {/* Category list */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-10 rounded-lg" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No hay categorías todavía</p>
      ) : (
        <ul className="space-y-1.5">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>{cat.icon || CATEGORY_ICONS[cat.slug] || CATEGORY_ICONS.default}</span>
                {cat.name}
                {cat.products?.[0]?.count > 0 && (
                  <span className="text-xs text-gray-400 font-normal">
                    ({cat.products[0].count})
                  </span>
                )}
              </span>
              <button
                onClick={() => {
                  if (confirm(`¿Eliminar categoría "${cat.name}"?`)) {
                    onDelete(cat.id).then(() => toast.success('Categoría eliminada')).catch((e) => toast.error(e.message))
                  }
                }}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth()
  const { products, loading: prodLoading, refetch } = useAdminProducts()
  const {
    categories,
    loading: catLoading,
    createCategory,
    deleteCategory,
  } = useAdminCategories()

  const [formProduct, setFormProduct] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  const openNew = () => {
    setFormProduct(null)
    setFormOpen(true)
  }

  const openEdit = (product) => {
    setFormProduct(product)
    setFormOpen(true)
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Sesión cerrada')
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Admin header */}
      <header
        className="sticky top-0 z-40 border-b shadow-sm"
        style={{ backgroundColor: 'var(--color-primary)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                {STORE_NAME}
              </span>
              <span className="text-blue-300 text-xs ml-2">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" className="text-blue-300 hover:text-white text-xs transition-colors hidden sm:block">
              Ver tienda
            </Link>
            <span className="text-blue-300 text-xs hidden sm:block truncate max-w-[140px]">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Package}
            label="Total productos"
            value={products.length}
            color="var(--color-primary)"
          />
          <StatCard
            icon={Tag}
            label="Categorías"
            value={categories.length}
            color="var(--color-secondary)"
          />
          <StatCard
            icon={LayoutDashboard}
            label="Disponibles"
            value={products.filter((p) => p.is_available).length}
            color="#22c55e"
          />
          <StatCard
            icon={Zap}
            label="Destacados"
            value={products.filter((p) => p.is_featured).length}
            color="var(--color-accent)"
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2
                  className="font-bold text-gray-900 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <Package className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  Productos
                </h2>
                <button
                  onClick={openNew}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  <Plus className="w-4 h-4" />
                  Agregar producto
                </button>
              </div>
              <div className="p-4">
                <AdminProductList
                  products={products}
                  loading={prodLoading}
                  onEdit={openEdit}
                  onRefetch={refetch}
                />
              </div>
            </div>
          </div>

          {/* Categories panel */}
          <div>
            <CategoryManager
              categories={categories}
              loading={catLoading}
              onCreate={createCategory}
              onDelete={deleteCategory}
            />
          </div>
        </div>
      </div>

      {/* Product form modal */}
      {formOpen && (
        <AdminProductForm
          product={formProduct}
          onClose={() => setFormOpen(false)}
          onSaved={refetch}
        />
      )}
    </div>
  )
}
