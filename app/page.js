'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { ArrowRight, Sparkles, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1638717366457-dbcaf6b1afbc',
    tag: 'New Arrival',
    title: 'Elegance Redefined',
    description: 'Discover our exclusive collection of premium fashion that speaks luxury',
    cta: 'Explore Collection'
  },
  {
    image: 'https://images.unsplash.com/photo-1611140606588-dd052558ffb8',
    tag: 'Heritage Collection',
    title: 'Traditional Charm',
    description: 'Embrace the timeless beauty of Indian heritage with our curated selection',
    cta: 'Shop Traditional'
  },
  {
    image: 'https://images.unsplash.com/photo-1611351903570-bb4d3499c046',
    tag: 'Trending Now',
    title: 'Korean Elegance',
    description: 'Stay ahead with the latest K-fashion trends and styles',
    cta: 'Discover K-Fashion'
  },
];

const categories = [
  {
    name: 'Indian Wear',
    image: 'https://images.unsplash.com/photo-1600430665436-d4ff685937eb',
    href: '/category/indian',
    description: 'Traditional elegance'
  },
  {
    name: 'Western',
    image: 'https://images.unsplash.com/photo-1571222787436-74868e84af34',
    href: '/category/western',
    description: 'Modern sophistication'
  },
  {
    name: 'Korean Fashion',
    image: 'https://images.unsplash.com/photo-1611352110288-9e204ae300bb',
    href: '/category/korean',
    description: 'Trendy & chic'
  },
  {
    name: 'Denim',
    image: 'https://images.unsplash.com/photo-1588371995259-c69a24964e5d',
    href: '/category/jeans',
    description: 'Timeless classics'
  },
];

export default function HomePage() {
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=8');
      const data = await response.json();
      if (data.success) {
        setFeaturedProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-400 text-lg">Explore our curated collections</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={category.name} href={category.href}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h2 className="text-4xl sm:text-5xl font-bold">Featured Collection</h2>
            </div>
            <p className="text-gray-400 text-lg">Handpicked pieces just for you</p>
          </motion.div>

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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => router.push(`/product/${product.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Discount Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto bg-gradient-to-r from-purple-900 to-pink-900 rounded-3xl p-12 sm:p-16 text-center"
        >
          <h2 className="text-4xl sm:text-6xl font-bold mb-4">Summer Sale</h2>
          <p className="text-xl sm:text-2xl text-gray-200 mb-8">Up to 50% off on selected items</p>
          <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
            Shop Sale
          </button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-semibold mb-2">Latest Trends</h3>
            <p className="text-gray-400">Stay ahead with our curated fashion trends</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Award className="w-12 h-12 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-400">Handpicked fabrics and materials</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-semibold mb-2">Exclusive Designs</h3>
            <p className="text-gray-400">Unique pieces you won't find anywhere else</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
