import { useState } from 'react'
import { Pencil, Trash2, Star, StarOff, Loader2, AlertTriangle, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { useProductAdmin } from '../../hooks/useAdmin'
import { formatPrice, PRODUCT_CONDITIONS } from '../../lib/constants'

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-sm text-gray-700 pt-2">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminProductList({ products, loading, onEdit, onRefetch }) {
  const { deleting, deleteProduct, toggleFeatured } = useProductAdmin()
  const [confirmId, setConfirmId] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const handleDelete = async () => {
    if (!confirmId) return
    try {
      await deleteProduct(confirmId)
      toast.success('Producto eliminado')
      onRefetch()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setConfirmId(null)
    }
  }

  const handleToggleFeatured = async (product) => {
    setTogglingId(product.id)
    try {
      await toggleFeatured(product.id, product.is_featured)
      toast.success(product.is_featured ? 'Quitado de destacados' : 'Marcado como destacado')
      onRefetch()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setTogglingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <Package className="w-12 h-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No hay productos todavía</p>
        <p className="text-sm text-gray-400">Hacé clic en "Agregar producto" para empezar</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['Producto', 'Categoría', 'Precio', 'Estado', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => {
              const cover =
                p.product_images?.find((img) => img.is_cover) || p.product_images?.[0]
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {cover ? (
                          <img src={cover.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">
                          {p.brand} · {PRODUCT_CONDITIONS[p.condition]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {p.categories?.name || '—'}
                  </td>
                  <td className="py-3 px-4 font-medium" style={{ color: 'var(--color-primary)' }}>
                    {p.price != null ? formatPrice(p.price) : (
                      <span className="text-orange-500 text-xs">Consultar</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.is_available
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.is_available ? 'bg-green-500' : 'bg-red-500'}`} />
                      {p.is_available ? 'Disponible' : 'Sin stock'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        disabled={togglingId === p.id}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.is_featured
                            ? 'text-amber-500 hover:bg-amber-50'
                            : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'
                        }`}
                        title={p.is_featured ? 'Quitar destacado' : 'Destacar'}
                      >
                        {togglingId === p.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : p.is_featured ? (
                          <Star className="w-4 h-4" fill="currentColor" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmId(p.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {products.map((p) => {
          const cover = p.product_images?.find((img) => img.is_cover) || p.product_images?.[0]
          return (
            <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0">
                {cover ? (
                  <img src={cover.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Package className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{p.categories?.name || '—'} · {p.brand}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--color-primary)' }}>
                  {p.price != null ? formatPrice(p.price) : 'Consultar'}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => onEdit(p)} className="p-1.5 text-gray-400 hover:text-blue-600">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setConfirmId(p.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {confirmId && (
        <ConfirmDialog
          message="¿Seguro que querés eliminar este producto? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </>
  )
}
