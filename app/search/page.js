'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Search, Filter } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      searchProducts(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const searchProducts = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        // Filter products based on search query
        const filtered = data.products.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setProducts(filtered);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className=\"min-h-screen pt-16 bg-black\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16\">
        {/* Search Header */}
        <div className=\"mb-12\">
          <h1 className=\"text-4xl font-bold mb-6\">
            {query ? `Search Results for \"${query}\"` : 'Search Products'}
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className=\"relative max-w-2xl\">
            <input
              type=\"text\"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder=\"Search for products...\"
              className=\"w-full bg-zinc-900 border border-zinc-800 rounded-full px-6 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-500\"
            />
            <Search className=\"absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500\" />
            {searchInput && (
              <button
                type=\"submit\"
                className=\"absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors\"
              >
                Search
              </button>
            )}
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6\">
            {[...Array(8)].map((_, i) => (
              <div key={i} className=\"animate-pulse\">
                <div className=\"bg-zinc-800 rounded-lg aspect-[3/4] mb-4\" />
                <div className=\"bg-zinc-800 h-4 rounded mb-2\" />
                <div className=\"bg-zinc-800 h-4 rounded w-2/3\" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className=\"text-center py-20\"
          >
            <Search className=\"w-24 h-24 mx-auto mb-6 text-gray-600\" />
            <h2 className=\"text-2xl font-bold mb-4\">
              {query ? 'No products found' : 'Start searching'}
            </h2>
            <p className=\"text-gray-400 mb-8\">
              {query 
                ? `We couldn't find any products matching \"${query}\". Try searching with different keywords.`
                : 'Enter a search term to find products'
              }
            </p>
            {query && (
              <button
                onClick={() => router.push('/')}
                className=\"px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors\"
              >
                Browse All Products
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div className=\"flex justify-between items-center mb-8\">
              <p className=\"text-gray-400\">
                Found {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6\">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => router.push(`/product/${product.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
