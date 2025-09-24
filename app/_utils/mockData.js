// Mock data for testing pagination and search functionality
const mockProducts = [
  {
    id: 1,
    documentId: 'mock-1',
    title: 'عسل السدر الطبيعي',
    price: 150,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=عسل' }],
    category: 'honey',
    description: 'عسل طبيعي من أشجار السدر'
  },
  {
    id: 2,
    documentId: 'mock-2',
    title: 'زيت الزيتون البكر',
    price: 85,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=زيت' }],
    category: 'oils',
    description: 'زيت زيتون بكر ممتاز'
  },
  {
    id: 3,
    documentId: 'mock-3',
    title: 'حبة البركة المطحونة',
    price: 35,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=حبة+البركة' }],
    category: 'herbs',
    description: 'حبة البركة مطحونة ناعم'
  },
  {
    id: 4,
    documentId: 'mock-4',
    title: 'زعتر برّي مجفف',
    price: 25,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=زعتر' }],
    category: 'herbs',
    description: 'زعتر برّي مجفف طبيعي'
  },
  {
    id: 5,
    documentId: 'mock-5',
    title: 'كركم هندي خالص',
    price: 45,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=كركم' }],
    category: 'spices',
    description: 'كركم هندي أصلي مطحون'
  },
  {
    id: 6,
    documentId: 'mock-6',
    title: 'زنجبيل مطحون',
    price: 30,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=زنجبيل' }],
    category: 'spices',
    description: 'زنجبيل مطحون ناعم'
  },
  {
    id: 7,
    documentId: 'mock-7',
    title: 'شاي أخضر صيني',
    price: 60,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=شاي' }],
    category: 'tea',
    description: 'شاي أخضر صيني عالي الجودة'
  },
  {
    id: 8,
    documentId: 'mock-8',
    title: 'عكبر النحل الطبيعي',
    price: 120,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=عكبر' }],
    category: 'honey',
    description: 'عكبر نحل طبيعي 100%'
  },
  {
    id: 9,
    documentId: 'mock-9',
    title: 'بذور الكتان',
    price: 40,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=كتان' }],
    category: 'seeds',
    description: 'بذور الكتان الطبيعية'
  },
  {
    id: 10,
    documentId: 'mock-10',
    title: 'حلبة مطحونة',
    price: 28,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=حلبة' }],
    category: 'herbs',
    description: 'حلبة مطحونة ناعم'
  },
  {
    id: 11,
    documentId: 'mock-11',
    title: 'قرفة سيلانية أصلية',
    price: 55,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=قرفة' }],
    category: 'spices',
    description: 'قرفة سيلانية أصلية عالية الجودة'
  },
  {
    id: 12,
    documentId: 'mock-12',
    title: 'هيل أخضر فاخر',
    price: 95,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=هيل' }],
    category: 'spices',
    description: 'هيل أخضر فاخر أصلي'
  },
  {
    id: 13,
    documentId: 'mock-13',
    title: 'نعناع مجفف',
    price: 22,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=نعناع' }],
    category: 'herbs',
    description: 'نعناع مجفف طبيعي'
  },
  {
    id: 14,
    documentId: 'mock-14',
    title: 'بابونج للاسترخاء',
    price: 35,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=بابونج' }],
    category: 'herbs',
    description: 'أزهار البابونج للاسترخاء'
  },
  {
    id: 15,
    documentId: 'mock-15',
    title: 'عسل الأكاسيا',
    price: 135,
    banner: [{ url: 'https://via.placeholder.com/300x200?text=أكاسيا' }],
    category: 'honey',
    description: 'عسل الأكاسيا الطبيعي'
  }
]

// Mock API function for search and pagination
export const getMockProducts = ({ searchQuery = '', page = 1, pageSize = 12 } = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter products based on search query
      let filteredProducts = mockProducts
      if (searchQuery.trim()) {
        filteredProducts = mockProducts.filter(product =>
          product.title.includes(searchQuery.trim()) ||
          product.description.includes(searchQuery.trim())
        )
      }

      // Calculate pagination
      const totalCount = filteredProducts.length
      const totalPages = Math.ceil(totalCount / pageSize)
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

      // Mock Strapi v5 response structure
      const response = {
        data: paginatedProducts,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: totalPages,
            total: totalCount
          }
        }
      }

      resolve(response)
    }, 500) // Simulate API delay
  })
}

export default mockProducts