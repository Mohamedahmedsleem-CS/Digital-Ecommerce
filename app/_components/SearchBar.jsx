'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const router = useRouter();
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  // Search with debounce
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=5`);
        const data = await response.json();
        
        if (data.success) {
          setResults(data.data || []);
          setShowResults(true);
        } else {
          setResults([]);
          setShowResults(false);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setShowResults(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setLoading(false);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsOpen(true);
              if (results.length > 0) setShowResults(true);
            }}
            placeholder="البحث عن المنتجات..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-right"
          />
          
          {/* Search Icon */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          
          {/* Loading or Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              {results.map((product) => (
                <Link
                  key={product.documentId || product.id}
                  href={`/product-details/${product.documentId || product.id}`}
                  onClick={handleResultClick}
                  className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    {product.image?.url && (
                      <img
                        src={product.image.url}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 text-right">
                      <h4 className="font-medium text-gray-900 line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {product.category}
                      </p>
                      <p className="text-sm font-medium text-teal-600">
                        {product.price} ر.س
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* View All Results */}
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={handleResultClick}
                className="block px-4 py-3 text-center text-teal-600 hover:bg-teal-50 font-medium border-t border-gray-100"
              >
                عرض جميع النتائج ({results.length > 5 ? '+' : ''}...)
              </Link>
            </>
          ) : query.trim().length >= 2 && !loading ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>لم يتم العثور على نتائج</p>
              <p className="text-sm mt-1">جرب كلمات مختلفة للبحث</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default SearchBar;