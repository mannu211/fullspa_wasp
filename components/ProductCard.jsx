'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ProductCard = ({ product, onClick }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-zinc-900 rounded-lg aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {product.discount && (
          <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-xs font-semibold rounded">
            {product.discount}% OFF
          </div>
        )}
        
        {product.isNew && (
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur text-white px-3 py-1 text-xs font-semibold rounded">
            NEW
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Quick View
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {product.discount ? (
            <>
              <span className="text-white font-semibold">₹{product.salePrice}</span>
              <span className="text-gray-500 text-sm line-through">₹{product.price}</span>
            </>
          ) : (
            <span className="text-white font-semibold">₹{product.price}</span>
          )}
        </div>
        {product.category && (
          <p className="text-xs text-gray-500">{product.category}</p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
