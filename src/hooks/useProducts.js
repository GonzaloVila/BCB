import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'

function sortImages(images) {
  return (images || []).sort((a, b) => a.order - b.order)
}

export function useProducts({
  search = '',
  categories = [],
  brands = [],
  condition = '',
  availableOnly = false,
  sortBy = 'newest',
  featuredOnly = false,
  limit = null,
} = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categoriesKey = useMemo(() => JSON.stringify(categories), [categories])
  const brandsKey = useMemo(() => JSON.stringify(brands), [brands])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('products')
        .select('*, categories(id, name, slug, icon), product_images(id, url, is_cover, order)')

      if (search) query = query.ilike('name', `%${search}%`)
      if (categories.length > 0) query = query.in('category_id', categories)
      if (brands.length > 0) query = query.in('brand', brands)
      if (condition) query = query.eq('condition', condition)
      if (availableOnly) query = query.eq('is_available', true)
      if (featuredOnly) query = query.eq('is_featured', true)

      switch (sortBy) {
        case 'name_asc':
          query = query.order('name', { ascending: true })
          break
        case 'price_asc':
          query = query.order('price', { ascending: true, nullsLast: true })
          break
        case 'price_desc':
          query = query.order('price', { ascending: false, nullsLast: true })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      if (limit) query = query.limit(limit)

      const { data, error } = await query
      if (error) throw error

      const processed = (data || []).map((p) => ({
        ...p,
        product_images: sortImages(p.product_images),
      }))
      setProducts(processed)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoriesKey, brandsKey, condition, availableOnly, sortBy, featuredOnly, limit])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function fetchProduct() {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, categories(id, name, slug, icon), product_images(id, url, is_cover, order)')
          .eq('id', id)
          .single()

        if (error) throw error
        if (!cancelled) {
          setProduct({ ...data, product_images: sortImages(data.product_images) })
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProduct()
    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}

export function useAllBrands() {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    async function fetchBrands() {
      const { data } = await supabase
        .from('products')
        .select('brand')
        .not('brand', 'is', null)
        .neq('brand', '')
      if (data) {
        const unique = [...new Set(data.map((p) => p.brand))].sort()
        setBrands(unique)
      }
    }
    fetchBrands()
  }, [])

  return brands
}
