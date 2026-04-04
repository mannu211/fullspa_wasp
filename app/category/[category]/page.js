'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';

const categoryInfo = {
  indian: {
    title: 'Indian Wear',
    description: 'Traditional elegance meets modern style',
    banner: 'https://images.unsplash.com/photo-1600430665436-d4ff685937eb',
  },
  western: {
    title: 'Western Fashion',
    description: 'Contemporary styles for the modern woman',
    banner: 'https://images.unsplash.com/photo-1571222787436-74868e84af34',
  },
  korean: {
    title: 'Korean Fashion',
    description: 'Trendy K-fashion for style enthusiasts',
    banner: 'https://images.unsplash.com/photo-1611351903570-bb4d3499c046',
  },
  jeans: {
    title: 'Denim Collection',
    description: 'Timeless jeans and denim wear',
    banner: 'https://images.unsplash.com/photo-1588371995259-c69a24964e5d',
  },
  tops: {
    title: 'Tops & Blouses',
    description: 'Stylish tops for every occasion',
    banner: 'https://images.unsplash.com/photo-1578901787297-6ee2f54334fd',
  },
};

export default function CategoryPage({ params }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  
  const category = params.category;
  const info = categoryInfo[category] || categoryInfo.western;

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products?category=${category}`);
      const data = await response.json();
      if (data.success) {
        let sorted = data.products;
        if (sortBy === 'price-low') {
          sorted = sorted.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          sorted = sorted.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
          sorted = sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        setProducts(sorted);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Category Banner */}
      <div className="relative h-[40vh] w-full">
        <img
          src={info.banner}
          alt={info.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl font-bold mb-4">{info.title}</h1>
              <p className="text-xl text-gray-300">{info.description}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters and Sort */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-gray-400">
            <Filter className="w-5 h-5" />
            <span>{products.length} Products</span>
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 pr-10 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-zinc-800 rounded-lg aspect-[3/4] mb-4" />
                <div className="bg-zinc-800 h-4 rounded mb-2" />
                <div className="bg-zinc-800 h-4 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => router.push(`/product/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
