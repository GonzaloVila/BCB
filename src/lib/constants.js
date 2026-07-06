export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5491100000000'
export const STORE_NAME = import.meta.env.VITE_STORE_NAME || 'BCB Multielectro'

export const PRODUCT_CONDITIONS = {
  nuevo: 'Nuevo',
  usado: 'Usado',
}

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'name_asc', label: 'Nombre A-Z' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
]

export const PRODUCTS_PER_PAGE = 12

export const CATEGORY_ICONS = {
  cocina: '🍳',
  climatizacion: '❄️',
  lavado: '🫧',
  hogar: '🏠',
  refrigeracion: '🧊',
  audio: '🔊',
  television: '📺',
  default: '⚡',
}

export function buildWhatsAppUrl(productName) {
  const message = `Hola! Te consulto por el producto: ${productName}. ¿Está disponible? ¿Cuál es el precio?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function buildWhatsAppUrlGeneric() {
  const message = `Hola! Quisiera consultar sobre sus productos.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function formatPrice(price) {
  if (price === null || price === undefined) return null
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)
}
