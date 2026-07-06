import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useStore } from '../store/useStore'

export function useAuth() {
  const { user, setUser } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signIn, signOut }
}

export function useProductAdmin() {
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const uploadImages = async (files, productId) => {
    return Promise.all(
      files.map(async (file, index) => {
        const ext = file.name.split('.').pop()
        const path = `${productId}/${Date.now()}_${index}.${ext}`
        const { error } = await supabase.storage
          .from('product-images')
          .upload(path, file, { upsert: true })
        if (error) throw error
        const {
          data: { publicUrl },
        } = supabase.storage.from('product-images').getPublicUrl(path)
        return publicUrl
      }),
    )
  }

  const saveProduct = async (productData, newFiles = [], existingImagesState = []) => {
    setSaving(true)
    try {
      const isNew = !productData.id
      let productId = productData.id

      const { id, ...fields } = productData
      fields.updated_at = new Date().toISOString()

      if (isNew) {
        const { data, error } = await supabase
          .from('products')
          .insert(fields)
          .select()
          .single()
        if (error) throw error
        productId = data.id
      } else {
        const { error } = await supabase
          .from('products')
          .update(fields)
          .eq('id', productId)
        if (error) throw error
      }

      // Upload new images
      if (newFiles.length > 0) {
        const urls = await uploadImages(newFiles, productId)
        const baseOrder = existingImagesState.length
        const imageRows = urls.map((url, i) => ({
          product_id: productId,
          url,
          is_cover: baseOrder === 0 && i === 0,
          order: baseOrder + i,
        }))
        const { error } = await supabase.from('product_images').insert(imageRows)
        if (error) throw error
      }

      // Update existing image cover/order changes
      for (const img of existingImagesState) {
        await supabase
          .from('product_images')
          .update({ is_cover: img.is_cover, order: img.order })
          .eq('id', img.id)
      }

      return productId
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (productId) => {
    setDeleting(true)
    try {
      const { data: images } = await supabase
        .from('product_images')
        .select('url')
        .eq('product_id', productId)

      if (images?.length) {
        const paths = images
          .map((img) => {
            try {
              const url = new URL(img.url)
              const parts = url.pathname.split('/product-images/')
              return parts[1] || null
            } catch {
              return null
            }
          })
          .filter(Boolean)
        if (paths.length) {
          await supabase.storage.from('product-images').remove(paths)
        }
      }

      const { error } = await supabase.from('products').delete().eq('id', productId)
      if (error) throw error
    } finally {
      setDeleting(false)
    }
  }

  const toggleFeatured = async (productId, currentValue) => {
    const { error } = await supabase
      .from('products')
      .update({ is_featured: !currentValue })
      .eq('id', productId)
    if (error) throw error
  }

  const deleteImage = async (imageId, imageUrl) => {
    try {
      const url = new URL(imageUrl)
      const path = url.pathname.split('/product-images/')[1]
      if (path) await supabase.storage.from('product-images').remove([path])
    } catch {
      // URL parse failed; skip storage deletion
    }
    const { error } = await supabase.from('product_images').delete().eq('id', imageId)
    if (error) throw error
  }

  return { saving, deleting, saveProduct, deleteProduct, toggleFeatured, deleteImage }
}

export function useAdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*, categories(name), product_images(url, is_cover, order)')
      .order('created_at', { ascending: false })
    if (data) {
      setProducts(
        data.map((p) => ({
          ...p,
          product_images: (p.product_images || []).sort((a, b) => a.order - b.order),
        })),
      )
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, loading, refetch: fetchProducts }
}

export function useAdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*, products(count)')
      .order('name')
    if (data) setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const createCategory = async (name, icon = '') => {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
    const { error } = await supabase.from('categories').insert({ name, slug, icon })
    if (error) throw error
    await fetchCategories()
  }

  const deleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    await fetchCategories()
  }

  return { categories, loading, createCategory, deleteCategory, refetch: fetchCategories }
}
