import React from 'react';

/**
 * PaginationControls component for product pagination
 * @param {Object} props - Component props
 * @param {Object} props.meta - Pagination metadata from Strapi
 * @param {number} props.currentPage - Current page number
 * @param {Function} props.onPageChange - Page change handler function
 * @param {boolean} props.loading - Loading state indicator
 */
function PaginationControls({ meta, currentPage, onPageChange, loading = false }) {
  // Don't render if no pagination data or only one page
  if (!meta || !meta.pagination || meta.pagination.pageCount <= 1) {
    return null;
  }

  const { page, pageCount, total } = meta.pagination;
  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;

  const handlePrevious = () => {
    if (!isFirstPage && !loading) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage && !loading) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {/* Page info */}
      <div className="text-sm text-gray-600 text-center">
        صفحة {page} من {pageCount} ({total} منتج)
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2 space-x-reverse">
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={isFirstPage || loading}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isFirstPage || loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          السابق
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1 space-x-reverse">
          {/* Show first page if not visible */}
          {page > 3 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                disabled={loading}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                1
              </button>
              {page > 4 && <span className="text-gray-400">...</span>}
            </>
          )}

          {/* Show pages around current page */}
          {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
            let pageNum;
            if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= pageCount - 2) {
              pageNum = pageCount - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            if (pageNum < 1 || pageNum > pageCount) return null;

            const isCurrentPage = pageNum === page;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isCurrentPage
                    ? 'bg-blue-500 text-white'
                    : loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Show last page if not visible */}
          {page < pageCount - 2 && (
            <>
              {page < pageCount - 3 && <span className="text-gray-400">...</span>}
              <button
                onClick={() => onPageChange(pageCount)}
                disabled={loading}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageCount}
              </button>
            </>
          )}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={isLastPage || loading}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isLastPage || loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          التالي
        </button>
      </div>
    </div>
  );
}

export default PaginationControls;
