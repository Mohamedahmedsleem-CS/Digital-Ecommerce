import React from 'react'
import ProductItem from './ProductItem';

function ProductList({productList}) {
  // Debug logging
  console.log('ProductList received:', productList);
  console.log('ProductList type:', typeof productList);
  console.log('ProductList is array:', Array.isArray(productList));
  console.log('ProductList length:', productList?.length);

  // Helper function to determine grid columns based on item count
  // const getGridColumns = (itemCount) => {
  //   if (itemCount <= 3) return 'grid-cols-1'
  //   if (itemCount <= 6) return 'grid-cols-1 md:grid-cols-2'
  //   if (itemCount <= 9) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
  //   return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  // }

  // Safety check to ensure productList exists and is an array
  // if (!productList || !Array.isArray(productList)) {
    // return (
    //   <div className="flex items-center justify-center min-h-[400px]">
    //     <div className="text-center">
    //       <div className="text-6xl mb-4">📦</div>
    //       <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Available</h3>
    //       <p className="text-gray-500">Check console for debugging information</p>
    //     </div>
    //   </div>
    // )
  // }

  const items = Array.isArray(productList) ? productList : (productList?.data ?? []);

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">No similar products</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
        {items.map((item) => (
          <ProductItem
            product={item}
            key={item.documentId || item.id}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductList