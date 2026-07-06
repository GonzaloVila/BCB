import { useState, useRef, useCallback } from 'react'
import { Upload, X, Star, GripVertical, ImagePlus } from 'lucide-react'

const MAX_FILE_SIZE_MB = 5
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function ImageUploader({ existingImages = [], newFiles = [], onChange }) {
  const fileInputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = useCallback(
    (files) => {
      const valid = Array.from(files).filter((f) => {
        if (!ACCEPTED_TYPES.includes(f.type)) return false
        if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return false
        return true
      })

      const withPreviews = valid.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }))

      onChange({ existingImages, newFiles: [...newFiles, ...withPreviews] })
    },
    [existingImages, newFiles, onChange],
  )

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeExisting = (id) => {
    onChange({ existingImages: existingImages.filter((img) => img.id !== id), newFiles })
  }

  const removeNew = (id) => {
    const removed = newFiles.find((f) => f.id === id)
    if (removed) URL.revokeObjectURL(removed.previewUrl)
    onChange({ existingImages, newFiles: newFiles.filter((f) => f.id !== id) })
  }

  const setCoverExisting = (id) => {
    onChange({
      existingImages: existingImages.map((img) => ({ ...img, is_cover: img.id === id })),
      newFiles: newFiles.map((f) => ({ ...f, is_cover: false })),
    })
  }

  const setCoverNew = (id) => {
    onChange({
      existingImages: existingImages.map((img) => ({ ...img, is_cover: false })),
      newFiles: newFiles.map((f) => ({ ...f, is_cover: f.id === id })),
    })
  }

  const allImages = [
    ...existingImages.map((img) => ({ ...img, type: 'existing' })),
    ...newFiles.map((f) => ({ id: f.id, url: f.previewUrl, is_cover: f.is_cover, type: 'new' })),
  ]

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <ImagePlus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-medium text-gray-600">
          Arrastrá imágenes aquí o{' '}
          <span className="underline" style={{ color: 'var(--color-secondary)' }}>
            hacé clic para elegir
          </span>
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · máx. {MAX_FILE_SIZE_MB}MB cada una</p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Preview grid */}
      {allImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {allImages.map((img) => (
            <div
              key={img.id}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                img.is_cover ? 'border-amber-400 shadow-md' : 'border-transparent'
              }`}
            >
              <div className="aspect-square bg-gray-100">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Cover star */}
              <button
                type="button"
                onClick={() =>
                  img.type === 'existing' ? setCoverExisting(img.id) : setCoverNew(img.id)
                }
                className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  img.is_cover
                    ? 'bg-amber-400 text-white'
                    : 'bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100'
                }`}
                title={img.is_cover ? 'Portada' : 'Establecer como portada'}
              >
                <Star className="w-3.5 h-3.5" fill={img.is_cover ? 'currentColor' : 'none'} />
              </button>

              {/* Remove button */}
              <button
                type="button"
                onClick={() =>
                  img.type === 'existing' ? removeExisting(img.id) : removeNew(img.id)
                }
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Eliminar imagen"
              >
                <X className="w-3 h-3" />
              </button>

              {img.is_cover && (
                <div className="absolute bottom-0 inset-x-0 bg-amber-400 text-white text-xs font-semibold text-center py-0.5">
                  Portada
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
