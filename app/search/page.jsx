'use client'
import React from 'react'
import ProductSection from '../_components/ProductSection'

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">البحث في المنتجات</h1>
          <p className="text-lg text-gray-600">ابحث عن المنتجات التي تريدها واستعرضها بسهولة</p>
        </div>
        
        <ProductSection />
      </div>
    </div>
  )
}
