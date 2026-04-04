'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addToCart, setCartOpen } from '@/lib/cartSlice';
import { toast } from 'sonner';

export default function ProductPage({ params }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
        if (data.product.sizes && data.product.sizes.length > 0) {
          setSelectedSize(data.product.sizes[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image,
      size: selectedSize,
      quantity,
    }));

    toast.success('Added to cart!');
    dispatch(setCartOpen(true));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Product not found</p>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-white text-black px-4 py-2 rounded-full font-semibold">
                  {product.discount}% OFF
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-400 uppercase text-sm tracking-wide">{product.category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-400 text-sm">(4.8 / 5)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              {product.discount > 0 ? (
                <>
                  <span className="text-4xl font-bold">₹{product.salePrice}</span>
                  <span className="text-2xl text-gray-500 line-through">₹{product.price}</span>
                </>
              ) : (
                <span className="text-4xl font-bold">₹{product.price}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed">
              {product.description || 'Premium quality product designed for comfort and style.'}
            </p>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-white bg-white text-black'
                        : 'border-zinc-700 hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-white text-black hover:bg-gray-200 py-6 text-lg font-semibold"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Bag
              </Button>
              <Button
                variant="outline"
                className="px-6 py-6 border-2 border-zinc-700 hover:border-white"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Product Info */}
            <div className="border-t border-zinc-800 pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Stock</span>
                <span className="text-green-400">In Stock ({product.stock || 0})</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">SKU</span>
                <span>{product.id.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
