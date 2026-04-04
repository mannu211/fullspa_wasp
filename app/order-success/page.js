'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <CheckCircle className="w-24 h-24 mx-auto text-green-400" />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-xl text-gray-400 mb-8">
          Thank you for your purchase. We'll send you a confirmation email shortly.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-300 mb-2">Your order is being processed</p>
          <p className="text-sm text-gray-500">You can track your order from your profile</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/profile">
            <Button className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-6">
              View Orders
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-2 border-zinc-700 hover:border-white px-8 py-6">
              <Home className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
