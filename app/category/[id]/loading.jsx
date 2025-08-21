export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
      </div>

      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border p-4">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
