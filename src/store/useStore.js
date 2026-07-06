import { create } from 'zustand'

export const useStore = create((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Filter state (used by CatalogPage)
  searchQuery: '',
  selectedCategories: [],
  selectedBrands: [],
  selectedCondition: '',
  showAvailableOnly: false,
  sortBy: 'newest',

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleCategory: (categoryId) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(categoryId)
        ? state.selectedCategories.filter((id) => id !== categoryId)
        : [...state.selectedCategories, categoryId],
    })),

  toggleBrand: (brand) =>
    set((state) => ({
      selectedBrands: state.selectedBrands.includes(brand)
        ? state.selectedBrands.filter((b) => b !== brand)
        : [...state.selectedBrands, brand],
    })),

  setSelectedCondition: (condition) => set({ selectedCondition: condition }),
  setShowAvailableOnly: (value) => set({ showAvailableOnly: value }),
  setSortBy: (sortBy) => set({ sortBy }),

  clearFilters: () =>
    set({
      searchQuery: '',
      selectedCategories: [],
      selectedBrands: [],
      selectedCondition: '',
      showAvailableOnly: false,
      sortBy: 'newest',
    }),
}))
