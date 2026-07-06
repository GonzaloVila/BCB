import { useState, useEffect } from 'react'
import { X, Loader2, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { useProductAdmin } from '../../hooks/useAdmin'
import { useAdminCategories } from '../../hooks/useAdmin'
import ImageUploader from './ImageUploader'
import { PRODUCT_CONDITIONS } from '../../lib/constants'

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  brand: '',
  condition: 'nuevo',
  category_id: '',
  is_available: true,
  is_featured: false,
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function Input({ error, ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
        error
          ? 'border-red-300 focus:ring-red-200'
          : 'border-gray-200 focus:ring-blue-100 focus:border-blue-400'
      }`}
    />
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer`}
        style={{ backgroundColor: checked ? 'var(--color-primary)' : '#d1d5db' }}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}

export default function AdminProductForm({ product, onClose, onSaved }) {
  const { saving, saveProduct } = useProductAdmin()
  const { categories } = useAdminCategories()

  const [form, setForm] = useState(() => {
    if (!product) return EMPTY_FORM
    return {
      id: product.id,
      name: product.name || '',
      description: product.description || '',
      price: product.price != null ? String(product.price) : '',
      brand: product.brand || '',
      condition: product.condition || 'nuevo',
      category_id: product.category_id || '',
      is_available: product.is_available ?? true,
      is_featured: product.is_featured ?? false,
    }
  })

  const [imageState, setImageState] = useState({
    existingImages: product?.product_images || [],
    newFiles: [],
  })

  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    const val = e.target ? e.target.value : e
    setForm((prev) => ({ ...prev, [field]: val }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'El nombre es requerido'
    if (form.price && isNaN(Number(form.price))) errs.price = 'Precio inválido'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    try {
      const payload = {
        ...form,
        price: form.price !== '' ? Number(form.price) : null,
        category_id: form.category_id || null,
      }

      const newFileObjects = imageState.newFiles.map((f) => f.file)
      await saveProduct(payload, newFileObjects, imageState.existingImages)
      toast.success(product ? 'Producto actualizado' : 'Producto creado')
      onSaved?.()
      onClose()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: '#f1f5f9' }}
          >
            <h2 className="font-bold text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
              {product ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Name */}
            <div>
              <Label required>Nombre del producto</Label>
              <Input
                value={form.name}
                onChange={set('name')}
                placeholder="Ej: Heladera Samsung No Frost 380L"
                error={errors.name}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <Label>Descripción</Label>
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={3}
                placeholder="Descripción detallada del producto..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition-colors"
              />
            </div>

            {/* Price + Brand */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Precio (ARS)</Label>
                <Input
                  value={form.price}
                  onChange={set('price')}
                  placeholder="Dejar vacío = consultar"
                  type="number"
                  min="0"
                  step="0.01"
                  error={errors.price}
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
              <div>
                <Label>Marca</Label>
                <Input
                  value={form.brand}
                  onChange={set('brand')}
                  placeholder="Ej: Samsung"
                />
              </div>
            </div>

            {/* Category + Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoría</Label>
                <select
                  value={form.category_id}
                  onChange={set('category_id')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Condición</Label>
                <select
                  value={form.condition}
                  onChange={set('condition')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                >
                  {Object.entries(PRODUCT_CONDITIONS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-8">
              <Toggle
                checked={form.is_available}
                onChange={(v) => setForm((prev) => ({ ...prev, is_available: v }))}
                label="Disponible"
              />
              <Toggle
                checked={form.is_featured}
                onChange={(v) => setForm((prev) => ({ ...prev, is_featured: v }))}
                label="Destacado en home"
              />
            </div>

            {/* Images */}
            <div>
              <Label>Imágenes</Label>
              <ImageUploader
                existingImages={imageState.existingImages}
                newFiles={imageState.newFiles}
                onChange={setImageState}
              />
            </div>
          </form>

          {/* Footer */}
          <div
            className="flex justify-end gap-3 px-6 py-4 border-t"
            style={{ borderColor: '#f1f5f9' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
